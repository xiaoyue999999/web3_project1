require("@nomicfoundation/hardhat-toolbox");
require("@chainlink/env-enc").config();

const SEPOLIA_URL = process.env.SEPOLIA_URL;
const PROJECT_KEY = process.env.PROJECT_KEY;

console.log('SEPOLIA_URL', SEPOLIA_URL)

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: SEPOLIA_URL,
      accounts: [PROJECT_KEY]
    }
  },
  etherscan: {
    // key待定 因为被https://etherscan.io/制裁了
    // userName: xiaoyue
    apiKey: ""
  },
};
