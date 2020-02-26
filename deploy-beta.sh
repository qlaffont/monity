#!/bin/sh
set -e

IMAGE="qlaffont/monity"

docker build -t ${IMAGE}:beta .
docker tag ${IMAGE}:beta

echo "${DOCKER_PASSWORD}" | docker login -u "${DOCKER_USERNAME}" --password-stdin
docker push ${IMAGE}:beta
