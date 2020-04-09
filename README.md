![Linkdash](https://raw.githubusercontent.com/igimanaloto/linkdash/master/readme_assets/linkdash.png)

# Linkdash

> Generate a handy dashboard of links in seconds.

## Demo

Visit https://linkdash.now.sh or try it locally!

```sh
npx linkdash --host https://linkdash.now.sh/api/demo-config
```

## Why?

On a personal level, you might want a quick way to <s>build</s> browse through your important links.

On a professional team level, you might want a stored and filterable list of predefined things to do.

## Usage

```sh
[yarn/npm] add --dev linkdash

# Print the help menu
[yarn/npx] linkdash --help

# Create a config file
[yarn/npx] linkdash --init

# Create a dashboard and open in the browser
[yarn/npx] linkdash
```

## The config

```js
// linkdash.config.js
// notice how this is async - you may go crazy and do promise-based tasks here.

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
```

## Under the hood

Linkdash simply swaps the contents of a prebuilt html file with your config. Check out the [package.json ](https://github.com/igimanaloto/linkdash/blob/master/package.json) to see the three depedencies it installs!

## Happy customers

<p align="center">
  I never thought I'd never write another personal dashboard.
  <br><br>
  Snape Livingston
</p>

## Other applications

- Smart url schemas exist everywhere, from `mailto:`, to `tel:` to app-specific calls like `skype:`, `spotify:` and `slack:`. Get creative!
- If security and collaboration is required, you may utilise the `buildTemplate` helper in your favourite http kernel `express`, `http` or `serverless function`. That way, you can decide which authorization approach to secure your links dashboard with.
- Feel free to fork to customise the html for your needs. (webpack / react / ts)

## Future plans

[ ] Add a --spreadsheet option to read off Google sheets.
