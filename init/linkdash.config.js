module.exports = async () => {
  return {
    title: "Welcome to my linkdash!",

    // a static list of urls to build the linkdash list from
    urls: [
      {
        title: "Visit Github",
        href: "https://github.com",
        group: "Site",
      },
    ],
    // [OR]
    // specifiy a host to grab the config from
    // host: "https://linkdash.now.sh/api/demo-config",

    disableOpen: false,
    output: "./linkdash.html",
    htmlHead: `
      <meta name="robots" content="noindex" />
    `.trim(),
  };
};
