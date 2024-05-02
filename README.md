# Praetor-Frontend

Praetor-Fronend is UI of the Praetor Application and accessible via akash.praetorapp.com

## Installation

To install dependencies, you can use Yarn. Run the following command in the root directory of your project:

```bash
yarn install
```

## Running the Application

Depending on your development needs, you can start the application in various modes by running one of the following commands:

```bash
# Start the application in development mode
yarn start
```

## Environment Variables

To run the project, you must set up the required environment variables. Create a .env file in the root directory and populate it with the following keys:

```bash
# Basic Configuration
GENERATE_SOURCEMAP = false

# Akash RCP must have cross origin enabled
REACT_APP_RPC_URL=https://akash-rpc-url
REACT_APP_BACKEND_URL=https://praetor-backend-url
REACT_APP_AUTH_URL=https://praetor-security-url

## Testnet Information
REACT_APP_RPC_URL_TESTNET=https://akash-testnet-rpc-url
REACT_APP_API_URL_TESTNET=https://praetor-backend-testnet-url

#Testnet Configuration
REACT_APP_TESTNET_NAME=GPU Sandbox
REACT_APP_TESTNET_CHAIN_ID=sandbox-01
```