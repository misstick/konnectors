#!/usr/bin/env bash
export PATH="./node_modules/.bin:$PATH"
export OPTIMIZE=true

echo "Clean previous client build..."
rm -rf build/client && mkdir -p build/client/app
echo "Previous client cleaned."

echo "Build entry point..."
mkdir -p ./build/server/views
pug --client --no-debug --out ./build/server ./server
echo "; module.exports = template" | \
    cat ./build/server/views/index.js - > ./build/server/views/index.js.tmp
mv ./build/server/views/index.js.tmp ./build/server/views/index.js
echo "Entry point built."

echo "Build locales..."
cp -r ./client/app/locales ./build/client/app/
echo "Locales built."

echo "Build client..."
cd ./client
npm install
webpack
echo "Client built."
