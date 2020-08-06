#!/bin/bash -eu

SHOULD_BUILD=$(docker images | grep -c '/hbase' || echo)
if [[ $SHOULD_BUILD -lt 1 ]]; then
  docker-compose build
fi

export HOSTNAME
export KAFKA_ADVERTISED_HOST=localhost
docker-compose up -V
