import { ILinkdashFileConfig } from "./types";

/**
 * Validates the minimum config required for a template to be built.
 */
const validateConfig = (fileOptions: ILinkdashFileConfig) => {
  if (typeof fileOptions !== "object" || !fileOptions || (!fileOptions.urls && !fileOptions.host)) {
    throw Error("Invalid config supplied");
  }
};

export default validateConfig;
