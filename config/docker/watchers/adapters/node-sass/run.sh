#!/bin/bash

for FILE in public/css/*
do
  bash $(dirname $0)/adapter.sh $FILE
done