SHELL := /bin/bash

WEB_DIR := apps/web
API_DIR := apps/api
DATA_DIR := data
E2E_DIR := tests/e2e

PNPM := pnpm
MVN := mvn
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
	@echo "  make setup          Install dependencies, start infrastructure and build data"
	@echo "  make install        Install all project dependencies"
	@echo ""
	@echo "Development"
	@echo "  make start          Start infrastructure"
	@echo "  make stop           Stop infrastructure"
	@echo "  make restart        Restart infrastructure"
	@echo "  make web            Start the frontend development server"
	@echo "  make api            Start the Spring Boot API"
	@echo ""
	@echo "Game data"
	@echo "  make data           Generate game data from the source workbook"
	@echo ""
	@echo "Testing"
	@echo "  make test           Run frontend, backend and data tests"
	@echo "  make test-web       Run frontend tests"
	@echo "  make test-api       Run backend tests"
	@echo "  make test-data      Run game-data tests"
	@echo "  make test-e2e       Run end-to-end tests"
	@echo ""
	@echo "Quality"
	@echo "  make format         Run all linters and formatters"
	@echo "  make typecheck      Run TypeScript type checks"
	@echo "  make verify         Run format, typecheck and tests"
	@echo ""
	@echo "Build"
	@echo "  make build          Build game data, frontend and backend"
	@echo "  make build-web      Build the frontend"
	@echo "  make build-api      Build the backend"
	@echo ""
	@echo "Database"
	@echo "  make db-start       Start the database"
	@echo "  make db-stop        Stop the database"
	@echo "  make db-reset       Recreate the local database"
	@echo ""
	@echo "Cleanup"
	@echo "  make clean          Remove build artifacts"


# ==============================================================================
# Setup
# ==============================================================================

.PHONY: setup
setup: install start data
	@echo ""
	@echo "Project setup complete."
	@echo ""
	@echo "Start the applications using:"
	@echo "  make api"
	@echo "  make web"


.PHONY: install
install: install-web install-data install-e2e install-api


.PHONY: install-web
install-web:
	cd $(WEB_DIR) && $(PNPM) install


.PHONY: install-data
install-data:
	cd $(DATA_DIR) && $(PNPM) install


.PHONY: install-e2e
install-e2e:
	cd $(E2E_DIR) && $(PNPM) install


.PHONY: install-api
install-api:
	cd $(API_DIR) && $(MVN) dependency:go-offline


# ==============================================================================
# Development
# ==============================================================================

.PHONY: start
start:
	$(DOCKER_COMPOSE) up -d


.PHONY: stop
stop:
	$(DOCKER_COMPOSE) down


.PHONY: restart
restart: stop start


.PHONY: web
web:
	cd $(WEB_DIR) && $(PNPM) dev


.PHONY: api
api:
	cd $(API_DIR) && $(MVN) spring-boot:run


# ==============================================================================
# Game data
# ==============================================================================

.PHONY: data
data:
	cd $(DATA_DIR) && $(PNPM) build && $(PNPM) format


# ==============================================================================
# Testing
# ==============================================================================

.PHONY: test
test: test-data test-web test-api


.PHONY: test-web
test-web:
	cd $(WEB_DIR) && $(PNPM) test -- --run


.PHONY: test-api
test-api:
	cd $(API_DIR) && $(MVN) test


.PHONY: test-data
test-data:
	cd $(DATA_DIR) && $(PNPM) test -- --run


.PHONY: test-e2e
test-e2e:
	cd $(E2E_DIR) && $(PNPM) test


# ==============================================================================
# Quality
# ==============================================================================

.PHONY: format
format: format-web format-data


.PHONY: format-web
format-web:
	cd $(WEB_DIR) && $(PNPM) format


.PHONY: format-data
format-data:
	cd $(DATA_DIR) && $(PNPM) format


.PHONY: typecheck
typecheck: typecheck-web typecheck-data


.PHONY: typecheck-web
typecheck-web:
	cd $(WEB_DIR) && $(PNPM) typecheck


.PHONY: typecheck-data
typecheck-data:
	cd $(DATA_DIR) && $(PNPM) typecheck


.PHONY: verify
verify: format typecheck test


# ==============================================================================
# Build
# ==============================================================================

.PHONY: build
build: data build-web build-api


.PHONY: build-web
build-web:
	cd $(WEB_DIR) && $(PNPM) build


.PHONY: build-api
build-api:
	cd $(API_DIR) && $(MVN) clean package


# ==============================================================================
# Database
# ==============================================================================

.PHONY: db-start
db-start:
	$(DOCKER_COMPOSE) up -d db


.PHONY: db-stop
db-stop:
	$(DOCKER_COMPOSE) stop db


.PHONY: db-reset
db-reset:
	@echo "WARNING: This will remove the local database and all of its data."
	@read -p "Continue? [y/N] " confirm; \
	if [[ "$$confirm" == "y" || "$$confirm" == "Y" ]]; then \
		$(DOCKER_COMPOSE) down -v; \
		$(DOCKER_COMPOSE) up -d db; \
	else \
		echo "Database reset cancelled."; \
	fi


# ==============================================================================
# Cleanup
# ==============================================================================

.PHONY: clean
clean: clean-web clean-api clean-data


.PHONY: clean-web
clean-web:
	rm -rf $(WEB_DIR)/dist


.PHONY: clean-api
clean-api:
	cd $(API_DIR) && $(MVN) clean


.PHONY: clean-data
clean-data:
	rm -rf $(DATA_DIR)/generated