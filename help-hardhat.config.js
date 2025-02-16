const PRECISION = 8; // 设置精度
const ETH_DEFAULT = 300000000000; // 设置ETH默认值

const developList = ['hardhat', 'last']; // 测试本地 name地址

const developObj = {
  // sepolia测试链中
  11155111: {
    // eth对usd的地址
    ethUsdDataFeed: '0x694AA1769357215DE4FAC081bf1f309aDC325306'
  }
}

// fundMe部署中常量定义
const fundMeContinueTime = 1800;

module.exports = {
  PRECISION,
  ETH_DEFAULT,
  developObj,
  developList,
  fundMeContinueTime
}
