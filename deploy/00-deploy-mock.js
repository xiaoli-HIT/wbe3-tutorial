const {DECIMAL,INITIAL_ANSWER,devlopmentChains} = require("../helper-hardhat-config")

module.exports = async({getNamedAccounts,deployments}) => {

    if(devlopmentChains.includes(network.name)){
        const firstAccount = (await getNamedAccounts()).firstAccount
        const {deploy} = deployments
        await deploy("MockV3Aggregator",{
            from: firstAccount,
            args: [8,300000000000],
            log: true
        })
    }else{
        console.log("environment is not local,mock contract deployment is skipping....")
    }

} 

module.exports.tags = ["all","mock"]