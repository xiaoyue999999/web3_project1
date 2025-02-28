# 创建一个新的hardhat 项目
```
npm init 初始化文件夹
npm install --save-dev hardhat 下载hardhat
npx hardhat init 初始化项目

npx hardhat compile 编译项目
如果不编译项目 那么也会在npx hardhat run script/路径中 会自动执行
```

### 运行
````
运行命令为 npx hardhat run script/deployFundMe
是 npx hardhat run script/deployFundMe --networks hardhat 的简写

如果更改部署网络需要更改为
npx hardhat run script/deployFundMe --networks sepolia
````
### 运行命令为 npx hardhat run script/deployFundMe
```项目是需要在scripts中进行启动```

## 使用 .env.enc加密方式保存url 以及私钥
```
下载 npm install @chainlink/env-enc

修改密码 npx env-enc set-pw
增加想要存储的信息 npx env-enc set 先输入名称 后输入想要的值

使用之前需要先输入密码 如果不输入密码 或者密码错误 就会走其他的存储

使用就和.env相同
```

### 在hardhat中如何对合约进行验证
```
npx hardhat verify --network sepolia 部署地址 "初始传入信息"
npx hardhat verify --network sepolia 0x1cE81d8a865aFa954F1341241c5b32Fec16C6E00 "10"
```

### 使用hardhat可以把方法抽为task
```
命令为 npx hardhat help
不携带参数使用命令
npx hardhat name --network sepolia
携带参数
npx hardhat name --addr 参数 --network sepolia

自定义
task("name", "描述").setAction((taskArgs, hre) => {});
// 增加参数
task("name"", "描述").addParam("addr", "描述").setAction((taskArgs, hre) => {
     const fundMeFactory = await ethers.getContractFactory("FundMe");
     // attach
     const fundMe = fundMeFactory.attach(taskArgs.addr); // 贴到地址中
});
```

### 使用hardhat-deploy部署脚本
```
下载 npm install -D hardhat-deploy
执行命令为 npx hardhat deploy

创建专属文件夹 deploy
```

### 使用test测试编写使用测试用例
```
使用chai进行编写测试用例。
创建专属文件夹 test 
启动命令为 npx hardhat test
```

### 使用mock合约
```
创建正常是在contracts中创建mock文件
正常使用deploy进行文件的部署

在其他合约中使用
const mockAggregator = await deployments.get("MockV3Aggregator");
dataFeedAddr = mockAggregator.address;
```

### 合约被缓存
`可以在命令行后面加上 --reset`
`npx hardhat deploy --network sepolia --reset`

### 命令工具
```
使用 hardhat-gas-reporter  可以看到执行单元测试的时候 使用的gas费用

以及使用npx hardhat coverage 可以看到自己单元测试的覆盖量
```