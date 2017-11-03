#!/bin/bash

for FILE in public/js/*
do
  bash $(dirname $0)/adapter.sh $FILE
done