/* function deployFunction() {
    console.log("this is a deploy function")
} */

const { getNamedAccounts, network } = require("hardhat")
const {CONFORMATIONS,DECIMAL,INITIAL_ANSWER,devlopmentChains,networkConfig,LOCK_TIME} = require("../helper-hardhat-config")
const { verify } = require("../hardhat.config")

/* module.exports = async(hre) => {
    const getNamedAccounts = hre.getNamedAccounts
    const deployments = hre.deployments
    console.log("this is a deploy function")
}  */

module.exports = async({getNamedAccounts,deployments}) => {
    const firstAccount = (await getNamedAccounts()).firstAccount
    const {deploy} = deployments
    let dataFeedAddr
    let confirmations 
    if(devlopmentChains.includes(network.name)){
        const MockV3Aggregator = await deployments.get("MockV3Aggregator")
        dataFeedAddr=MockV3Aggregator.address
        confirmations=0
    }else{
        confirmations=CONFORMATIONS
        dataFeedAddr = networkConfig[network.config.chainId].ethUsdDataFeed
    }
    
    const fundMe = await deploy("FundMe",{
        from: firstAccount,
        args: [LOCK_TIME,dataFeedAddr],
        log: true,
        waitConfirmations: confirmations
    })

    if (hre.network.config.chainId == 11155111 && process.env.ETHERSCAN_API_KEY){
        await hre.run("verify",{
            address: fundMe.address,
            constructorArguments: [LOCK_TIME,dataFeedAddr]
        })
    }else{
        console.log("network is not sepolia,skip....")
    }
} 

module.exports.tags = ["all","fundme"]