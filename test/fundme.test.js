//测试

const { ethers, deployments, getNamedAccounts, network } = require("hardhat")
const { assert, expect } = require("chai")
const helpers = require("@nomicfoundation/hardhat-network-helpers")


describe("test fundme contract", async function() {
    let fundMe
    let firstAccount
    let mockV3Aggregator
    let fundMeSecondAccount
    let secondAccount
    beforeEach(async function () {
        await deployments.fixture(["all"])
        firstAccount = (await getNamedAccounts()).firstAccount
        secondAccount = (await getNamedAccounts()).secondAccount
        const fundMeDeployment = await deployments.get("FundMe")
        mockV3Aggregator = await deployments.get("MockV3Aggregator")
        fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address)
        fundMeSecondAccount = ethers.getContract("FundMe",secondAccount)
    })


    it("test if the owner is msg.sender", async function() {
        await fundMe.waitForDeployment()
        assert.equal((await fundMe.owner()), firstAccount)
    })

    it("test if the datafeed is assigned correctly", async function() {
        await fundMe.waitForDeployment()
        assert.equal((await fundMe.dataFeed()), mockV3Aggregator.address)
    })


    //单元测试
    //fund refund 
    it("window closed,value grater than minimum, fund failed",async function(){
        //make sure the window is closed 
        await helpers.time.increase(200)
        await helpers.mine()
        //value is grater than minimum
        expect (fundMe.fund({value: ethers.parseEther("0.1")}))
        .to.be.revertedWith("window is closed")//wei 
    })

    it("window open,value less than minimum, fund failed",async function(){
        //value is grater than minimum
        expect (fundMe.fund({value: ethers.parseEther("0.01")}))
        .to.be.revertedWith("Send more ETH")//wei 
    })

    it("window open,value grater than minimum, fund success",async function(){
        //value is grater than minimum
       await fundMe.fund({value: ethers.parseEther("0.1")})

       const balance = await fundMe.fundersToAmount(firstAccount)
       expect(balance).to.equal(ethers.parseEther("0.1"))
    })

    //getfund
    it("not onwer,window closed, target reached,getFund failed",async function(){

        //make sure the target is reached
        await fundMe.fund({value: ethers.parseEther("1")})

        await helpers.time.increase(200)
        await helpers.mine()
        await expect(fundMeSecondAccount.getFund()).to.be.revertedWith("this function can only be called by owner")
    })

})
