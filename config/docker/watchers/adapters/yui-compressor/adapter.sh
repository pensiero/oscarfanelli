#!/bin/bash

if [[ ${1##*.} = "scss" ]] && [[ $(basename $1) != _* ]]; then
  $(npm bin -q)/node-sass --source-map=true $1 ${1%.*}.css
fi
