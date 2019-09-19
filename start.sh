#!/bin/bash

export PORT=5100

cd ~/www/stormtrader
./bin/stormtrader stop || true
./bin/stormtrader start
