require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
const INFURA_API_KEY_URL_SEPOLIA = process.env.INFURA_API_KEY_URL_SEPOLIA;
const INFURA_API_KEY_URL_GOERLI = process.env.INFURA_API_KEY_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
module.exports = {
  solidity: "0.8.0",
  networks: {
    goerli: {
      url: INFURA_API_KEY_URL_GOERLI,
      accounts: [PRIVATE_KEY],
    },
    sepolia: {
      url: INFURA_API_KEY_URL_SEPOLIA,
      accounts: [PRIVATE_KEY],
    },
    //0x88a80Fc20029764268bDC978Ea195271c8CA6cb3
  },
};
