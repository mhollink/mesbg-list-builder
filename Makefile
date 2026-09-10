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
	@echo "  make setup            Install dependencies, start infrastructure and build data"
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
	@echo ""
	@echo "Testing"
	@echo "  make test             Run frontend, backend and data tests"
	@echo "  make test-frontend    Run frontend tests"
	@echo "  make test-backend     Run backend tests"
	@echo "  make test-data        Run game-data tests"
	@echo "  make test-e2e         Run end-to-end tests"
	@echo ""
	@echo "Quality"
	@echo "  make format           Run all linters and formatters"
	@echo "  make typecheck        Run TypeScript type checks"
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
setup: install start data
	@echo ""
	@echo "Project setup complete."
	@echo ""
	@echo "Start the applications using:"
	@echo "  make backend"
	@echo "  make frontend"


.PHONY: install
install: install-frontend install-data install-e2e install-backend


.PHONY: install-frontend
install-frontend:
	cd $(FRONTEND_DIR) && $(PNPM) install


.PHONY: install-data
install-data:
	cd $(DATA_DIR) && $(PNPM) install


.PHONY: install-e2e
install-e2e:
	cd $(E2E_DIR) && $(PNPM) install


.PHONY: install-backend
install-backend:
	cd $(BACKEND_DIR) && $(MVN) dependency:go-offline


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


.PHONY: frontend
frontend:
	cd $(FRONTEND_DIR) && $(PNPM) dev


.PHONY: backend
backend:
	cd $(BACKEND_DIR) && $(MVN) spring-boot:run


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
test: test-data test-frontend test-backend


.PHONY: test-frontend
test-frontend:
	cd $(FRONTEND_DIR) && $(PNPM) test -- --run


.PHONY: test-backend
test-backend:
	cd $(BACKEND_DIR) && $(MVN) test


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
format: format-frontend format-data


.PHONY: format-frontend
format-frontend:
	cd $(FRONTEND_DIR) && $(PNPM) format


.PHONY: format-data
format-data:
	cd $(DATA_DIR) && $(PNPM) format


.PHONY: typecheck
typecheck: typecheck-frontend typecheck-data


.PHONY: typecheck-frontend
typecheck-frontend:
	cd $(FRONTEND_DIR) && $(PNPM) typecheck


.PHONY: typecheck-data
typecheck-data:
	cd $(DATA_DIR) && $(PNPM) typecheck


.PHONY: verify
verify: format typecheck test


# ==============================================================================
# Build
# ==============================================================================

.PHONY: build
build: data build-frontend build-backend


.PHONY: build-frontend
build-frontend:
	cd $(FRONTEND_DIR) && $(PNPM) build


.PHONY: build-backend
build-backend:
	cd $(BACKEND_DIR) && $(MVN) clean package


# ==============================================================================
# Database
# ==============================================================================

.PHONY: db-start
db-start:
	$(DOCKER_COMPOSE) up -d db


.PHONY: db-stop
db-stop:
	$(DOCKER_COMPOSE) stop db


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