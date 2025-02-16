module.exports = async ({ getNamedAccounts, deployments }) => {
  // 获取配置文件中的地址
  const { firstAccount } = await getNamedAccounts();
  const { deploy } = deployments;

  // 部署脚本
  await deploy("FundMe", {
    from: firstAccount,
    args: [1800],
    log: true
  });
};

module.exports.tags = ["all", "fundme"];
