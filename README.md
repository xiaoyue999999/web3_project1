# 创建一个新的hardhat 项目
### npm init 初始化文件夹
### npm install --save-dev hardhat 下载hardhat
### npx hardhat init 初始化项目

### npx hardhat compile 编译项目
如果不编译项目 那么也会在npx hardhat run script/路径中 会自动执行

## 运行
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

