#!/bin/bash
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
cd /Users/joaobarbosa/Dev/pc-advisor
exec /opt/homebrew/bin/node node_modules/.bin/next dev
