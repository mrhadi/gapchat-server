#!/bin/bash
export PM2_HOME=~/.pm2
sudo pm2 delete gapchat
cd /var/apps/gapchat
sudo pm2 start --name gapchat npm -- start
