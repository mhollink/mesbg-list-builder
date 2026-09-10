# Contributing to MESBG List Builder

Thank you for considering a contribution to MESBG List Builder.

MESBG List Builder is an unofficial community project developed in people's free time. Contributions are welcome,
including application changes, accessibility improvements, documentation, translations, and corrections to game data.

<!-- TOC -->

* [Contributing to MESBG List Builder](#contributing-to-mesbg-list-builder)
    * [Code of conduct](#code-of-conduct)
    * [Before starting](#before-starting)
    * [Development setup](#development-setup)
        * [Requirements](#requirements)
        * [Clone the repository](#clone-the-repository)
        * [Bootstrap the development environment](#bootstrap-the-development-environment)
            * [Linux and macOS](#linux-and-macos)
            * [Windows](#windows)
        * [Available commands](#available-commands)
    * [Making application changes](#making-application-changes)
    * [Working with game data](#working-with-game-data)
        * [Editing data locally](#editing-data-locally)
        * [Reviewing profile and rule changes](#reviewing-profile-and-rule-changes)
        * [Data corrections](#data-corrections)
    * [Translations](#translations)
    * [Formatting and builds](#formatting-and-builds)
    * [Commit messages](#commit-messages)
        * [Commit types](#commit-types)
        * [Data corrections are fixes](#data-corrections-are-fixes)
        * [Breaking changes](#breaking-changes)
    * [Pull requests](#pull-requests)
    * [Changelog and releases](#changelog-and-releases)
    * [Reporting security issues](#reporting-security-issues)
    * [Legal and licensing requirements](#legal-and-licensing-requirements)
        * [Third-party and game-related material](#third-party-and-game-related-material)
    * [Documentation](#documentation)
    * [Questions](#questions)

<!-- TOC -->

## Code of conduct

Be respectful and constructive.

Discuss the work rather than the person, assume good intent, and avoid harassment, discrimination, personal attacks, or
deliberately disruptive behaviour.

Maintainers may close discussions or reject contributions that do not meet these expectations.

## Before starting

Search the existing issues and pull requests before starting work. Someone may already be working on the same problem,
or there may be relevant context available.

Small fixes can generally be submitted directly. This includes:

- bug fixes
- minor UI improvements
- accessibility fixes
- documentation corrections
- translations
- isolated game-data corrections

Please open an issue before starting work on:

- significant features or redesigns
- architectural changes
- changes to persisted user data
- migrations
- broad changes to roster or army-list validation
- large dependency changes
- work that is likely to require substantial coordination

Opening an issue first helps establish the intended behaviour before significant implementation work begins.

## Development setup

### Requirements

The repository currently uses:

- Java 25
- Node.js 24.18.0
- pnpm 11
- GNU Make
- Git

The configured Java and Node versions are stored in `.java-version` and `.nvmrc`.

### Clone the repository

```bash
git clone git@github.com:mhollink/mesbg-list-builder.git
cd mesbg-list-builder
```

### Bootstrap the development environment

#### Linux and macOS

```bash
./scripts/quick-start.sh
```

#### Windows

Run:

```bat
scripts\quick-start.bat
```

from Command Prompt or PowerShell.

The Windows bootstrap configures the tools required by the project, including Git Bash integration.

After setup, use Git Bash for the normal Make-based development workflow.

### Available commands

Run:

```bash
make
```

from the repository root to see the available commands.

Common development commands include:

```bash
make frontend
make backend

make data
make watch-data

make format

make build
make build-frontend
make build-backend
```

Prefer the repository-level Make commands over running package-specific commands directly. This keeps workflows
consistent between environments.

## Making application changes

Keep contributions focused on one problem or coherent feature.

When changing code:

- follow the existing React, TypeScript, Material UI, Java, and Spring conventions
- prefer maintainable and testable code over clever or highly compressed implementations
- keep business rules separate from presentation where practical
- avoid abstractions until they solve a demonstrated problem
- preserve semantic HTML and keyboard operation
- consider accessibility when introducing new interactive or visual behaviour
- consider both narrow and wide viewport layouts
- avoid unrelated formatting or refactoring in the same contribution
- never commit credentials, tokens, private configuration, personal data, or production exports

When changing persisted user data or API contracts, consider backwards compatibility and migration requirements.

## Working with game data

Game data is maintained separately from the application code.

Source workbooks are stored under:

```text
data/raw/
```

Generated application data is stored under:

```text
data/generated/
```

The Excel workbooks are the source of truth. Do not manually modify generated JSON files.

### Editing data locally

For regular data work, run the data watcher and frontend in separate terminals.

Terminal 1:

```bash
make watch-data
```

Terminal 2:

```bash
make frontend
```

`make watch-data` performs an initial data generation and then watches the `.xlsx` files under `data/raw/`.

Saving one of the source workbooks automatically regenerates the corresponding application data.

This allows changes to be inspected immediately in the frontend.

### Reviewing profile and rule changes

Useful pages include:

```text
/reference/profiles
/reference/rules
/reference/debug/profiles
```

The debug profiles page is intended specifically for checking generated profile data across many profiles.

A typical data contribution follows this workflow:

```text
Edit data/raw/*.xlsx
        ↓
Save workbook
        ↓
make watch-data regenerates data
        ↓
Inspect the result in the frontend
        ↓
Review the generated Git diff
        ↓
Commit both source and generated changes
```

Do not commit a source-workbook change without regenerating the corresponding files under `data/generated/`.

### Data corrections

For corrections to profiles, rules, options, translations, or army lists, include enough information in the pull request
to explain why the change is correct.

Where applicable, include:

- the affected army, profile, model, rule, or option
- the current value or behaviour
- the corrected value or behaviour
- the relevant publication, FAQ, or errata
- the publication version or date
- any effect on roster construction or game behaviour

Do not upload copyrighted rulebooks, scans, or substantial screenshots of proprietary publications.

A concise source reference is sufficient.

## Translations

Translations are stored in the game-data source files and application locale resources.

English wording should be treated as authoritative for game rules. Translations of rules are provided as a convenience
and may be unofficial.

When contributing a translation:

- preserve the meaning of the English source
- use terminology consistently across profiles and rules
- avoid translating identifiers or technical keys
- check the result in the application after regeneration
- do not introduce formatting changes that alter rule meaning

Partial translations are acceptable.

## Formatting and builds

Before submitting a pull request, format the affected code:

```bash
make format
```

For changes that affect generated data or application builds, also run:

```bash
make build
```

You can build components separately when appropriate:

```bash
make data
make build-frontend
make build-backend
```

If a repository command cannot be run successfully because of an existing project limitation, mention that in the pull
request.

## Commit messages

This repository uses **Conventional Commits**.

Use the following format:

```text
<type>(optional-scope): <description>
```

Examples:

```text
feat(frontend): add profile keyword filtering

fix(data): correct Prince Imrahil points

fix(frontend): preserve drawer history on browser back

refactor(data): simplify profile generation

docs: document local development

chore(release): v2.0.0-alpha.10
```

### Commit types

Use the type that best describes the effect of the change.

| Type       | Use for                                               |
|------------|-------------------------------------------------------|
| `feat`     | New user-facing functionality                         |
| `fix`      | Bug fixes and corrections                             |
| `perf`     | Performance improvements                              |
| `refactor` | Structural changes without intended behaviour changes |
| `docs`     | Documentation-only changes                            |
| `test`     | Test changes                                          |
| `style`    | Formatting or style-only changes                      |
| `build`    | Build-system or dependency changes                    |
| `ci`       | CI/CD configuration                                   |
| `chore`    | Repository maintenance                                |
| `revert`   | Reverting an earlier change                           |

Scopes are optional but useful for identifying the affected area.

Common scopes include:

```text
frontend
backend
data
release
```

### Data corrections are fixes

Corrections to game data that affect what users see should normally use `fix(data)`.

For example:

```text
fix(data): correct Grimbeorn base size
```

Avoid classifying user-visible corrections as generic maintenance:

```text
chore: update profiles
```

The changelog is generated from Conventional Commits, and `chore` commits are intentionally excluded from the
user-facing changelog.

### Breaking changes

Use `!` when introducing a breaking change:

```text
feat(data)!: change profile option schema
```

Describe the compatibility or migration impact in the commit body or pull request.

## Git history

The repository maintains a **linear Git history**.

Merge commits are not accepted. Before a pull request is merged, its branch should be up to date with the target branch
without introducing a merge commit.

Prefer rebasing your branch:

```bash
git fetch origin
git rebase origin/master
```

If conflicts occur, resolve them during the rebase and continue with:

```bash
git rebase --continue
```

After rebasing a branch that has already been pushed, update the remote branch with:

```bash
git push --force-with-lease
```

Use `--force-with-lease` rather than `--force` to avoid unintentionally overwriting changes made by someone else.

Do not update your branch using:

```bash
git merge master
```

because this introduces a merge commit into the branch history.

### Commit quality

Commits should represent coherent changes and use the project's Conventional Commit format.

Before requesting review, consider cleaning up temporary or intermediate commits such as:

```text
fix
oops
address review
try again
```

Interactive rebase can be used to reorder, combine, or reword commits:

```bash
git rebase -i origin/master
```

A pull request does not need to contain exactly one commit. Multiple commits are appropriate when they describe
meaningful, independently understandable steps.

Pull requests are merged without creating merge commits. A clean commit history may be rebased onto the target branch
directly. Pull requests with noisy intermediate history may be squashed when merged.

## Pull requests

A pull request should contain:

- a concise summary of the change
- why the change is needed
- how it was validated
- screenshots or recordings for relevant UI changes
- accessibility considerations for new interactive behaviour
- the related issue number, when applicable
- source references for game-data corrections
- migration or compatibility implications, when applicable

Keep pull requests focused. Unrelated changes are easier to review when submitted separately.

Use a draft pull request for incomplete work.

Maintainers may request changes, make minor edits, squash commits, or decline changes that do not fit the project.

## Changelog and releases

The project uses Conventional Commits together with `git-cliff` to generate `CHANGELOG.md`.

The following commit types currently appear in the changelog:

- `feat`
- `fix`
- `perf`
- `refactor`
- `revert`

Maintenance-oriented commits such as `docs`, `test`, `build`, `ci`, and `chore` are excluded.

Release commits use:

```text
chore(release): v<version>
```

Release creation is handled through the repository scripts and is normally a maintainer task.

## Reporting security issues

Do not report suspected security vulnerabilities through a public GitHub issue.

Report them privately to:

`support@mesbg-list-builder.com`

Include enough information to reproduce and assess the issue.

Do not include real user credentials, authentication tokens, personal data, or other secrets.

## Legal and licensing requirements

Unless a file states otherwise, original project source code and project-authored documentation are licensed under the
GNU Affero General Public License version 3 only (`AGPL-3.0-only`).

See `LICENSE` and `NOTICE.md`.

By submitting a contribution, you confirm that:

1. You created the contribution yourself or have the legal right to submit it.
2. You agree that the contribution may be distributed under `AGPL-3.0-only`.
3. You are not knowingly including confidential information, trade secrets, or material you are not permitted to
   publish.
4. You understand that accepted contributions become part of a public repository and may remain in its history.

No Contributor Licence Agreement is currently required.

### Third-party and game-related material

This repository relates to the Middle-earth Strategy Battle Game and therefore contains or refers to names, game data,
trademarks, and other material that may belong to third parties.

Do not contribute material such as:

- scans or photographs of rulebooks or supplements
- substantial excerpts from copyrighted publications
- third-party artwork or logos
- fonts without a compatible licence
- proprietary source code
- content copied from another application or website
- dependencies with licences incompatible with this project

For corrections based on an official publication, FAQ, or errata, provide a concise source reference instead of
reproducing the source material.

The maintainers may decline or rewrite contributions when their provenance or licensing is unclear.

## Documentation

Documentation contributions are welcome.

Keep examples consistent with the current repository commands and application behaviour. When a workflow changes, update
the relevant documentation as part of the same contribution where practical.

## Questions

For contribution questions, open a GitHub issue unless the matter is security-sensitive.