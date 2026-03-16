#!/bin/bash

set -e

# core
tsc -p tests/core/tsconfig.json
# client
tsc -p tests/client/tsconfig.json
# interfaces
tsc -p tests/interfaces/node/tsconfig.json
tsc -p tests/interfaces/bun/tsconfig.json
tsc -p tests/interfaces/deno/tsconfig.json
# plugins
tsc -p tests/plugins/codeGenerator/tsconfig.json
tsc -p tests/plugins/openApiGenerator/tsconfig.json
tsc -p tests/plugins/cacheController/tsconfig.json
tsc -p tests/plugins/static/tsconfig.json
# integration
npm -w integration run test:types
# documentation
npm -w docs run test:types