import path from "path";
import { ILinkdashCliOptions } from "./types";

/**
 * Loads a config file.
 */
const loadFile = (fileToLoad: string) => {
  fileToLoad = path.resolve(fileToLoad);
  const file: (() => ILinkdashCliOptions) | ILinkdashCliOptions = require(fileToLoad);
  return file;
};

export default loadFile;
