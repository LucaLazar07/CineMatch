#!/usr/bin/env bash
set -euo pipefail

# Helper to run precompute_embeddings.py against a remote DATABASE_URL.
# Usage:
#   ./scripts/precompute_remote.sh <DATABASE_URL> [pages]

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <DATABASE_URL> [pages]"
  exit 1
fi

DATABASE_URL="$1"
PAGES="${2:-3}"

if [ -f ../venv/bin/activate ]; then
  source ../venv/bin/activate
fi

export DATABASE_URL
python backend/scripts/precompute_embeddings.py --pages "$PAGES"
