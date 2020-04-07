/* eslint-disable @typescript-eslint/no-var-requires */
import fs from "fs";
import path from "path";
import { ILinkdashConfig } from "./types";

const TEMPLATE_BASE = path.resolve(__dirname, "../dist/index.html");

/**
 * Validates the minimum config required for a template to be built.
 */
const validateConfig = (fileOptions: any) => {
  if (typeof fileOptions !== "object" || !fileOptions || !fileOptions.urls) {
    throw Error("Invalid config supplied");
  }
};

/**
 * Builds a template with the provided options.
 */
export const buildTemplate = (options: ILinkdashConfig) => {
  validateConfig(options);
  let template = fs.readFileSync(TEMPLATE_BASE).toString();
  template = template.replace(
    /\/\/_linkshopUrl/gi,
    `window.linkdashConfig = JSON.parse('${JSON.stringify(options)}')`
  );
  return template;
};

/**
 * Loads a config file.
 */
const loadFile = (fileToLoad: string) => {
  fileToLoad = path.resolve(fileToLoad);
  const file: (() => ILinkdashConfig) | ILinkdashConfig = require(fileToLoad);
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
  let fileOptions = file as ILinkdashConfig;
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
