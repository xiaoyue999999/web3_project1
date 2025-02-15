const { task } = require('hardhat/config');

const CHAINID = 11155111;

task("deploy-fundMe", "部署验证fundme合约").setAction(async (taskArgs, hre) => {
  // 初始化获取文件内容
  const fundMetFactory = await ethers.getContractFactory('FundMe');

  // 执行部署合约
  const fundMe = await fundMetFactory.deploy(1800);

  // 等待合约全部部署完成
  await fundMe.waitForDeployment();
  console.log('部署成功', fundMe.target);

  // 如果是sepolia的环境下 && 有sepolia的key才验证合约
  if (hre.network.config.chainId === CHAINID && process.env.ETHERSCAN_KEY) {
    console.log('等待五个区块 开始验证');
    await fundMe.deploymentTransaction().wait(5);
    await verifyFundMe(fundMe.target, [1800]);
  } else {
    console.log('无法在sepolia中验证');
  }
});

// 使用代码的形式验证合约
async function verifyFundMe (address, args) {
  await hre.run("verify:verify", {
    address,
    constructorArguments: args,
  });
}

module.exports = {};
