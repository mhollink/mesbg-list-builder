#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd -- "$SCRIPT_DIR/.." && pwd)"

VERSION_SCRIPT="$SCRIPT_DIR/version.sh"

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


#
# Preconditions
#

if [[ ! -d "$ROOT_DIR/.git" ]]; then
  echo "Release must be run from a Git repository"
  exit 1
fi

if [[ ! -x "$VERSION_SCRIPT" ]]; then
  echo "Version script is not executable: $VERSION_SCRIPT"
  exit 1
fi

if [[ -n "$(git status --porcelain)" ]]; then
  echo "Working tree is not clean."
  echo
  git status --short
  echo
  echo "Commit or stash your changes before creating a release."
  exit 1
fi

TAG="v$VERSION"

if git rev-parse "$TAG" >/dev/null 2>&1; then
  echo "Git tag already exists: $TAG"
  exit 1
fi


#
# Version
#

echo "Creating release $VERSION"
echo

"$VERSION_SCRIPT" "$VERSION"


#
# pnpm lockfile
#

echo
echo "Updating pnpm lockfile..."

pnpm install --lockfile-only


#
# Changelog
#

echo
echo "Updating changelog..."

update_changelog() {
  pnpm exec git-cliff \
    --unreleased \
    --tag "v$VERSION" \
    --output CHANGELOG.md
}

update_changelog


#
# Validation
#

echo
echo "Running frontend/data checks..."

pnpm -r --if-present run test
pnpm -r --if-present run build

echo
echo "Running backend checks..."

"$MVNW" \
  -f "$POM_FILE" \
  verify


#
# Ensure something actually changed
#

if [[ -z "$(git status --porcelain)" ]]; then
  echo
  echo "No files changed."
  echo "Release aborted."
  exit 1
fi


#
# Commit
#

echo
echo "Files included in release:"
git status --short

echo
echo "Creating release commit..."

git add -A

git commit \
  -m "chore(release): v$VERSION"


#
# Tag
#

echo
echo "Creating tag $TAG..."

git tag \
  -a "$TAG" \
  -m "Release $TAG"


#
# Done
#

echo
echo "Release created successfully:"
echo
echo "  Version: $VERSION"
echo "  Commit:  $(git rev-parse --short HEAD)"
echo "  Tag:     $TAG"
echo
echo "Nothing has been pushed."