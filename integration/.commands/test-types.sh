#!/bin/bash

set -e

# core
tsc -p core/tsconfig.json
# client
tsc -p client/tsconfig.json 
# interfaces
tsc -p node/tsconfig.json
# plugins
tsc -p codeGenerator/tsconfig.json 
tsc -p openApiGenerator/tsconfig.json 
tsc -p static/tsconfig.json 
tsc -p cacheController/tsconfig.json
tsc -p cors/tsconfig.json