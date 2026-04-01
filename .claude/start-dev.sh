#!/bin/bash
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
cd /Users/joaobarbosa/Dev/pc-advisor
# Build first, then start the production server
/opt/homebrew/bin/node node_modules/.bin/next build 2>&1
exec /opt/homebrew/bin/node node_modules/.bin/next start
