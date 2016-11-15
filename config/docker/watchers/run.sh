#!/bin/bash

for FILE in js/*
do
  if [[ ${FILE##*.} = "js" ]] && [[ ${FILE#*.} != *"min.js"* ]]; then
    $(npm bin -q)/uglifyjs $FILE -m -c -o ${FILE%.*}.min.js
  fi
done
