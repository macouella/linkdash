module.exports = async () => {
  return {
    title: "Welcome to my linkdash!", // title of the page

    // a list of static urls to build the linkdash list from
    urls: [
      {
        title: "Visit Github",
        href: "https://github.com",
        group: "Site",
        keywords: "search for something",
      },
      {
        title: "View dev logs",
        href: "https://google.com",
        group: "Site",
        keywords: "search for something",
      },
      {
        title: "View CRM",
        href: "https://pipedrive.com",
        group: "Site",
        keywords: "search for something",
      },
      {
        title: "Google Analytics",
        href: "https://analytics.google.com",
        group: "Site",
        keywords: "search for something",
      },
      {
        title: "Visit website",
        href: "https://cnn.com",
        group: "Site",
        keywords: "search for something",
      },
      {
        title: "Open email",
        href: "https://gmail.com",
        group: "Email",
        keywords: "email me today",
      },
      {
        title: "Make friends",
        href: "https://facebook.com",
        group: "Social",
        keywords: "social media",
      },
    ],

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
