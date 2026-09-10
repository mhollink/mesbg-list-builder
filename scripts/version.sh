#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd -- "$SCRIPT_DIR/.." && pwd)"

BACKEND_DIR="$ROOT_DIR/apps/backend"
POM_FILE="$BACKEND_DIR/pom.xml"
MVNW="$BACKEND_DIR/mvnw"

VERSION="${1:-}"
VERSION="${VERSION#v}"

if [[ -z "$VERSION" ]]; then
  echo "Usage: $0 <version>"
  echo
  echo "Example:"
  echo "  $0 1.2.0"
  exit 1
fi

cd "$ROOT_DIR"

echo "Updating pnpm workspace to $VERSION..."

pnpm version "$VERSION" \
  --recursive \
  --no-git-tag-version

echo
echo "Updating Maven project to $VERSION..."

"$MVNW" \
  -f "$POM_FILE" \
  versions:set \
  -DnewVersion="$VERSION" \
  -DgenerateBackupPoms=false \
  -DprocessAllModules=true

echo
echo "Version updated to $VERSION"