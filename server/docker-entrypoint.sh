#!/bin/sh
set -e

node node_modules/drizzle-kit/bin.cjs migrate
exec node dist/main.js
