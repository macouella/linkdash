/* eslint-disable @typescript-eslint/no-var-requires */
import fs from "fs";
import jsesc from "jsesc";
import path from "path";
import loadFile from "./loadFile";
import { IBuildTemplateOptions } from "./types";
import validateConfig from "./validateConfig";

const TEMPLATE_BASE = path.resolve(__dirname, "../build/index.html");

/**
 * Builds a template with the provided options.
 */
export const buildTemplate = (options: IBuildTemplateOptions) => {
  validateConfig(options);
  let template = fs.readFileSync(TEMPLATE_BASE).toString();
  const { htmlHead, ...filteredOptions } = options;
  const escapedConfig = jsesc(filteredOptions as any, {
    isScriptContext: true,
    json: true,
  });
  template = template.replace("//_linkdashConfig", `window.linkdashConfig = ${escapedConfig};`);

  template = template.replace('<meta name="linkdashHead" content=""/>', htmlHead || "");

  return template;
};

/**
 * Loads and runs a given config file if it is a function.
 */
export const loadConfig = async (fileToLoad: string) => {
  const file = loadFile(fileToLoad);
  if (typeof file === "function") {
    return file();
  }
  return file;
};

/**
 * Loads and synchronously runs a given config file if it is a function.
 */
export const loadConfigSync = (fileToLoad: string) => {
  const file = loadFile(fileToLoad);
  if (typeof file === "function") {
    return file();
  }
  return file;
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

export * from "./types";
