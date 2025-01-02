//import ether.js
//create main function
//execute main function 

const {ethers} = require("hardhat")  //引入包

//异步函数 才能用await
async function mian(){
    // create factory
    const fundMeFactory = await ethers.getContractFactory("FundMe")
    console.log ("contract deploying")
    // deploy contract from factory
    const fundMe = await fundMeFactory.deploy(20)
    await fundMe.waitForDeployment()
    console.log("contract has been deployed successfully,contract address is "+ fundMe.target)
   
    // verify fundme  通过脚本
    if (hre.network.config.chainId == 11155111  && process.env.ETHERSCAN_API_KEY){
        await fundMe.deploymentTransaction().wait(5)
        console.log("waiting for 5 confirmations")
        await verifyFundMe(fundMe.target,[20])
    } else {
        console.log("verfication skipped..")
    }

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


}

async function verifyFundMe(fundMeAddr,args) {
    //验证合约
    await hre.run("verify:verify", {
        address: fundMeAddr,
        constructorArguments: [args],
      }); 
}



mian().then().catch((error) => {
    console.error(error)
    process.exit(1)
})