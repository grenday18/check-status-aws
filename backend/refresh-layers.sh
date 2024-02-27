#!/bin/bash

cd ./layers/item-categories-layer
yarn tsc
cd ../..
mkdir -p ./.esbuild/.build/
cp -r ./layers/item-categories-layer/dist/nodejs/node_modules/ ./.esbuild/.build/
