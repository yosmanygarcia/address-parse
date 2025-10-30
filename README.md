# Setup and run using just Dockerfile

docker build -t my-node-app -f arch/node/Dockerfile .

docker run -it --name my-node-app-container -e PORT=80 -p 80:80 my-node-app

open localhost:80

docker rm my-node-app-container

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

docker-compose \
-f arch/docker-compose.yml \
-p address_parse stop

docker-compose \
-f arch/docker-compose.yml \
-p address_parse rm

# Tests

## node-postal

docker exec -it address_parse_node npx lb-mocha --allow-console-logs --require ts-node/register src/__tests__/libs/node-postal.test.ts

## zerodep-address

docker exec -it address_parse_node npx lb-mocha --allow-console-logs --require ts-node/register src/__tests__/libs/zerodep-address.test.ts

## custom

docker exec -it address_parse_node npx lb-mocha --allow-console-logs --require ts-node/register src/__tests__/libs/custom.test.ts

# Tests from outside

docker start -ai address_parse_node
docker exec -it address_parse_node npx lb-mocha --allow-console-logs --require ts-node/register src/__tests__/internal.test.ts

Execute tests using command: docker exec -it address_parse_node npx lb-mocha --allow-console-logs --require ts-node/register src/tests/internal.test.ts
Then try to fix it on src/internal.ts and execute the tests again