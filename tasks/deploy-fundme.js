const { task } = require("hardhat/config")

task("deploy-fundme","部署和验证").setAction(async(TASK_COMPILE_GET_REMAPPINGS,hre) => {
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
})
async function verifyFundMe(fundMeAddr,args) {
    //验证合约
    await hre.run("verify:verify", {
        address: fundMeAddr,
        constructorArguments: [args],
      }); 
}

module.exports = {}