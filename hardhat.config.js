require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("@chainlink/env-enc").config();
require('./tasks/index');
require('ethers');
require('hardhat-deploy-ethers')

const SEPOLIA_URL = process.env.SEPOLIA_URL;
const PROJECT_KEY = process.env.PROJECT_KEY;
const PROJECT_KEY_1 = process.env.PROJECT_KEY_1;
const ETHERSCAN_KEY = process.env.ETHERSCAN_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  mocha: {
    timeout: 300000
  },
  networks: {
    sepolia: {
      url: SEPOLIA_URL, // 讲合约部署到线上环境
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
  },
  namedAccounts: {
    firstAccount: {
      default: 0, // 去寻找数组中的第一项元素命名accounts
    },
    seconAccount: {
      default: 1, // 寻找第二项
    }
  }
};
