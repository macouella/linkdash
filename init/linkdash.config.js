module.exports = async () => {
  return {
    title: "Welcome to my linkdash!", // title of the page
    disableOpen: false, // disables auto-opening after a build
    output: "./linkdash.html", // outputs the generated template to the specified path

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

    // if using the host option, swap the urls for below
    // you'll need to return a payload similar to this config.
    // host: "http://yourapi.com/something",
  };
};
