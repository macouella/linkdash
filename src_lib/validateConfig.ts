/**
 * Validates the minimum config required for a template to be built.
 */
const validateConfig = (fileOptions: any) => {
  if (typeof fileOptions !== "object" || !fileOptions || (!fileOptions.urls && !fileOptions.host)) {
    throw Error("Invalid config supplied");
  }
};

export default validateConfig;
