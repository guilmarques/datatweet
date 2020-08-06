#!/bin/bash

# Create logs directory (see hbase-env.sh)
mkdir -p logs

# Start HBase master (will start region server)
/usr/local/hbase/bin/start-hbase.sh

echo "create 'tweets','main_tweets'" | /opt/hbase-2.2.4/bin/hbase shell -n
status_code=$?
if [ ${status_code} -ne 0 ]; then
  echo "The command may have failed."
fi

/opt/hbase-2.2.4/bin/hbase thrift start

tail -F logs/*
