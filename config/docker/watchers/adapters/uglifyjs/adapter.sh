#!/bin/bash

if [[ ${1##*.} = "js" ]] && [[ ${1#*.} != *"min.js"* ]]; then
  $(npm bin -q)/uglifyjs $1 -m -c -o ${1%.*}.min.js
fi
