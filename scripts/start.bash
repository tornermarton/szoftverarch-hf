#!/bin/bash

source $(dirname "$0")/utils.bash

source ${ROOT}/.env

docker-compose -f ${ROOT}/docker-compose.yml up --build -d