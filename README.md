# NFT Minting Platform
This project involves the creation of three separate components that will communicate with each other: a smart contract, frontend and a backend.

<p align="center">
  <img src=https://github.com/djzivkovic/nft-minter-app/assets/58893177/e58429cf-1efd-42ef-bc15-685a3119d0c8" width="900">
</p>

## Components
### Smart Contract

- Handles user registration and NFT minting.
- Both registration and minting transactions cost ether (price is configured at deployment).
- Only registered users can mint NFTs.
- Blacklisted addresses can't register or mint NFTs.
- Only the contract deployer can blacklist addresses.

### Frontend

- Provides a website for user registration, NFT browsing and minting.
- Uses Metamask for connecting wallets and making RPC calls.
- Contract deployer can add addresses to blacklist on the website.
- Displays a shortened EVM address below each minted NFT, linking to the corresponding Etherscan page.

### Backend

- Stores all contract events related to a specific address in a database (registration, minting, blacklist additions).
- Provides a GET route where users can retrieve a list of all events related to a given address.

## Setup

### 1. IPFS Upload
- Change directory to `backend`.
- Run `npm install`.
- Set `PINATA_API_KEY` in `.env`.
- Move NFT images to `assets/images`.
- Run `npm run upload` and save the IPFS Hash from the console.

### 2. Contract deployment
- Change directory to `contracts`.
- Set the `NFT_BASE_URI` in `/contracts/.env` to the saved IPFS Hash.
- Configure the `PRIVATE_KEY` and `SEPOLIA_RPC_URL`.
- Run the following command to deploy to Sepolia testnet:
```sh
source .env
forge script script/NFT.s.sol:NFTScript --broadcast --verify -vvvv --rpc-url ${SEPOLIA_RPC_URL}
```
- Save the contract address.

### 3. Finish the setup
- Configure remaining variables in `backend/.env` and `frontend/.env` such as the contract address, IPFS gateway and database options.

## Run

### 1. Backend
- Run `npm run start:dev`.
### 2. Frontend
- Run `npm run start`.

## Run tests
- Tests are provided for the smart contract and they are run with the following command:
```sh
forge test
```
