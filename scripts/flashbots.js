const {
  FlashbotsBundleProvider,
} = require("@flashbots/ethers-provider-bundle");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });

async function main() {
  // Deploy NFT contract
  const fakeNFT = await ethers.getContractFactory("FakeNFT");
  const FakeNFT = await fakeNFT.deploy();
  await FakeNFT.deployed();

  console.log("Address of the FakeNFT:", FakeNFT.address);

  // Alchemy WebSocket provider with explicit Sepolia chain ID (11155111)
  const provider = new ethers.providers.WebSocketProvider(
    process.env.ALCHEMY_WS_URL,
    { name: "sepolia", chainId: 11155111 }  // Explicit chain ID for Sepolia
  );

  // Wrap private key in the ethers wallet class
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // Flashbots provider which forwards requests to the relayer and sends them to Flashbots miner
  const flashbotsProvider = await FlashbotsBundleProvider.create(
    provider,
    signer,
    "https://relay-sepolia.flashbots.net",  // Relay URL for Sepolia network
    "sepolia"
  );

  provider.on("block", async (blockNumber) => {
    console.log("Block Number:", blockNumber);
    
    try {
      // Fetch the current block to get the base fee
      const block = await provider.getBlock(blockNumber);
      const baseFee = block.baseFeePerGas;

      // Set max fee parameters based on the current base fee
      const maxFeePerGas = baseFee.mul(2); // Set to 2x the base fee
      const maxPriorityFeePerGas = BigNumber.from(2 * 10 ** 9); // Set a fixed priority fee (2 Gwei)

      // Send the bundle with transaction data
      const bundleResponse = await flashbotsProvider.sendBundle(
        [
          {
            transaction: {
              // ChainId for the Sepolia network
              chainId: 11155111,
              // EIP-1559 transaction type
              type: 2,
              // Value of 1 FakeNFT (in Ether)
              value: ethers.utils.parseEther("0.01"),
              // Address of the FakeNFT contract
              to: FakeNFT.address,
              // In the data field, we pass the function selector of the mint function
              data: FakeNFT.interface.getSighash("mint()"),
              // Max Gas Fees you are willing to pay
              maxFeePerGas: maxFeePerGas,
              // Max Priority Gas Fees you are willing to pay
              maxPriorityFeePerGas: maxPriorityFeePerGas,
            },
            signer: signer,
          },
        ],
        blockNumber + 1  // Target the next block
      );

      // Check for errors
      if ("error" in bundleResponse) {
        console.log("Error:", bundleResponse.error.message);
      } else {
        console.log("Bundle successfully sent!");
      }
    } catch (error) {
      console.error("Error in block processing:", error);
    }
  });
}

// Start the main function
main().catch((error) => {
  console.error("Error in script execution:", error);
});

