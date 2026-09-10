#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd -- "$SCRIPT_DIR/.." && pwd)"

cd "$ROOT_DIR"

REMOTE="${REMOTE:-origin}"

#
# Preconditions
#

if [[ -n "$(git status --porcelain)" ]]; then
  echo "Working tree is not clean."
  echo
  git status --short
  echo
  echo "Commit or discard your changes before publishing."
  exit 1
fi

BRANCH="$(git branch --show-current)"

if [[ -z "$BRANCH" ]]; then
  echo "HEAD is detached. Cannot determine branch to publish."
  exit 1
fi

TAG="$(git tag --points-at HEAD | grep '^v' | head -n 1 || true)"

if [[ -z "$TAG" ]]; then
  echo "Current commit does not have a release tag."
  echo "Run 'make release VERSION=x.y.z' first."
  exit 1
fi

COMMIT_MESSAGE="$(git log -1 --pretty=%s)"

if [[ "$COMMIT_MESSAGE" != "chore(release): $TAG" ]]; then
  echo "Current commit does not look like a release commit."
  echo
  echo "Expected:"
  echo "  chore(release): $TAG"
  echo
  echo "Actual:"
  echo "  $COMMIT_MESSAGE"
  exit 1
fi


#
# Publish
#

echo "Publishing release:"
echo
echo "  Branch: $BRANCH"
echo "  Commit: $(git rev-parse --short HEAD)"
echo "  Tag:    $TAG"
echo "  Remote: $REMOTE"
echo

git push "$REMOTE" "$BRANCH"
git push "$REMOTE" "$TAG"

echo
echo "Published $TAG successfully."