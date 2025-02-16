const { network } = require('hardhat');
const { PRECISION, ETH_DEFAULT, developList } = require('../help-hardhat.config');

module.exports = async ({ getNamedAccounts, deployments }) => {
    if (developList.includes(network.name)) {
        // 获取配置中的地址
        const { firstAccount } = await getNamedAccounts();
        const { deploy } = deployments;

        await deploy("MockV3Aggregator", {
            from: firstAccount,
            args: [PRECISION, ETH_DEFAULT],
            logs: true,
        })
    } else {
        console.log('不是本地环境， 测试合约并不部署');
    }
}

module.exports.tags = ["all", "mock"];