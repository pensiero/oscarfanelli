#!/bin/bash

for DIR in $(dirname $0)/adapters/*
do
  bash $DIR/run.sh
done