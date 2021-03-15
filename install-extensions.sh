#!/bin/bash

set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" -d foodies <<-EOSQL
CREATE EXTENSION cube;
CREATE EXTENSION earthdistance;
EOSQL