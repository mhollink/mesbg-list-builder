# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability, please do **not** report it through a public GitHub issue.

Instead, report it privately using GitHub's **Private Vulnerability Reporting** feature:

1. Open the repository's **Security** tab.
2. Select **Advisories**.
3. Choose **Report a vulnerability**.

Please include, where possible:

* A description of the vulnerability.
* The affected part of the application.
* Steps to reproduce the issue.
* The potential impact.
* Any suggested mitigation or fix, if known.

Reports do not need to be exhaustive. If you are unsure whether something is a security vulnerability, it is better to report it privately so it can be investigated.

## Response

Security reports will be reviewed as soon as reasonably possible.

After confirming a vulnerability, the aim is to:

1. Determine the affected versions and impact.
2. Develop and test a fix.
3. Release the fix.
4. Publish relevant details once users have had a reasonable opportunity to update.

Please avoid publicly disclosing the vulnerability until a fix has been released.

## Supported Versions

This project is currently under active development.

Only the latest version of the application is actively maintained and receives security fixes.

| Version        | Supported |
| -------------- | --------- |
| Latest         | Yes       |
| Older versions | No        |

## Scope

Security issues include, but are not limited to:

* Authentication or authorization bypasses.
* Access to another user's private data.
* Injection vulnerabilities.
* Cross-site scripting (XSS).
* Exposure of credentials, tokens, or other secrets.
* Server-side request forgery (SSRF).
* Vulnerabilities that allow unintended modification or deletion of data.

General bugs, feature requests, data errors, and usability issues should be reported using the normal GitHub issue templates.
