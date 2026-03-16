#!/bin/bash

set -e

tsc -p codeGenerator/tsconfig.json 
tsc -p openApiGenerator/tsconfig.json 
tsc -p core/tsconfig.json 
tsc -p node/tsconfig.json
tsc -p client/tsconfig.json 
tsc -p static/tsconfig.json 
tsc -p cacheController/tsconfig.json