#!/usr/bin/env node

import commandLineArgs from "command-line-args";
import commandLineUsage from "command-line-usage";
import * as fs from "fs";
import * as path from "path";
import { getFileToLoad, mergeOptions, processTemplate, validateOptions } from "./binHelpers";
import { ILinkdashCliOptions } from "./types";

export const DEFAULT_FILENAME = "linkdash.html";
export const DEFAULT_CONFIG_FILE = "linkdash.config.js";
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
  {
    name: "init",
    type: Boolean,
    description: "Creates a linkdash config file in your project path.",
  },
  {
    name: "config",
    type: String,
    defaultOption: true,
    description: "The path to a linkdash config",
  },
  { name: "host", type: String, description: "A url that responds with a linkdash-like config." },
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
    content: "Generate a handy dashboard of links in seconds.",
  },
  {
    header: "Synopsis",
    content: [
      "$ linkdash",
      "$ linkdash --init",
      "$ linkdash --config ./customlinkdash.config.js",
      "$ linkdash --host https://linkdash.now.sh/api/demo-config",
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

const logHelp = (exitCode = 0) => {
  console.log(usage);
  if (exitCode === 0) {
    console.log("No linkdash.config.js found. Generate one using npx linkdash --init");
  }

  process.exit(exitCode);
};

const copyConfigFile = () => {
  if (!fs.existsSync(CONFIG_COPY_PATH)) {
    fs.copyFileSync(CONFIG_TEMPLATE, CONFIG_COPY_PATH);
    console.log("Config file created: ", CONFIG_COPY_PATH);
    process.exit(0);
  } else {
    console.log("Prevented an overwrite. Delete your existing config first.");
    process.exit(1);
  }
};

const main = async () => {
  // Immediately exit if requesting help
  if (options.help) {
    logHelp();
  } else if (options.init) {
    copyConfigFile();
  }

  const fileToLoad = getFileToLoad(DEFAULT_CONFIG_PATH, options.config);
  const opts = await mergeOptions(options, fileToLoad);
  validateOptions(opts);
  const isProcessable = opts.host || fileToLoad;
  if (isProcessable) {
    processTemplate(opts, DEFAULT_FILENAME);
  } else {
    logHelp(0);
  }
};

main();
