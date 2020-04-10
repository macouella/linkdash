import { NowRequest, NowResponse } from "@now/node";
import connect, { HandleFunction } from "connect";
import path from "path";
import { createServerWithHelpers } from "./custom-now-server";

const app = connect();

app.use(((req: NowRequest, res: NowResponse) => {
  if (req.url!.startsWith("/api")) {
    const reqs = path.join(process.cwd(), "./api", req.url!.replace("/api", ""));
    try {
      return require(reqs).default(res, res);
    } catch (e) {
      if (e.code === "MODULE_NOT_FOUND") {
        return res.status(404).send("Not found");
      } else {
        throw e;
      }
    }
  } else {
    res.status(404).send("Not found");
  }
}) as HandleFunction);

//create node.js http server and listen on port
createServerWithHelpers(app)
  .listen(4040)
  .on("listening", () => {
    console.log("server started: http://localhost:4040");
  });
