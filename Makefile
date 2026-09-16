API_DIR := api
FRONTEND_DIR := apps/frontend
BACKEND_DIR := apps/backend
DATA_DIR := data
E2E_DIR := tests/e2e

MVN := ./mvnw
PNPM := pnpm
DOCKER_COMPOSE := docker compose

.DEFAULT_GOAL := help


# ==============================================================================
# Help
# ==============================================================================

.PHONY: help
help:
	@echo "MESBG List Builder"
	@echo ""
	@echo "Setup"
	@echo "  make setup            Install dependencies, generates api-client and starts infrastructure"
	@echo "  make install          Install all project dependencies"
	@echo ""
	@echo "Development"
	@echo "  make start            Start infrastructure"
	@echo "  make stop             Stop infrastructure"
	@echo "  make restart          Restart infrastructure"
	@echo "  make frontend         Start the frontend development server"
	@echo "  make backend          Start the Spring Boot API"
	@echo ""
	@echo "Game data"
	@echo "  make data             Generate game data from the source workbook"
	@echo "  make watch-data       Generate game data and automatically rerun on save"
	@echo ""
	@echo "Testing"
	@echo "  make test             Run frontend, backend and data tests"
	@echo "  make test-frontend    Run frontend tests"
	@echo "  make test-backend     Run backend tests"
	@echo "  make test-e2e         Run end-to-end tests"
	@echo ""
	@echo "Quality"
	@echo "  make format           Run all linters and formatters"
	@echo "  make verify           Run format, typecheck and tests"
	@echo ""
	@echo "Build"
	@echo "  make build            Build game data, frontend and backend"
	@echo "  make build-frontend   Build the frontend"
	@echo "  make build-backend    Build the backend"
	@echo ""
	@echo "Database"
	@echo "  make db-start         Start the database"
	@echo "  make db-stop          Stop the database"
	@echo ""
	@echo "Cleanup"
	@echo "  make clean            Remove build artifacts"


# ==============================================================================
# Setup
# ==============================================================================

.PHONY: setup
setup: install build start
	@echo ""
	@echo "Project setup complete."
	@echo ""
	@echo "Start the applications using:"
	@echo "  make backend"
	@echo "  make frontend"

.PHONY: install
install: install-api install-data install-frontend install-backend install-e2e

.PHONY: install-api
install-api:
	cd $(API_DIR) && $(PNPM) install

.PHONY: install-data
install-data:
	cd $(DATA_DIR) && $(PNPM) install

.PHONY: install-frontend
install-frontend:
	cd $(FRONTEND_DIR) && $(PNPM) install

.PHONY: install-backend
install-backend:
	cd $(BACKEND_DIR) && $(MVN) dependency:go-offline

.PHONY: install-e2e
install-e2e:
	cd $(E2E_DIR) && $(PNPM) install

# ==============================================================================
# Development
# ==============================================================================

.PHONY: start
start:
	$(DOCKER_COMPOSE) up -d database keycloak

.PHONY: stop
stop:
	$(DOCKER_COMPOSE) down

.PHONY: restart
restart: stop start

.PHONY: frontend
frontend:
	cd $(FRONTEND_DIR) && $(PNPM) dev

.PHONY: backend
backend:
	cd $(BACKEND_DIR) && $(MVN) spring-boot:run

# ==============================================================================
# API
# ==============================================================================

.PHONY: api
api: build-typescript-api-client build-java-api-server

.PHONY: build-typescript-api-client
build-typescript-api-client:
	cd $(API_DIR) && $(PNPM) build

.PHONY: build-java-api-server
build-java-api-server:
	cd $(BACKEND_DIR) && $(MVN) generate-sources -Dspotless.skip=true

# ==============================================================================
# Game data
# ==============================================================================

.PHONY: data
data:
	cd $(DATA_DIR) && $(PNPM) build

.PHONY: watch-data
watch-data:
	cd $(DATA_DIR) && $(PNPM) build && $(PNPM) build:watch

# ==============================================================================
# Testing
# ==============================================================================

.PHONY: test
test: test-frontend test-backend

.PHONY: test-frontend
test-frontend:
	cd $(FRONTEND_DIR) && $(PNPM) test

.PHONY: test-backend
test-backend:
	cd $(BACKEND_DIR) && $(MVN) test

.PHONY: test-e2e
test-e2e:
	cd $(E2E_DIR) && $(PNPM) test

# ==============================================================================
# Quality
# ==============================================================================

.PHONY: format
format: format-data format-frontend format-backend

.PHONY: format-frontend
format-frontend:
	cd $(FRONTEND_DIR) && $(PNPM) format

.PHONY: format-data
format-data:
	cd $(DATA_DIR) && $(PNPM) format

.PHONY: format-backend
format-backend:
	cd $(BACKEND_DIR) && $(MVN) spotless:apply

# Only testing frontend, backend tests are also part of build.
.PHONY: verify
verify: format test-frontend build

# ==============================================================================
# Build
# ==============================================================================

.PHONY: build
build: data build-frontend build-backend

.PHONY: build-frontend
build-frontend: api
	cd $(FRONTEND_DIR) && $(PNPM) build

.PHONY: build-backend
build-backend:
	cd $(BACKEND_DIR) && $(MVN) clean package jib:dockerBuild -Dimage=mesbg-list-builder-backend:local

# ==============================================================================
# Database
# ==============================================================================

.PHONY: db-start
db-start:
	$(DOCKER_COMPOSE) up -d database

.PHONY: db-stop
db-stop:
	$(DOCKER_COMPOSE) stop database

# ==============================================================================
# Cleanup
# ==============================================================================

.PHONY: clean
clean: clean-frontend clean-backend clean-data

.PHONY: clean-frontend
clean-frontend:
	rm -rf $(FRONTEND_DIR)/dist

.PHONY: clean-backend
clean-backend:
	cd $(BACKEND_DIR) && $(MVN) clean

.PHONY: clean-data
clean-data:
	rm -rf $(DATA_DIR)/generated

# ==============================================================================
# Cleanup
# ==============================================================================


.PHONY: version release publish
version:
ifndef VERSION
	$(error VERSION is required. Usage: make version VERSION=1.2.3)
endif
	@./scripts/version.sh "$(VERSION)"

release:
ifndef VERSION
	$(error VERSION is required. Usage: make release VERSION=1.2.3)
endif
	@./scripts/release.sh "$(VERSION)"

publish:
	@./scripts/publish.sh