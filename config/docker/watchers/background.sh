#!/bin/bash

for DIR in $(dirname $0)/adapters/*
do
  nohup bash $DIR/background.sh &
done