const { ethers, deployments, getNamedAccounts, network } = require('hardhat');
const { expect } = require("chai");
const { developList } = require("../../help-hardhat.config");

// 集成测试
developList.includes(network.name) ? describe.skip : describe("验证fundMe合约", async () => {
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

    // getFund 正常执行
    // reFund 正常执行
    it('getFund 正常执行', async () => {
        // taget达成
        await fundMe.fund({ value: ethers.parseEther("0") });
        // 保证时间的流逝
        await new Promise(resolve => resolve, 200 * 1000);

        const getFundTx = await fundMe.getFund();
        const getFundTxRes = await getFundTx.wait();

        await expect(getFundTxRes)
            .to.emit(fundMe, 'FundWithdrawByOwner')
            .withArgs(ethers.parseEther("0.5"));
    });

    it('reFund 正常执行', async () => {
        // taget未达成
        await fundMe.fund({ value: ethers.parseEther("0") });
        // 保证时间的流逝
        await new Promise(resolve => resolve, 200 * 1000);

        const reFundTx = await fundMe.reFund();
        const reFundTxRes = await reFundTx.wait();

        await expect(reFundTxRes)
            .to.emit(fundMe, 'ReFundByFunder')
            .withArgs(firstAccount, ethers.parseEther("0.1"));
    });
});
