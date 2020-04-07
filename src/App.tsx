import axios from "axios";
import { snakeCase } from "change-case";
import qs from "qs";
import * as React from "react";
import { ILinkdashCliOptions, IQueryLinkdashConfig } from "../src_lib/types";
import "./app.sass";
import Terminal from "./Terminal";

const App = function () {
  const [config, setConfig] = React.useState<ILinkdashCliOptions>({});
  const [isLoadingDone, setIsLoadingDone] = React.useState<boolean>(false);
  React.useEffect(() => {
    (async () => {
      const windowConfig: ILinkdashCliOptions = (window as any).linkdashConfig || {};
      const qu: IQueryLinkdashConfig = qs.parse(location.search.slice(1));
      let confie = { ...windowConfig, ...qu };
      const host = confie.host;

      if (confie.title) {
        document.title = confie.title;
      }

      try {
        if (host) {
          const hostConfig = await axios.get<ILinkdashCliOptions>(host);
          confie = { ...confie, ...hostConfig.data };
        }

        if (!confie.urls) throw Error("Unable to load any urls");

        confie.urls = confie.urls.map((x) => ({
          id: snakeCase([x.group, x.title].join("_")),
          count: 0,
          ...x,
        }));
        setConfig(confie);
      } catch (e) {
        setConfig({ host });
        console.error(e);
      } finally {
        setIsLoadingDone(true);
      }
    })();
  }, []);

  const loadType = config.host ? config.host.split("?")[0] : "window config";

  return <Terminal loadType={loadType} isLoadingDone={isLoadingDone} rows={config.urls} />;
};

export default App;
