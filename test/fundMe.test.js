const { ethers } = require('hardhat');
const { assert } = require("chai");

describe("验证fundMe合约", async () => {
  it('验证合约的owner是否是属于部署人', async () => {
    const [addr] = await ethers.getSigners();
    const funMeFactory = await ethers.getContractFactory('FundMe');
    const funMe = await funMeFactory.deploy(180); // 合约部署命令发布
    await funMe.waitForDeployment();

    assert.equal(await funMe.owner(), addr.address);
  });

  it('验证 sepolia地址 是否与使用地址相同', async () => {
    const fundMeFactory = await ethers.getContractFactory("FundMe");
    const fundMe = await fundMeFactory.deploy(180);
    await fundMe.waitForDeployment();

    assert.equal(await fundMe.dataFeed(), "0x694AA1769357215DE4FAC081bf1f309aDC325306");
  });
});
