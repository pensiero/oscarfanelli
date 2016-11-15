#!/bin/bash

for FILE in css/*
do
  bash $(dirname $0)/adapter.sh $FILE
done