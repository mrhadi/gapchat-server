#!/bin/bash
export PM2_HOME=~/.pm2
pm2 delete gapchat
cd /var/apps/gapchat
pm2 start --name gapchat npm -- start
