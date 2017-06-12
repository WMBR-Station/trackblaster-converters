#!/bin/bash

openssl genrsa -out trackblaster.key 2048
openssl req -new -key trackblaster.key -out trackblaster.req
