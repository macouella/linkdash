import path from "path";
import { ILinkdashFileConfig, ILinkdashFileConfigFn } from "./types";

/**
 * Loads a config file.
 */
const loadFile = (fileToLoad: string) => {
  fileToLoad = path.resolve(fileToLoad);
  const file: ILinkdashFileConfig | ILinkdashFileConfigFn = require(fileToLoad);
  return file;
};

export default loadFile;
