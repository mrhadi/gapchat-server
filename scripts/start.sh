#!/bin/bash
cd /var/apps/gapchat
echo "$USER" > user.txt
pm2 start index.js
