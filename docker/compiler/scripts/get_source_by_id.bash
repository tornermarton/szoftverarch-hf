#!/bin/bash
echo "1"
echo "$1"
echo "$2"
echo "done"
mkdir "/home/workspace/doc_$2"
curl "https://arxiv.org/e-print/$1"\
 -s \
 -H 'Upgrade-Insecure-Requests: 1'\
 -H 'DNT: 1'\
 -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36'\
 -H 'Referer: https://arxiv.org/format/1905.02693'\
 --compressed\
 --output "/home/workspace/doc_$2/source.tar.gz"
mkdir "/home/workspace/doc_$2/uncompressed"
tar -xvf "/home/workspace/doc_$2/source.tar.gz" -C "/home/workspace/doc_$2/uncompressed"
