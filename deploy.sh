#!/bin/bash

export PORT=5100
export MIX_ENV=prod
export GIT_PATH=/home/stormtrader/stormtrader

PWD=`pwd`
if [ $PWD != $GIT_PATH ]; then
	echo "Error: Must check out git repo to $GIT_PATH"
	echo "  Current directory is $PWD"
	exit 1
fi

if [ $USER != "stormtrader" ]; then
	echo "Error: must run as user 'stormtrader'"
	echo "  Current user is $USER"
	exit 2
fi

mix deps.get
(cd assets && npm install)
(cd assets && ./node_modules/brunch/bin/brunch b -p)
mix phx.digest
mix release --env=prod

mkdir -p ~/www
mkdir -p ~/old

NOW=`date +%s`
if [ -d ~/www/stormtrader ]; then
	echo mv ~/www/stormtrader ~/old/$NOW
	mv ~/www/stormtrader ~/old/$NOW
fi

mkdir -p ~/www/stormtrader
REL_TAR=~/stormtrader/_build/prod/rel/stormtrader/releases/0.0.1/stormtrader.tar.gz
(cd ~/www/stormtrader && tar xzvf $REL_TAR)

crontab - <<CRONTAB
@reboot bash /home/stormtrader/stormtrader/start.sh
CRONTAB

#. start.sh
