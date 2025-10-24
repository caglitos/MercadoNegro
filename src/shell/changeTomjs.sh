#!/usr/bin/env bash
set -euo pipefail

DIR="src"
if [ ! -d "$DIR" ]; then
  echo "Directory '$DIR' not found." >&2
  exit 1
fi

# Find and rename .js files to .mjs, skipping node_modules
find "$DIR" -type f -name '*.js' ! -path '*/node_modules/*' -print0 |
while IFS= read -r -d '' file; do
  new="${file%.js}.mjs"
  if command -v git >/dev/null 2>&1 && git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    git mv -- "$file" "$new" 2>/dev/null || mv -- "$file" "$new"
  else
    mv -- "$file" "$new"
  fi
done