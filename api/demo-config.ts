/**
 * Zeit serverless function, available at linkdash.now.sh/api/demo-config
 */
import { NowRequest, NowResponse } from "@now/node";
import path from "path";
const demoConfig = require(path.resolve(__dirname, "../demo/demo.config.js"))();

export default (req: NowRequest, res: NowResponse) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  res.status(200).send(demoConfig);
};
