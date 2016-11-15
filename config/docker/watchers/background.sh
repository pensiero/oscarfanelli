#!/bin/bash

inotifywait -m -r -e modify,create,move --format "%w%f" js/ |
  while read FILE; do
    if [[ ${FILE##*.} = "js" ]] && [[ ${FILE#*.} != *"min.js"* ]]; then
      $(npm bin -q)/uglifyjs $FILE -m -c -o ${FILE%.*}.min.js
    fi
  done