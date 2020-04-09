# Using Linkdash with git hooks

It would be most beneficial to store repetitive dev tasks somewhere so we can always refer back to them.

This is an example of how to use linkdash as a pre-push hook to display a useful commands dashboard. We're using [Husky](https://www.npmjs.com/package/husky) to get linkdash to run prior to pushing a git change.

Through the linkdash.config file, we can compose complex commands.

One of the commands is building a gmail compose string which prefills the body with the last commit message.

```
urls : [
  {
    title: "Send email regarding my last commit message",
    href: `https://mail.google.com/mail/u/mytestemail@gmail.com/?view=cm&fs=1&su=${encodeURIComponent(
      "My last commit"
    )}&body=${encodeURIComponent(lastCommitMessage)}`,
    group: "Dev",
  }
]
```
