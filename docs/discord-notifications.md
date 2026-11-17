# Discord notification routing

The MESBG List Builder Discord uses a separate webhook for each purpose:

| GitHub secret                     | Discord channel    | Source                                                                        |
|-----------------------------------|--------------------|-------------------------------------------------------------------------------|
| `DISCORD_ANNOUNCEMENTS_WEBHOOK`   | `#announcements`   | Tagged releases, only after successful CD deployment                          |
| `DISCORD_GITHUB_ACTIVITY_WEBHOOK` | `#github-activity` | Issues, PRs, reviews, comments, GitHub Discussions                            |
| `DISCORD_CI_ALERTS_WEBHOOK`       | `#ci-and-alerts`   | Failed `master` CI and release deployments; recovery after a previous failure |

Create each webhook in **Discord Channel Settings → Integrations → Webhooks**, then store its full URL in **GitHub
Repository Settings → Secrets and variables → Actions** as the corresponding repository secret.

The GitHub Activity workflow deliberately excludes commit pushes and ordinary successful builds. It does not check out
or execute contributor code. The CI Alerts workflow listens to completed `CI` runs on `master` and completed `CD`
release runs; it reports failures and first recoveries, not regular successes.
