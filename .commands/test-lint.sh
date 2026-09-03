#!/usr/bin/env bash

set -euo pipefail

# scripts
oxlint --quiet "$@" scripts/

# tests
oxlint --quiet "$@" tests/
oxlint --quiet "$@" integrations/

# documentation
oxlint --quiet "$@" docs/