#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

JAVA_VERSION="$(cat "$ROOT_DIR/.java-version")"
NODE_VERSION="$(cat "$ROOT_DIR/.nvmrc")"

log() {
  printf "\n\033[1;34m==>\033[0m %s\n" "$1"
}

fail() {
  printf "\n\033[1;31mERROR:\033[0m %s\n" "$1" >&2
  exit 1
}

command_exists() {
  command -v "$1" >/dev/null 2>&1
}

install_java() {
  log "Installing JDK $JAVA_VERSION..."

  if [[ "$OSTYPE" == "darwin"* ]]; then
    command_exists brew || fail "Homebrew is required to install Java automatically."
    brew install "openjdk@$JAVA_VERSION"
    return
  fi

  if command_exists apt-get; then
    sudo apt-get update
    sudo apt-get install -y "openjdk-${JAVA_VERSION}-jdk"
    return
  fi

  if command_exists dnf; then
    sudo dnf install -y "java-${JAVA_VERSION}-openjdk-devel"
    return
  fi

  if command_exists pacman; then
    sudo pacman -S --needed "jdk${JAVA_VERSION}-openjdk"
    return
  fi

  fail "Could not determine how to install JDK $JAVA_VERSION on this system."
}

ensure_java() {
  log "Checking Java..."

  if command_exists java; then
    CURRENT_JAVA_VERSION="$(
      java -version 2>&1 \
        | head -n 1 \
        | sed -E 's/.*version "([0-9]+).*/\1/'
    )"

    if [[ "$CURRENT_JAVA_VERSION" == "$JAVA_VERSION" ]]; then
      echo "Java $JAVA_VERSION is already installed."
      return
    fi

    echo "Java $CURRENT_JAVA_VERSION found, but Java $JAVA_VERSION is required."
  else
    echo "Java is not installed."
  fi

  install_java

  command_exists java || fail "Java was installed but is not available on PATH."
}

install_fnm() {
  log "Installing fnm..."

  if [[ "$OSTYPE" == "darwin"* ]]; then
    command_exists brew || fail "Homebrew is required to install fnm automatically."
    brew install fnm
  else
    command_exists curl || fail "curl is required to install fnm."
    curl -fsSL https://fnm.vercel.app/install | bash -s -- --skip-shell
  fi

  # fnm's default Linux installation location.
  if [[ -x "$HOME/.local/share/fnm/fnm" ]]; then
    export PATH="$HOME/.local/share/fnm:$PATH"
  fi

  command_exists fnm || fail "fnm was installed but could not be found."
}

ensure_node() {
  log "Checking Node.js $NODE_VERSION..."

  if ! command_exists fnm; then
    install_fnm
  fi

  eval "$(fnm env --shell bash)"

  fnm install "$NODE_VERSION"
  fnm use "$NODE_VERSION"

  CURRENT_NODE_VERSION="$(node --version | sed 's/^v//')"

  if [[ "$CURRENT_NODE_VERSION" != "$NODE_VERSION" ]]; then
    fail "Expected Node $NODE_VERSION but found $CURRENT_NODE_VERSION."
  fi

  echo "Node $CURRENT_NODE_VERSION is active."
}

ensure_pnpm() {
  log "Enabling pnpm..."

  command_exists corepack || fail "Corepack is not available in Node $NODE_VERSION."

  corepack enable

  # Uses the packageManager value from package.json.
  corepack install

  echo "pnpm $(pnpm --version) is available."
}

install_make() {
  log "Installing Make..."

  if [[ "$OSTYPE" == "darwin"* ]]; then
    command_exists brew || fail "Homebrew is required to install Make automatically."
    brew install make
    return
  fi

  if command_exists apt-get; then
    sudo apt-get update
    sudo apt-get install -y make
    return
  fi

  if command_exists dnf; then
    sudo dnf install -y make
    return
  fi

  if command_exists pacman; then
    sudo pacman -S --needed make
    return
  fi

  fail "Could not determine how to install Make on this system."
}

ensure_make() {
  log "Checking Make..."

  if command_exists make; then
    echo "Make $(make --version | head -n 1) is already installed."
    return
  fi

  install_make

  command_exists make || fail "Make was installed but is not available on PATH."
}

install_dependencies() {
  log "Installing Node dependencies..."

  cd "$ROOT_DIR"
  pnpm install

  log "Preparing backend..."

  if [[ -x "$ROOT_DIR/apps/backend/mvnw" ]]; then
    (
      cd "$ROOT_DIR/apps/backend"
      ./mvnw dependency:go-offline
    )
  else
    fail "apps/backend/mvnw is missing."
  fi
}

main() {
  echo "Project quick start"
  echo "==================="

  ensure_java
  ensure_node
  ensure_pnpm
  ensure_make
  install_dependencies

  log "Setup complete."
  echo
  echo "You can now run:"
  echo "  make"
}

main "$@"