import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { parse } from "querystringify";
import { IBaseLinkdashConfig } from "../src_lib/types";
import "./app.sass";
import Terminal from "./Terminal";
import words from "./words";

const App = function () {
  const [config, setConfig] = useState<IBaseLinkdashConfig>({});
  const [isLoadingDone, setIsLoadingDone] = useState<boolean>(false);
  useEffect(() => {
    (async () => {
      const windowConfig: IBaseLinkdashConfig = (window as any).linkdashConfig || {};
      const qu: IBaseLinkdashConfig = parse(location.search.slice(1));
      let confie = { ...windowConfig, ...qu };
      const host = confie.host;

      if (confie.title) {
        document.title = confie.title;
      }

      try {
        if (host) {
          const hostConfig: IBaseLinkdashConfig = await fetch(host).then((res) => res.json());
          confie = { ...confie, ...hostConfig };
        }

        if (!confie.urls) throw Error(words.errorLoading);

        confie.urls = confie.urls.map((x) => {
          console.log([x.group, x.title].join("_"));
          return {
            id:
              x.id ||
              [x.group, x.title]
                .join(" ")
                .match(/[a-zA-Z0-9]+/g)!
                .join("_"),
            count: 0,
            catchall: [x.group, x.title, x.keywords].join(" "),
            ...x,
          };
        });
        setConfig(confie);
      } catch (e) {
        setConfig({ host });
        console.error(e);
      } finally {
        setIsLoadingDone(true);
      }
    })();
  }, []);

  const loadType = config.host ? config.host.split("?")[0] : words.typeWindowConfig;

  return (
    <Terminal
      enableAutoMenu={config.enableAutoMenu}
      loadType={loadType}
      isLoadingDone={isLoadingDone}
      rows={config.urls}
    />
  );
};

export default App;
