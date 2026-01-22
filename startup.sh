#!/bin/bash
cd /home/ubuntu/forever-us-server
npm install
pm2 start index.js --name forever-us --watch
