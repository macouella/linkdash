export default {
  nothing: "There's nothing here...",
  cantLoad: "Hmm... we can't seem to load",
  cantLoadCheck:
    "Please check your settings or if using the host option, ensure that your api responds with the following payload:",
  searchPlaceholder: "Search...",
  loaderMessage: "Loading urls from",
  reset: "reset stats",
  space: "\u00A0",
  typeWindowConfig: "window config",
  errorLoading: "Unable to load any urls",
  cantLoadExample: `
{
  urls: [
    {
      title: string;
      href: string;
      group: string;
      // optional fields
      id?: string;
      keywords?: string;
      count?: number;
      isBookmarked?: boolean
    }
  ]
}
`.trim(),
  menu: "menu",
  menuCommands: {
    "[arrow keys]": "navigate",
    "[enter]": "open a link",
    "[space]": "bookmark a link",
    "#b": "show bookmarks",
    "#t": "show top commands",
  },
  menuClose: "close",
};
