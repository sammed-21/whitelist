const { ethers } = require("hardhat");

async function main() {
  const WhitelistContract = await ethers.getContractFactory("Whitelist");
  const deployedWhitelistcontract = await WhitelistContract.deploy(10);
  await deployedWhitelistcontract.deployed();
  console.log("whiteList  contract address", deployedWhitelistcontract.address);
}
main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
//contract address 0x9A58804e75aE7AB07A6a904dd6CaAF35Ab743D5D
