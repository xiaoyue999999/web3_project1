const { ethers } = require('hardhat');

async function main() {
  const demoFactory = await ethers.getContractFactory('Demo');

  const Demo = await demoFactory.deploy(10086);

  await Demo.waitForDeployment();

  console.log('部署成功', Demo.target);
}

main().catch((err) => {
  console.log('err', err);
})
