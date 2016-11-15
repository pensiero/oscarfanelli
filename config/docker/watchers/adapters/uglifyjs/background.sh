#!/bin/bash

inotifywait -m -r -e modify,create,move --format "%w%f" js/ |
  while read FILE; do
    bash $(dirname $0)/adapter.sh $FILE
  done