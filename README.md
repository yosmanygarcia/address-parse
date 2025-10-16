# Setup and run using just Dockerfile

docker build -t my-node-app -f arch/node/Dockerfile .

docker run -it --name my-node-app-container -e PORT=80 -p 80:80 my-node-app

open localhost:80

## Start again after stopping

docker start -ai my-node-app-container

# Dev

docker network create address_parse || true

docker-compose \
-f arch/docker-compose.yml \
-p address_parse up \
--force-recreate --remove-orphans

docker exec -it address_parse_node bash

npm i

# Tests

## node-postal

npx lb-mocha --allow-console-logs --require ts-node/register src/__tests__/node-postal.test.ts

## zerodep-address

npx lb-mocha --allow-console-logs --require ts-node/register src/__tests__/zerodep-address.test.ts

## custom

npx lb-mocha --allow-console-logs --require ts-node/register src/__tests__/custom.test.ts