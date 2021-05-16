#!/usr/bin/env bash

pwd="$(dirname "$0")"
target="$pwd/../.github/workflows/secrets"

mkdir -p "$target"

ssh-keygen -t rsa -b 4096 -f "$target/id_rsa" -C "junminahn@outlook.com" -N ""

# generate encryption password we will use in OpenSSL
encryption_key=$(pwgen 32 1)

echo $encryption_key

openssl aes-256-cbc -in "$target/id_rsa" -out "$target/id_rsa.enc" -pass pass:$encryption_key -e -pbkdf2
