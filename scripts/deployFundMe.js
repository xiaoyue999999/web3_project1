const { ethers } = require('hardhat');

async function main () {
  // 初始化获取文件内容
  const fundMetFactory = await ethers.getContractFactory('FundMe');

  // 执行部署合约
  const fundMe = await fundMetFactory.deploy(10);

  // 等待合约全部部署完成
  await fundMe.waitForDeployment();
  console.log('部署成功', fundMe.target);
}

main().catch((err) => {
  console.log('err', err);
})
