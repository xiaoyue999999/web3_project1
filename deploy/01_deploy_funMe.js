const { network } = require('hardhat');
const { fundMeContinueTime, developObj, developList } = require('../help-hardhat.config');

module.exports = async ({ getNamedAccounts, deployments }) => {
  // 获取配置文件中的地址
  const { firstAccount } = await getNamedAccounts();
  const { deploy } = deployments;

  let dataFeedAddr;
  if (developList.includes(network.name)) {
    const mockAggregator = await deployments.get("MockV3Aggregator");
    dataFeedAddr = mockAggregator.address;
  } else {
    dataFeedAddr = developObj[network.config.chainId].ethUsdDataFeed;
  }

  // 部署脚本
  const fundMe = await deploy("FundMe", {
    from: firstAccount,
    args: [fundMeContinueTime, dataFeedAddr],
    log: true,
    waitConfirmations: 3 // 等待三个区块
  });

  // 验证合约
  if (hre.network.config.chainId === 11155111 && process.env.ETHERSCAN_KEY) {
    await hre.run("verify:verify", {
      address: fundMe.address,
      constructorArguments: [fundMeContinueTime, dataFeedAddr],
    });
  } else {
    console.log('执行参数不完全 不可验证');
  }
};

module.exports.tags = ["all", "fundme"];
