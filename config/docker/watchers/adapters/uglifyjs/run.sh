#!/bin/bash

for FILE in js/*
do
  bash $(dirname $0)/adapter.sh $FILE
done