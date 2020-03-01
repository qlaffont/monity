#!/bin/sh
set -e

IMAGE="qlaffont/monity"
NODE_VERSION=$(node -p "require('./package.json').version")

docker build -t ${IMAGE}:${NODE_VERSION} .
docker tag ${IMAGE}:${NODE_VERSION} ${IMAGE}:latest

echo "${DOCKER_PASSWORD}" | docker login -u "${DOCKER_USERNAME}" --password-stdin
docker push ${IMAGE}:${NODE_VERSION}
docker push ${IMAGE}:latest
