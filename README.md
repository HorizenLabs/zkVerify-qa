# zkVerify-qa

This repository contains quality assurance tools and tests for the zkVerify project, including end-to-end (E2E) tests and RPC tests.

## Supported Proofs

The list of supported proofs can be found in [./src/config.ts](./src/config.ts), add new proof types here if needed.

## Send Proof

To send a newly generated proof of a specific type, run:

```shell
npx ts-node src/send-proof/index.ts <proofType> <skipWaitingForAttestationEventBoolean>
```

Example:

```shell
npx ts-node src/send-proof/index.ts groth16 true
```

## RPC Tests

RPC schema and valid/invalid proof submission tests.

For more details, refer to the [rpc-tests README](./src/rpc-tests/README.md).

To run RPC tests:

```shell
npm run test:rpc:testnet
```

## E2E Tests

The E2E tests spin up a complete local environment including:

1. Anvil Ethereum node
2. Three zkVerify nodes (local_node, node_alice, node_bob)
3. SubQuery infrastructure (Postgres, SubQuery node, GraphQL engine)
4. Attestation bot

It submits proofs and checks if attestation is collected and posted to Ethereum.

For more details, refer to the e2e-tests README.

To run E2E tests:

```shell
npm run test:e2e
```

### CI Workflow for E2E Tests

We use GitHub Actions to run our E2E tests automatically. The workflow is defined in [.github/workflows/CI-e2e-tests.yml](.github/workflows/CI-e2e-tests.yml).

Key features of the CI workflow:

1. **Triggered by**:

   - Manual dispatch (workflow_dispatch)
   - Workflow call (workflow_call)

2. **Customizable Inputs**:

   - zkverify_tag: Docker image tag for zkverify
   - zkverify_branch: Branch for zkVerify repository
   - attestation_bot_branch: Branch for attestation bot
   - zkv_contracts_branch: Branch for zkv attestation contracts

3. **Main Steps**:

   - Checkout code
   - Set up Node.js
   - Install dependencies
   - Run setup script (cloning latest repos)
   - Set up Docker containers
   - Wait for Ethereum contract deployment
   - Run E2E tests
   - Parse test results
   - Clean up Docker resources

4. **Test Result Parsing**:
   The workflow parses the test output to determine the number of passed, failed, and skipped tests.

5. **Environment Variables**:
   The workflow sets and uses various environment variables, including the deployed contract address.

## GitHub Actions Workflow with Act

Act allows you to test GitHub workflow changes locally.

### Prerequisites

- Docker Desktop installed and running on your Mac.

### MacOS Installation and Setup

1. **Install Act**:

   ```sh
   brew install act
   ```

2. **Configure Act**:

   ```sh
   echo '--container-architecture linux/arm64' > ~/.actrc
   echo '--container-daemon-socket /var/run/docker.sock' >> ~/.actrc
   ```

3. **Docker Settings**:

   - Open Docker Desktop.
   - Navigate to **Preferences** > **Advanced**.
   - Tick the option **"Allow the default Docker socket to be used (requires password)"**.

4. **Set Up Docker Socket**:

   ```sh
   sudo ln -s ~/Library/Containers/com.docker.docker/Data/docker.raw.sock /var/run/docker.sock
   sudo chown $USER /var/run/docker.sock
   ```

5. **Start Docker**:

   ```sh
   open /Applications/Docker.app
   ```

6. **Update Secrets File**:
   Update the [.secrets](.secrets) file with the require environment variables

   - QA_SEED_PHRASE: We can keep as is.
   - QA_SLACK_WEBHOOK_URL: Required to send notifications to the Slack channel
   - GH_TOKEN: Required to clone the zkVerify and attestation-bot repositories
   - DOCKER_HUB_USERNAME: Required to pull private docker images
   - DOCKER_HUB_TOKEN: Required to pull private docker images

### Running Act

Run the following command from the parent directory to test your GitHub Actions workflow locally:

```sh
act workflow_dispatch -P ubuntu-latest=ghcr.io/catthehacker/ubuntu:act-latest --network e2e-tests_default
```

> NOTE: To avoid rebuilding the images in each run, we can temporarily comment the cleanup step in [.github/workflows/CI-e2e-tests.yml](.github/workflows/CI-e2e-tests.yml)
> NOTE: The network flag is used to connect the act container to the services network created by the e2e tests docker-compose file.

This setup allows you to test and debug your GitHub Actions workflows locally before pushing changes to the repository.

## Tips

To catch any error before running the tests, we can perform some checks:

1. Check if the `local_node` service is running and doesn't have any errors. You should see something like this in the logs:

   ```bash
    2024-09-17 14:00:13 2024-09-17 12:00:13 zkVerify Mainchain Node
    2024-09-17 14:00:13 2024-09-17 12:00:13 ✌️  version 0.5.1-814335572eb
    2024-09-17 14:00:13 2024-09-17 12:00:13 ❤️  by Horizen Labs <admin@horizenlabs.io>, 2024-2024
    2024-09-17 14:00:13 2024-09-17 12:00:13 📋 Chain specification: ZKV Local
    2024-09-17 14:00:13 2024-09-17 12:00:13 🏷  Node name: RpcNode
   ```

   If not, see Troubleshooting section in [./src/e2e-tests/README.md](./src/e2e-tests/README.md)

2. Check if the `local_node` service is listening on the correct port (default is 9944)

   ```bash
   curl -s -f -X POST \
   -H "Content-Type: application/json" \
   -d '{"jsonrpc":"2.0","method":"system_health","params":[],"id":1}' \
   http://localhost:9944
   ```

3. Check if the `subquery-node` is running without errors

   - If is returning the error `Value of ChainId does not match across all endpoints` we will need to update the `SUBQUERY_NODE_CHAIN_ID` from the [.src/e2e-tests/.env](.src/e2e-tests/.env) to the one that is expecting

4. Check if the `attestation-bot` is running and dosen't have any errors
   - If returning `Cannot read properties of undefined (reading 'query') {}` could be a problem with the initialization order of the services. Check the list of dependes_on in the docker-compose file and make sure they are started in the correct order.
   - If the service get stuck in the `Waiting for contract data file to be ready...` check the `anvil-node` logs and double check the volumes, sometimes we need to clean up the volumes.
