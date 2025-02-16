const { ethers, deployments, getNamedAccounts } = require('hardhat');
const { assert } = require("chai");

describe("验证fundMe合约", async () => {
  let fundMe;
  let firstAccount;
  beforeEach(async () => {
    // 部署合约
    await deployments.fixture(["all"]);

    // 获取owner地址
    firstAccount = (await getNamedAccounts())?.firstAccount;
    // 获取已经部署的合约信息
    const fundMeObj = await deployments.get("FundMe");
    // 获取FundMe的实例
    fundMe = await ethers.getContractAt("FundMe", fundMeObj.address);
  });

  it('验证合约的owner是否是属于部署人', async () => {
    // const [addr] = await ethers.getSigners();
    // const fundMeFactory = await ethers.getContractFactory('FundMe');
    // const fundMe = await fundMeFactory.deploy(180); // 合约部署命令发布
    await fundMe.waitForDeployment();

    assert.equal(await fundMe.owner(), firstAccount);
  });

  it('验证 sepolia地址 是否与使用地址相同', async () => {
    // const fundMeFactory = await ethers.getContractFactory("FundMe");
    // const fundMe = await fundMeFactory.deploy(180);
    await fundMe.waitForDeployment();

    assert.equal(await fundMe.dataFeed(), "0x694AA1769357215DE4FAC081bf1f309aDC325306");
  });
});
