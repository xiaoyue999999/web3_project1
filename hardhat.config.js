require("@nomicfoundation/hardhat-toolbox");
require("@chainlink/env-enc").config();
require('./tasks/index');

const SEPOLIA_URL = process.env.SEPOLIA_URL;
const PROJECT_KEY = process.env.PROJECT_KEY;
const PROJECT_KEY_1 = process.env.PROJECT_KEY_1;
const ETHERSCAN_KEY = process.env.ETHERSCAN_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: SEPOLIA_URL,
      accounts: [PROJECT_KEY, PROJECT_KEY_1],
      chainId: 11155111
    }
  },
  etherscan: {
    // https://etherscan.io
    // userName: xaioli
    apiKey: ETHERSCAN_KEY
  },
  sourcify: {
    enabled: true
  }
};
