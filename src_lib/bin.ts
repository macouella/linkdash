#!/usr/bin/node

import commandLineArgs from "command-line-args";
import commandLineUsage from "command-line-usage";
import * as fs from "fs";
import open from "open";
import * as path from "path";
import { buildTemplate, loadConfig } from ".";
import { ILinkdashCliOptions } from "./types";

const DEFAULT_FILENAME = "linkdash.html";
const DEFAULT_CONFIG_FILE = "linkdash.config.js";
const DEFAULT_CONFIG_PATH = path.resolve(process.cwd(), DEFAULT_CONFIG_FILE);
const CONFIG_TEMPLATE = path.resolve(__dirname, "../init", DEFAULT_CONFIG_FILE);
const CONFIG_COPY_PATH = path.join(process.cwd(), DEFAULT_CONFIG_FILE);

const optionDefinitions: Array<{
  name: keyof ILinkdashCliOptions;
  type?: typeof String | typeof Boolean;
  defaultOption?: boolean;
  description: string;
  alias?: string;
  typeLabel?: string;
}> = [
  { name: "init", type: Boolean, description: "Creates a base config file in your project path." },
  {
    name: "config",
    type: String,
    defaultOption: true,
    description: "The path to a linkdash config",
  },
  { name: "host", type: String, description: "A url that serves dashlink urls" },
  {
    name: "output",
    type: String,
    description: `The path of the generated file or {underline text} to pipe out to the terminal / stdout`.trim(),
  },
  { name: "disableOpen", type: Boolean, description: "Disable auto-opening the generated file" },
  { name: "title", type: String, description: "The page title" },
  { name: "help", alias: "h", type: Boolean, description: "Print this menu" },
];

const sections = [
  {
    header: "Linkdash",
    content: "A dashboard of links",
  },
  {
    header: "Synopsis",
    content: [
      "$ linkdash",
      "$ linkdash --init",
      "$ linkdash --config myfile.js",
      "$ linkdash --host http://yourcustomapi.com/urls",
      "$ linkdash {bold --help}",
    ],
  },
  {
    header: "Options",
    optionList: optionDefinitions,
  },
];

const usage = commandLineUsage(sections);
const options = commandLineArgs(optionDefinitions) as ILinkdashCliOptions;

const exitInvalidFile = () => {
  console.error(
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
  "host": "https://yourapi.com/x",
}
`.trim()
  );
  process.exit(1);
};

/**
 * Recursively creates directories for a specified filePath.
 */
const ensureDirectoryExistence = (filePath: string) => {
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
const mergeOptions = async (fileToLoad?: string) => {
  let opts = { ...options };
  if (fileToLoad) {
    opts = {
      ...opts,
      ...(await loadConfig(fileToLoad)),
    };
  }
  return opts;
};

/**
 * Saves a template to a file.
 */
const saveFile = ({
  output,
  template,
  disableOpen,
}: {
  output?: string;
  template: string;
  disableOpen?: boolean;
}) => {
  const outputFile =
    output !== "text" ? path.resolve(process.cwd(), output || DEFAULT_FILENAME) : output;
  ensureDirectoryExistence(outputFile);
  fs.writeFileSync(outputFile, template);
  if (!disableOpen) {
    open(outputFile);
  } else {
    console.log("linkdash: saved to", outputFile);
  }
};

/**
 * Validates cli options.
 */
const validateOptions = ({ output }: Partial<ILinkdashCliOptions>) => {
  if (output) {
    if (!output.match(/(.html$|text)/)) {
      console.log("Please provide a valid html output path e.g. ./something/index.html");
      process.exit(1);
    }
  }
};

/**
 * Builds a template and outputs to a file or stdout
 */
const processTemplate = (opts: ILinkdashCliOptions) => {
  try {
    const template = buildTemplate(opts);
    const { output, disableOpen } = opts;

    if (output === "text") {
      // log to console
      console.log(template);
    } else {
      saveFile({
        output,
        template,
        disableOpen,
      });
    }
  } catch (e) {
    exitInvalidFile();
  }
};

/**
 * Gets a file to load.
 */
const getFileToLoad = (configPath?: string) => {
  const isJSExists = fs.existsSync(DEFAULT_CONFIG_PATH);
  let fileToLoad = configPath && path.resolve(process.cwd(), configPath);
  if (!fileToLoad && isJSExists) {
    fileToLoad = DEFAULT_CONFIG_PATH;
  }
  return fileToLoad;
};

const main = async () => {
  // Immediately exit if requesting help
  if (options.help) {
    console.log(usage);
    process.exit(0);
  } else if (options.init) {
    fs.copyFileSync(CONFIG_TEMPLATE, CONFIG_COPY_PATH);
    console.log("Config file created: ", CONFIG_COPY_PATH);
    process.exit(0);
  }

  const fileToLoad = getFileToLoad(options.config);
  const opts = await mergeOptions(fileToLoad);
  validateOptions(opts);
  const isProcessable = opts.host || fileToLoad;
  if (isProcessable) {
    processTemplate(opts);
  } else {
    console.log(usage);
    console.log("No linkdash.config.js found. Generate one using npx linkdash --init");
    process.exit(0);
  }
};

main();
