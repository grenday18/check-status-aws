#!/bin/bash

cd ./layers/check-status-layer
yarn tsc
cd ../..
mkdir -p ./.esbuild/.build/
cp -r ./layers/check-status-layer/dist/nodejs/node_modules/ ./.esbuild/.build/
