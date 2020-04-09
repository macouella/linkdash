/**
 * Zeit serverless function, available at linkdash.now.sh/api/demo-config
 */
import { NowRequest, NowResponse } from "@now/node";
import path from "path";
const demoConfig = require(path.resolve(__dirname, "../demo/demo.config.js"))();

export default (req: NowRequest, res: NowResponse) => {
  res
    .writeHead(200, {
      "Access-Control-Allow-Origin": "*",
    })
    .send(demoConfig);
};
