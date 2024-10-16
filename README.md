
---

# FakeNFT Project

## Overview

The **FakeNFT** project is a demonstration of deploying a simple ERC721 NFT contract on the Sepolia test network. The project includes a minting function that allows users to mint a fake NFT by sending a specified amount of Ether. This project also integrates with Flashbots to bundle and send transactions, allowing for efficient and gas-optimized interactions with the Ethereum blockchain.

## Features

- **ERC721 NFT Contract**: A simple NFT contract that allows users to mint fake NFTs.
- **Flashbots Integration**: Uses Flashbots to send batched transactions to the network, optimizing for gas fees.
- **WebSocket Provider**: Connects to the Ethereum Sepolia test network via Alchemy's WebSocket provider.

## Prerequisites

- Node.js (v14 or later)
- Hardhat
- Alchemy account with WebSocket access
- Private key of an Ethereum wallet with Sepolia test Ether

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/fakenft.git
   cd fakenft
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following variables:

   ```plaintext
   ALCHEMY_WS_URL=wss://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY
   PRIVATE_KEY=YOUR_WALLET_PRIVATE_KEY
   ```

   Replace `YOUR_ALCHEMY_API_KEY` with your actual Alchemy API key and `YOUR_WALLET_PRIVATE_KEY` with your wallet's private key.

## Deployment

To deploy the FakeNFT contract, run the following command:

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

## Usage

1. Ensure you have Sepolia test Ether in your wallet.
2. Run the script to start listening for new blocks and send minting transactions:

   ```bash
   node scripts/flashbots.js
   ```

3. The script will automatically send a transaction to mint a fake NFT whenever a new block is detected.

## Contract Details

### FakeNFT Contract

The `FakeNFT` contract is a simple ERC721 implementation. It features:

- **Minting Function**: Users can mint an NFT by sending exactly 0.01 Ether.
- **Token ID Management**: The contract maintains a simple counter to generate unique token IDs.

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract FakeNFT is ERC721 {
    uint256 tokenId = 1;
    uint256 constant price = 0.01 ether;

    constructor() ERC721("FAKE", "FAKE") {}

    function mint() public payable {
        require(msg.value == price, "Ether sent Incorrect");
        _mint(msg.sender, tokenId);
        tokenId += 1;
    }
}
```

## Error Handling

- If there is an error sending the transaction bundle, it will be logged in the console.
- Ensure that your wallet has sufficient test Ether for minting.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
# -FakeNFT-Project
