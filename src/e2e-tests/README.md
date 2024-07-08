# Project Setup Guide

## Pre-requisites

1. Install necessary Node.js dependencies in top level directory:

    ```bash
    npm install
    ```

2. Run the setup script to pull down other repositories and build the `zkVerify` image. Use `--fetch-latest` to pull down the latest code from the repo and use the `--rebuild` flag to force a rebuild of an already existing image:

    ```bash
    cd src/e2e-tests/
    ./setup.sh --fetch-latest --rebuild
    ```

## Docker

### Starting the System

To start `Anvil` & `zkVerify` nodes along with the `nh-attestation-bot`, run the following commands:

```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### Retrieving Contract Deployed to Anvil

```bash
docker ps -a
docker logs -f <container_id>
```

Locate "Deployed Contract" and copy the value.

### Environment Setup

1. Set the .env ZKV_CONTRACT value to the Deployed Contract address obtained from the Anvil node.
2. Set the .env proof valid and invalid values.

## Running Tests

```bash
npm --prefix ../../ run test:e2e
```

### Submit a proof

Uses proof data from `/data` directory

```bash
ts-node ./scripts/submit_proof.ts fflonk
```

## Anvil Standalone Setup

To build and run the Anvil node standalone, use the following commands from within the "services" directory:

```bash
docker build --platform linux/amd64 -t anvil-node -f anvil/Dockerfile .
docker stop anvil-node
docker rm anvil-node
docker run -d \
  --name anvil-node \
  --platform linux/amd64 \
  -p 8545:8545 \
  -v contract-data:/data \
  anvil-node
```