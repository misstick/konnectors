#!/usr/bin/env bash
export PATH="./node_modules/.bin:$PATH"
export OPTIMIZE=true

echo "Clean previous server"
rm -rf build/server && mkdir -p build/server
echo "Previous server cleaned."

echo "Pull locales from Transifex"
tx pull -a
echo "Locales updated."

echo "Build server files..."
coffee -cb --output build/server server
coffee -cb --output build/ server.coffee
babel ./server/konnectors -d build/server/konnectors
babel ./server/lib -d build/server/lib
echo "Server built."
