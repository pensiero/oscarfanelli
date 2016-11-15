#!/bin/bash

# File watchers
bash ./config/docker/watchers/background.sh

# Apache
/usr/sbin/apache2ctl -D FOREGROUND