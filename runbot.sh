#!/usr/bin/env bash
# run_main.sh
deno run \
  --unstable-cron \
  --allow-env \
  --allow-import \
  --allow-read \
  --allow-net \
  --allow-write \
  ./main.ts
