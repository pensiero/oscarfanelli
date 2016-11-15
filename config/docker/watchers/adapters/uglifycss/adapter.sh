#!/bin/bash

if [[ ${1##*.} = "css" ]] && [[ ${1#*.} != *"min.css"* ]]; then
  $(npm bin -q)/uglifycss $1 > ${1%.*}.min.css
fi
