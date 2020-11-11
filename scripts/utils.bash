#!/bin/bash

ROOT="$(realpath $(dirname "$0")/../)"
SCRIPTS="${ROOT}/scripts"

# Export to child processes
export ROOT
export SCRIPTS
