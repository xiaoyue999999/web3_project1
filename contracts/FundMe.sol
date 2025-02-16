// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { AggregatorV3Interface } from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

// 主要目的是收款
/*
1、创建一个收款函数
2、记录投资人 并且查看
3、在锁定期内，达到目标值，生产商可以提款
4、在锁定期内 没有达到目标 给用户退款
*/

// payable 转账需要使用

contract FundMe {
    AggregatorV3Interface public dataFeed;

    // 构造函数  只有初始会执行
    constructor(uint256 _lockTime, address defaAddr) {
        lockTime = _lockTime;
        deployTime = block.timestamp;
        owner = msg.sender;
        dataFeed = AggregatorV3Interface(defaAddr); //获取ETH链上地址初始化
    }

    // 最小投资单位 使用的主链的数量来进行对比 不是使用USD
    // 10的18次方等于1个ETH
    // uint256 REQUIRE_VALUE = 1 * 10 ** 18; // 至少1个ETH
    uint256 constant REQUIRE_VALUE = 100 * 10 ** 18; // 至少需要100USD

    uint256 constant TARGET = 1000 * 10 ** 18; // 1000美刀目标

    // 记录投资人 以及投资金额
    mapping(address => uint256) public fundersToMoney;

    address public owner;

    // 合约部署时间
    uint256 deployTime;
    // 持续时间
    uint256 lockTime;

    // erc20地址
    address erc20Addr;

    bool public getFundSuccess = false;

    // 使用emit形式发送数据，算是通知其他合约交互
    // 算是log日志信息
    event FundWithdrawByOwner(uint256);

    // 转账
    function fund () external payable {
        // 最小值判断
        require(convertEthtoUsd(msg.value) >= REQUIRE_VALUE, "no money");
        // 时间范围判断
        require(block.timestamp < (deployTime + lockTime), "window is close");
        fundersToMoney[msg.sender] = msg.value;
    }

    // 在锁定期内，达到目标值，生产商可以提款
    function getFund() external ownerVerify windowClose {
        uint256 balanceMoney = convertEthtoUsd(address(this).balance); // 获取当前合约的余额 本身是wei单位 需要转换
        require(balanceMoney >= TARGET, "no 1000$");

        bool success;
        uint256 balance = address(this).balance;
        (success,) = payable(owner).call{value: balance}("");
        getFundSuccess = true;
        emit FundWithdrawByOwner(balance);
    }

    // 在锁定期内 没有达到目标 给用户退款
    function reFund() external windowClose {
        require(address(this).balance < TARGET, "no satisfy money");
        require(fundersToMoney[msg.sender] > 0, "no money");

        uint256 money = fundersToMoney[msg.sender];
        fundersToMoney[msg.sender] = 0;
        bool success;
        (success,) = payable(msg.sender).call{value: money}("");
        require(success, "transfer tx error");
    }

    // owner提款
    function withdraw() public ownerVerify {
        uint256 constantBalance = address(this).balance;
        require(constantBalance > 0, "dayu 0");

        // 转账有三种方式 最常用的是call
        // 1、transfer
        // payable(msg.sender).transfer(constantBalance);
        // 2、send
        // bool success = payable(msg.sender).send(constantBalance);
        // 3、call
        // (success, result) = payable(msg.sender).call{value: constantBalance}("convertEthtoUsd");
        bool success;
        (success,) = payable(msg.sender).call{value: constantBalance}("");
    }

    function setFundersToMoney (address addr, uint256 count) public {
        // 只有erc20这个合约可以更改这余额
        require(msg.sender == erc20Addr, "no owner");
        fundersToMoney[addr] = count;
    }

    function setErc20Addr (address _erc20Addr) public ownerVerify {
        erc20Addr = _erc20Addr;
    }

    // 修改所有人
    function changeOwner(address newOwner) external ownerVerify {
        owner = newOwner;
    }

    // 修饰符 校验 判断当前人是否是owner
    modifier ownerVerify() {
        require(owner == msg.sender, "no owner");
        _;
    }

    // 时间范围以外
    modifier windowClose() {
        require(block.timestamp >= (deployTime + lockTime), "window is time close");
        _;
    }

    // 获取链上ETH价格
    function getChainlinkDataFeedLatestAnswer() internal view returns (int) {
        // prettier-ignore
        (
        /* uint80 roundID */,
            int answer,
        /*uint startedAt*/,
        /*uint timeStamp*/,
        /*uint80 answeredInRound*/
        ) = dataFeed.latestRoundData();
        return answer;
    }

    // 转换函数 从ETH -> USD
    function convertEthtoUsd(uint256 value) internal view returns(uint256) {
        // 获取链上 有精度的问题 需要转换
        // ETH === USD   那么精度是10 ** 8次方
        // 未知 === ETH   精度为 10 ** 18
        uint256 ethPrice =  uint256(getChainlinkDataFeedLatestAnswer()); // 266635682783 当前eth价格为2666$
        // uint256 ethPrice =  uint256(266635682783);
        return value * ethPrice / (10 ** 8);
    }
}
