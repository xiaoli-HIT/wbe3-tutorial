const { task } = require("hardhat/config")


task("interact-fundMe","合约交互")
.addParam("addr","fundme contract address")
.setAction(async(taskArgs,hre)=>{
        const fundMeFactory = await ethers.getContractFactory("FundMe")
        const fundme = fundMeFactory.attach(taskArgs.addr)
        const [firstAccount,secondAccount] = await ethers.getSigners()
    
        const fundTx = fundMe.fund({value:ethers.parseEther("0.5")})
        await fundTx.wait()
    
        const balanceOfContract = ethers.provider.getBalance(fundMe.target)
        console.log(`balance of the contract is ${balanceOfContract}`)    
    
        const fundTx2 = fundMe.connect(secondAccount).fund({value:ethers.parseEther("0.5")})
        await fundTx2.wait()
    
        const balanceOfContract2 = ethers.provider.getBalance(fundMe.target)
        console.log(`balance of the contract is ${balanceOfContract2}`)  
    
        const firstAccountbalanceInFundMe = await fundMe.fundersToAmount(firstAccount.address)
        const firstAccountbalanceInFundMe2 = await fundMe.fundersToAmount(secondAccount.address)
        console.log(`balance of first is  ${firstAccountbalanceInFundMe}`)
        console.log(`balance of second is  ${firstAccountbalanceInFundMe2}`)
    
})

module.exports = {}