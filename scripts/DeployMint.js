/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */
/* eslint-disable no-var */
/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
const { ethers } = require("ethers");
const { ethers: hreEthers } = require("hardhat");
const ERC20_ABI = require("../artifacts/contracts/Token.sol/Token.json").abi;

async function main(){

var token0Address = "0xb04F915966301a484C684dC4728C46dbdcA8A829";
var token1Address = "0xf30f1c5A27622645CF46b5a6ABc4AB3a2Bf84235";

var amount0 = ethers.utils.parseUnits('10000', 18);
var amount1 = ethers.utils.parseUnits('10000', 18);

console.log("Started");
var deployer = await hreEthers.getSigner();

var token0 = new ethers.Contract(token0Address, ERC20_ABI, deployer);
var token1 = new ethers.Contract(token1Address, ERC20_ABI, deployer);

console.log("Minting");
await token0.mint(amount0);
await token1.mint(amount1);

console.log("End");


}

main().catch(console.log);