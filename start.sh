#!/bin/bash

export PORT=5123

cd ~/www/stormtrader
./bin/stormtrader stop || true
./bin/stormtrader start
