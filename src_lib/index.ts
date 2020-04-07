/* eslint-disable @typescript-eslint/no-var-requires */
import fs from "fs";
import path from "path";
import { ILinkdashCliOptions } from "./types";

const TEMPLATE_BASE = path.resolve(__dirname, "../dist/index.html");

/**
 * Validates the minimum config required for a template to be built.
 */
const validateConfig = (fileOptions: any) => {
  if (typeof fileOptions !== "object" || !fileOptions || (!fileOptions.urls && !fileOptions.host)) {
    throw Error("Invalid config supplied");
  }
};

/**
 * Builds a template with the provided options.
 */
export const buildTemplate = (options: ILinkdashCliOptions) => {
  validateConfig(options);
  let template = fs.readFileSync(TEMPLATE_BASE).toString();
  const { htmlHead, ...filteredOptions } = options;
  template = template.replace(
    "//_linkdashOptions",
    `window.linkdashConfig = JSON.parse('${JSON.stringify(filteredOptions)}')`
  );

  template = template.replace("<!--linkdashHead-->", htmlHead || "");

  return template;
};

/**
 * Loads a config file.
 */
const loadFile = (fileToLoad: string) => {
  fileToLoad = path.resolve(fileToLoad);
  const file: (() => ILinkdashCliOptions) | ILinkdashCliOptions = require(fileToLoad);
  return file;
};

/**
 * Loads and runs a given file if it is a function.
 */
export const loadConfig = async (fileToLoad: string) => {
  const file = loadFile(fileToLoad);
  if (typeof file === "function") {
    return file();
  } else {
    return file;
  }
};

/**
 * Loads and synchronously runs a given file if it is a function.
 */
export const loadConfigSync = (fileToLoad: string) => {
  const file = loadFile(fileToLoad);
  let fileOptions = file as ILinkdashCliOptions;
  if (typeof file === "function") fileOptions = file();
  return fileOptions;
};

/**
 * Synchronously builds a template from a given config file.
 */
export const buildTemplateFromConfigFileSync = (fileToLoad: string) => {
  const fileOptions = loadConfigSync(fileToLoad);
  return buildTemplate(fileOptions);
};

/**
 * Asynchronously builds a template from a given config file.
 */
export const buildTemplateFromConfigFile = async (fileToLoad: string) => {
  const fileOptions = await loadConfig(fileToLoad);
  return buildTemplate(fileOptions);
};
