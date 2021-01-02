/* eslint-disable @typescript-eslint/prefer-regexp-exec */
/* eslint-disable unicorn/no-lonely-if */
/* eslint-disable unicorn/no-process-exit */
import * as fs from "fs";
import path from "path";
import open from "open";
import { ILinkdashCliMergedOptions } from "./types";
import { buildTemplate, loadConfig } from ".";

/**
 * Gets a file to load.
 */
export const getFileToLoad = (defaultValue: string, configPath?: string) => {
  const isJSExists = fs.existsSync(defaultValue);
  let fileToLoad = configPath && path.resolve(process.cwd(), configPath);
  if (!fileToLoad && isJSExists) {
    fileToLoad = defaultValue;
  }
  return fileToLoad;
};

/**
 * Validates cli options.
 */
export const validateOptions = ({
  output,
  host,
  urls,
}: Partial<ILinkdashCliMergedOptions>) => {
  if (host) {
    if (!/^https?:\/\//.test(host)) {
      console.log(
        "Host needs include the full protocol e.g. https://linkdash.now.sh/api/demo-config"
      );
      process.exit(1);
    }
  }

  if (urls && host) {
    console.log(urls, host);
    console.log(
      "Found urls and host both in the same file. Only specify one or the other."
    );
    process.exit(1);
  }

  if (output) {
    if (!output.match(/(.html?$|text)/)) {
      console.log(
        "Please provide a valid html output path e.g. ./something/index.html"
      );
      process.exit(1);
    }
  }
};

/**
 * Recursively creates directories for a specified filePath.
 */
export const ensureDirectoryExistence = (filePath: string) => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
};

/**
 * Merges cli and file-based options.
 */
export const mergeOptions = async (
  options: ILinkdashCliMergedOptions,
  fileToLoad?: string
) => {
  let opts = { ...options };
  if (fileToLoad) {
    const fileConfig = await loadConfig(fileToLoad);

    opts = {
      ...fileConfig,
      ...options, // flags take precedence over config file values
    };

    // When flag is specified, remove urls
    if (options.host) {
      delete opts.urls;
    }
  }
  return opts;
};

export const exitInvalidFile = () => {
  console.log(
    `Missing urls or host in your config:

// linkdash.config.js
module.exports = async () => {
  // if using the static urls option
  "urls": [
    {
      "group": "group",
      "title": "title",
      "href": "href",
      "keywords": "optional list of searchable keywords"
    }
  ],
  // if using the host option
  "host": "https://linkdash.now.sh/api/demo-config",
}
`.trim()
  );
  process.exit(1);
};

/**
 * Saves a template to a file.
 */
export const logOrSaveTemplate = ({
  output,
  template,
  disableOpen,
  fallbackFilename,
}: {
  output?: string;
  fallbackFilename: string;
  template: string;
  disableOpen?: boolean;
}) => {
  if (output === "text") {
    console.log(template);
  } else {
    const outputFile = path.resolve(process.cwd(), output || fallbackFilename);
    ensureDirectoryExistence(outputFile);
    fs.writeFileSync(outputFile, template);
    if (!disableOpen) {
      open(outputFile);
    }
  }
};

/**
 * Builds a template and outputs to a file or stdout
 */
export const processTemplate = (
  opts: ILinkdashCliMergedOptions,
  fallbackFilename: string
) => {
  try {
    const template = buildTemplate(opts);
    const { output, disableOpen } = opts;
    logOrSaveTemplate({
      output,
      template,
      disableOpen,
      fallbackFilename,
    });
  } catch (e) {
    exitInvalidFile();
  }
};
