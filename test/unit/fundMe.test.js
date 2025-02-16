const { ethers, deployments, getNamedAccounts } = require('hardhat');
const { assert, expect } = require("chai");
const helpers = require("@nomicfoundation/hardhat-network-helpers")

describe("验证fundMe合约", async () => {
  let fundMe;
  let fundMeSecondAccount;
  let firstAccount;
  let dataFeedObj;
  beforeEach(async () => {
    // 部署合约
    await deployments.fixture(["all"]);

    // 获取owner地址
    firstAccount = (await getNamedAccounts())?.firstAccount;
    const seconAccount = (await getNamedAccounts())?.seconAccount;
    // 获取已经部署的合约信息
    const fundMeObj = await deployments.get("FundMe");
    dataFeedObj = await deployments.get("MockV3Aggregator");

    // 获取FundMe的实例
    fundMe = await ethers.getContractAt("FundMe", fundMeObj.address);
    fundMeSecondAccount = await ethers.getContract("FundMe", seconAccount);
  });

  it('验证合约的owner是否是属于部署人', async () => {
    await fundMe.waitForDeployment();

    assert.equal(await fundMe.owner(), firstAccount);
  });

  it('验证 sepolia地址 是否与使用地址相同', async () => {
    await fundMe.waitForDeployment();

    assert.equal(await fundMe.dataFeed(), dataFeedObj.address);
  });

  // 单元测试
  // fund函数中必填是否正常、以及fundersToMoney是否正确存储用户所发送的值
  it("验证 fund 中时间范围以外是否真的可以被校验", async () => {
    await helpers.time.increase(2000); // 在测试中可以直接让时间戳发生变化
    await helpers.mine();

    await expect(fundMe.fund({ value: ethers.parseEther('0.1') })).to.be.revertedWith("window is close");
  });

  it("验证最小值是否可以输入进来", async () => {
    await expect(fundMe.fund({ value: ethers.parseEther("0.001") })).to.be.revertedWith("no money");
  });

  it("转账进来以后查看fundersToMoney 是否有没有正确存储", async () => {
    await fundMe.fund({ value: ethers.parseEther("0.1") });

    const balance = await fundMe.fundersToMoney(firstAccount);

    expect(balance).to.equal(ethers.parseEther("0.1"));
  });

  // getFund单元测试
  // 当前登陆人是否owner 、 时间范围以外 、时间范围以内
  it("时间范围以外，目标值没有达成 失败", async () => {
    await fundMe.fund({ value: ethers.parseEther("0.1") });

    await helpers.time.increase(2000);
    await helpers.mine();

    await expect(fundMe.getFund()).to.be.revertedWith("no 1000$");
  });

  it("达到目标值 时间范围以内 不满足", async () => {
    await fundMe.fund({ value: ethers.parseEther("1") });

    await expect(fundMe.getFund()).to.be.revertedWith("window is time close");
  });

  it("当前登陆人不是owner情况 不可以调用此函数", async () => {
    await expect(fundMeSecondAccount.getFund()).to.be.revertedWith("no owner");
  });

  it("getFund 都是正常情况下调用", async () => {
    await fundMe.fund({ value: ethers.parseEther("1") });

    await helpers.time.increase(2000);
    await helpers.mine();

    await expect(fundMe.getFund()).to.emit(fundMe, 'FundWithdrawByOwner').withArgs(ethers.parseEther("1"));
  });
});
