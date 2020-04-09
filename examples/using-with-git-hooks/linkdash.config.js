const proc = require("child_process");
const lastCommitMessage = proc.execSync("git log -1").toString().trim();

module.exports = async () => {
  return {
    title: "A pre-hook examples!", // title of the page

    // here we have some of most important dev tasks that need to be carried out, after a git push
    urls: [
      {
        title: "Create a pull request",
        href: "https://github.com/igimanaloto/linkdash/compare?expand=1",
        group: "Dev",
      },
      {
        title: "Send email regarding my last commit message",
        href: `https://mail.google.com/mail/u/mytestemail@gmail.com/?view=cm&fs=1&su=${encodeURIComponent(
          "My last commit"
        )}&body=${encodeURIComponent(lastCommitMessage)}`,
        group: "Dev",
      },
      {
        title: "Open JIRA Dashboard",
        href: "https://jira.atlassian.com/",
        group: "Proj",
      },
      {
        title: "View server deployment logs",
        href: "https://console.cloud.google.com/cloud-build/builds",
        group: "Ops",
      },
    ],
  };
};
