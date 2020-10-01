#!/bin/bash

source $(dirname "$0")/utils.bash

docker-compose -f ${ROOT}/docker-compose-backend.yml down