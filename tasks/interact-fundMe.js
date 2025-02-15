const { task } = require('hardhat/config');

// 已经部署的合约地址
// 0x9d75eA3De7042D5989dba8A65342Dadf27976d31
task("interact-fundMe", "与fundMe合约进行交互").addParam("addr", "已经部署的合约地址").setAction(async (taskArgs, hre) => {
  const fundMeFactory = await ethers.getContractFactory("FundMe");
  const fundMe = fundMeFactory.attach(taskArgs.addr); // 贴到地址中

  // 获取两个账户
  const [address1, address2] = await ethers.getSigners();

  // 使用账户1向fundMe中转账0.1个eth
  const fundTx = await fundMe.connect(address1).fund({ value: ethers.parseEther('0.05') });
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
})

module.exports = {};
