# MESBG List Builder

A web application for building and managing armies for the **Middle-earth Strategy Battle Game**, with additional tools for tracking games, managing collections, finding local players, running Battle Companies, and supporting tournaments.

The project started as a roster builder and is being expanded into a broader companion application for MESBG players.

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
│   ├── web/                 # React frontend
│   └── api/                 # Spring Boot backend
│
├── data/
│   ├── raw/                 # Source Excel game data
│   ├── model/               # Game-data model definitions
│   ├── scripts/             # Import and transformation pipeline
│   ├── schema/              # Validation schemas
│   ├── generated/           # Generated JSON consumed by the frontend
│   └── tests/               # Data-pipeline tests
│
├── contracts/
│   └── api/                 # OpenAPI contract
│
├── tests/
│   └── e2e/                 # Whole-system Playwright tests
│
├── docs/
│   ├── architecture/        # System architecture
│   ├── domain/              # Domain documentation
│   ├── adr/                 # Architecture Decision Records
│   ├── development/         # Developer documentation
│   ├── operations/          # Deployment and operations
│   └── security/            # Security and privacy documentation
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
* armies
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
└── Dice Charts

Settings
Help & About
```

## Local development

### Requirements

Install the following before running the project locally:

* Java 25
* Node.js
* pnpm
* Docker
* Docker Compose

### Setup

Clone the repository:

```bash
git clone <repository-url>
cd mesbg-list-builder
```

Install frontend and data-pipeline dependencies:

```bash
pnpm install
```

Start the required infrastructure:

```bash
docker compose up -d
```

Run the backend:

```bash
cd apps/api
./mvnw spring-boot:run
```

Run the frontend:

```bash
cd apps/web
pnpm dev
```

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

## Disclaimer

This project is an unofficial community tool for the Middle-earth Strategy Battle Game.

It is not affiliated with, endorsed by, or associated with Games Workshop, Middle-earth Enterprises, or their respective licensors and rights holders.
