const { ethers } = require('hardhat');

// sepolia测试网chainid
const CHAINID = 11155111;

async function main () {
  // 初始化获取文件内容
  const fundMetFactory = await ethers.getContractFactory('FundMe');

  // 执行部署合约
  const fundMe = await fundMetFactory.deploy(180);

  // 等待合约全部部署完成
  await fundMe.waitForDeployment();
  console.log('部署成功', fundMe.target);

  // 如果是sepolia的环境下 && 有sepolia的key才验证合约
  if (hre.network.config.chainId === CHAINID && process.env.ETHERSCAN_KEY) {
    console.log('等待五个区块 开始验证');
    await fundMe.deploymentTransaction().wait(5);
    await verifyFundMe(fundMe.target, [180]);
  } else {
    console.log('无法在sepolia中验证');
  }

  // 获取两个账户
  const [address1, address2] = await ethers.getSigners();
  // 使用账户1向fundMe中转账0.1个eth
  const fundTx = await fundMe.connect(address1).fund({ value: ethers.parseEther('0.1') });
  await fundTx.wait(); // 等待转账完成
  // 查看合约的余额
  const balanceCount = await ethers.provider.getBalance(fundMe.target);
  console.log('账户余额', balanceCount);

  // 使用账户2 向fundMe中转账0.1个eth
  const fundTx2 = await fundMe.connect(address2).fund({ value: ethers.parseEther('0.1') })
  await fundTx2.wait();
  // 查看合约账户
  const fundersToMoneyAdd1 = await fundMe.fundersToMoney(address1.address);
  const fundersToMoneyAdd2 = await fundMe.fundersToMoney(address2.address);
  // 查看对应转账数量
  console.log(`账户${address1.address}在合约中存储为${fundersToMoneyAdd1}`);
  console.log(`账户${address2.address}在合约中存储为${fundersToMoneyAdd2}`);
}

// 使用代码的形式验证合约
async function verifyFundMe (address, args) {
  await hre.run("verify:verify", {
    address,
    constructorArguments: args,
  });
}

main().catch((err) => {
  console.log('err', err);
})
