#!/bin/bash

# File watchers
nohup bash ./config/docker/watchers/background.sh &

# Apache
/usr/sbin/apache2ctl -D FOREGROUND