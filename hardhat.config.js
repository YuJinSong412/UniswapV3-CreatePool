require("dotenv").config();

require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.21",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/0cM9ij8Yl4DorntG3AxXRJ-WxD-Pw53R",
      accounts:
      ["2defb361cec3a6c0a8f09f1882bd30fdb86e8fd87d0711a01e0d535b6bb15ca2"]//process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: "D2CWJC32W63ZZUR2VD1C4IEAEIMUJNZ89R",
  },
};