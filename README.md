# MESBG List Builder

A web application for building and managing armies for the **Middle-earth Strategy Battle Game**, with additional tools for tracking games, managing collections, finding local players, running Battle Companies, and supporting tournaments.

The project started as a roster builder and is being expanded into a broader companion application for MESBG players.

<!-- TOC -->
* [MESBG List Builder](#mesbg-list-builder)
  * [Features](#features)
    * [Armies](#armies)
    * [Play](#play)
    * [Reference](#reference)
  * [Technology](#technology)
    * [Web](#web)
    * [API](#api)
    * [Database](#database)
    * [Testing](#testing)
    * [Infrastructure](#infrastructure)
  * [Repository structure](#repository-structure)
  * [Architecture](#architecture)
    * [Game data](#game-data)
    * [User data](#user-data)
  * [Application areas](#application-areas)
  * [Local development](#local-development)
    * [Requirements](#requirements)
    * [Setup](#setup)
  * [Game-data pipeline](#game-data-pipeline)
  * [API](#api-1)
  * [Testing](#testing-1)
  * [Documentation](#documentation)
  * [Privacy](#privacy)
  * [Contributing](#contributing)
    * [Translating](#translating)
      * [How to add a new language](#how-to-add-a-new-language)
  * [Disclaimer](#disclaimer)
<!-- TOC -->

## Features

### Armies

* Build and manage army rosters
* Track your miniature collection
* Validate available profiles and army-list options using the bundled game data

### Play

* Record and review games
* Find players and games nearby
* Manage Battle Companies
* Create and participate in tournaments

### Reference

* Browse profiles
* Search rules
* View dice and probability charts

Game reference data is generated from a maintained Excel workbook and bundled with the frontend rather than served through the backend API.

## Technology

### Web

* React
* TypeScript
* Vite
* Material UI
* Redux Toolkit
* RTK Query

### API

* Java 25
* Spring Boot
* Spring Web
* Spring Security
* Spring Data JPA
* Bean Validation
* Flyway

### Database

* PostgreSQL
* PostGIS may be introduced later for geographical player discovery

### Testing

* JUnit
* Spring Boot Test
* Testcontainers
* Vitest
* React Testing Library
* Playwright

### Infrastructure

* Docker
* Docker Compose
* GitHub Actions

## Repository structure

```text
.
├── apps/
│   ├── frontend/            # React frontend
│   └── backend/             # Spring Boot backend
│
├── data/
│   ├── raw/                 # Source Excel game data
│   ├── scripts/             # Import, validation and transformation pipeline
│   └── generated/           # Generated json datafiles used by React frontend
│
├── api/                     # OpenAPI contract       
│
├── tests/
│   └── e2e/                 # Whole-system Playwright tests
│
├── docs/
│   ├── architecture/        # System architecture
│   ├── adr/                 # Architecture Decision Records
│   └── development/         # Developer documentation
│
├── infra/                   # Docker and deployment configuration
├── scripts/                 # Repository-level automation
└── .github/                 # GitHub configuration and CI/CD
```

## Architecture

The application distinguishes between two main categories of data.

### Game data

Game data describes MESBG itself, including:

* profiles
* rules
* army lists
* profile availability
* points and options

The source of truth for this data is maintained as an Excel workbook.

```text
Excel
  ↓
Import
  ↓
Transform
  ↓
Validate
  ↓
Generated JSON
  ↓
React application
```

Generated data is treated as build-time configuration and does not require API endpoints or database tables.

### User data

The backend manages information created or changed by users, including:

* accounts
* rosters
* collections
* games
* player discovery
* game requests
* Battle Companies
* tournaments

```text
React
  ↕
Spring Boot API
  ↕
PostgreSQL
```

The frontend combines static game data with user-specific data provided by the API.

## Application areas

The primary application navigation is organized around user goals:

```text
Home

Armies
├── Rosters
└── Collection

Play
├── Games
├── Find a Game
├── Battle Companies
└── Tournaments

Reference
├── Profiles
├── Rules
└── Army lists

Settings
```

## Local development

### Requirements

Install the following before running the project locally:

* Java 25 (see [.java-version](.java-version))
* Node 24 (see [.nvmrc](.nvmrc))
* pnpm 11 (see [package.json](package.json))

### Setup

The cloned repository contains multiple helpers to get the app running locally.
There is a quick-start script installing the required software and dependencies in [scripts](./scripts).

Clone the repository:

```bash
git clone git@github.com:mhollink/mesbg-list-builder.git
cd mesbg-list-builder
```

> [!NOTE]
> Visit https://git-scm.com/install/ and follow the installation for your operating system.

Run the quick-setup script to get all the pre-install requirements out of the way:

```shell
# macOs / Linux
./scripts/quick-start.sh
```
```shell
# Windows
./scripts/quick-start.bat
```

> [!WARNING]
> The quick start script might not fully finish in one run. 
> Installing Java/Node may require a new terminal session before they become available.


## Game-data pipeline

The source workbook is stored under:

```text
data/raw/
```

Generate the frontend game data with:

```bash
pnpm data:build
```

The pipeline should:

```text
Read workbook
    ↓
Transform source data
    ↓
Validate structure
    ↓
Validate references
    ↓
Write generated JSON
```

Invalid references or malformed game data should cause the build to fail.

Generated files are written to:

```text
data/generated/
```

## API

The API contract is maintained using OpenAPI:

```text
contracts/api/openapi.yaml
```

The OpenAPI specification acts as the contract between the Spring Boot API and the React application.

Generated TypeScript API code should not be edited manually.

## Testing

Run all repository tests with:

```bash
make test
```

Individual test suites can be run separately:

```bash
make test-web
make test-api
make test-data
make test-e2e
```

Exact commands may change while the repository setup is being completed.

## Documentation

Long-form documentation lives under [`docs/`](./docs).

Important architectural decisions should be recorded as Architecture Decision Records under:

```text
docs/adr/
```

Examples include:

* monorepo structure
* static game-data pipeline
* OpenAPI contract ownership
* player-location privacy
* frontend state-management strategy

## Privacy

Player discovery is designed around approximate location rather than exposing exact home locations.

Location information returned to other users should be limited to what is necessary to find nearby players or games.

See the location privacy ADR and security documentation for the detailed design.

## Contributing

Issues and pull requests are welcome.

For larger changes, prefer creating an issue first so the intended behavior and architecture can be discussed before implementation.

### Translating

One of the main parts that could use support is the translation to other languages. I am only fluent in english and dutch. 
Other languages on the page are either AI-generated or created with help of the community.

#### How to add a new language

* Create a fresh copy from apps/web/src/i18n/locales/en into the language of choice
* Add the language tag to the supported languages in apps/web/src/i18n/i18n.ts (`supportedLngs`)
* Update the list of supported (`SUPPORTED_LANGUAGES`) languages in apps/web/src/features/settings/state/general/generalSettings.constants.ts
* Translate any (or all) keys inside the initially created locale files. 

## Disclaimer

This project is an unofficial community tool for the Middle-earth Strategy Battle Game.

It is not affiliated with, endorsed by, or associated with Games Workshop, Middle-earth Enterprises, or their respective licensors and rights holders.
