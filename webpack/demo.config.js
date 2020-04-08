/**
 * Demo site config.
 */

const yaml = require("js-yaml");
const fs = require("fs");
const path = require("path");

module.exports = () => {
  // Get document, or throw exception on error
  const conf = fs.readFileSync(path.resolve(__dirname, "./conf.yaml"));
  const { urls } = yaml.safeLoad(conf);

  return {
    title: "Welcome to my linkdash!", // title of the page

    // a list of static urls to build the linkdash list from
    urls,

    // If using the host option, replace the urls above with the host
    // options below. You'll need to return a payload similar to this config.
    // host: "http://yourapi.com/something",

    // other options
    disableOpen: false, // disables auto-opening after a build
    output: "./linkdash.html", // outputs the generated template to the specified path

    // injects raw html to the <head>
    htmlHead: `
      <title>This title will show when no title is set above.</title>
      <meta name="robots" content="noindex" />
    `.trim(),
  };
};
