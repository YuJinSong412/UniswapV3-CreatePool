const ERC20_ABI = require("../artifacts/contracts/Token.sol/Token.json").abi;
const { encodeSqrtRatioX96, nearestUsableTick, NonfungiblePositionManager, Position, Pool } = require("@uniswap/v3-sdk");
const { ethers } = require("ethers");
const { ethers: hreEthers } = require("hardhat");
const { UNISWAP_FACTOR_ABI, UNISWAP_V3_POOL_ABI, UNISWAP_V3_QUOTER_ABI, UNISWAP_V3_SWAP_ABI } = require("./abi.js");
const { Percent, Token } = require("@uniswap/sdk-core");

const SWAP_ROUTER_CONTRACT_ADDRESS = '0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E';
const QUOTER_CONTRACT_ADDRESS = '0xEd1f6473345F45b75F8179591dd5bA1888cf2FB3';
var token0Address = "0xb04F915966301a484C684dC4728C46dbdcA8A829";
var token1Address = "0xf30f1c5A27622645CF46b5a6ABc4AB3a2Bf84235";

async function approveToken(tokenAddress, tokenABI, amount, wallet){
    try{
        const tokenContract = new ethers.Contract(tokenAddress, tokenABI, wallet);
        
        console.log("approving");
        await tokenContract.approve(SWAP_ROUTER_CONTRACT_ADDRESS, amount);
        console.log("approving End");

    }catch(error){
        console.error("An error occurred during token approval:", error);
        throw new Error("Token approval failed");
    }

}

async function prepareSwapParams(poolContract, signer, amountIn, amountOut){

    return{
        tokenIn: token0Address,
        tokenOut: token1Address,
        fee: await poolContract.fee(),
        recipient: deployer.address,
        amountIn: amountIn,
        amountOutMinimum: amountOut,
        sqrtPriceLimitX96: 0,
    };

}

async function executeSwap(swapRouter, params, signer){
    const transaction = await swapRouter.exactInputSingle(params);
    const receipt = await signer.sendTransaction(transaction);
    console.log(`-------------------------------`)
    console.log(`Receipt: https://sepolia.etherscan.io/tx/${receipt.hash}`);
    console.log(`-------------------------------`)
}

async function main(){
    const amountIn = ethers.utils.parseUnits('100', 18);
    var deployer = await hreEthers.getSigner();

    try{
        console.log("approveToken!!!")
        await approveToken(token0Address, ERC20_ABI, amountIn, deployer);
        console.log(`-------------------------------`)

        console.log(`poolContract!!!`)
        const poolAddress = "0x7526003337671fcA0c726919c5Ba77eABfA67F62";
        // var deployer = await hreEthers.getSigner();
        const poolContract = new ethers.Contract(poolAddress, UNISWAP_V3_POOL_ABI, deployer);
        var token0 = new ethers.Contract(token0Address, ERC20_ABI, deployer);
        var token1 = new ethers.Contract(token1Address, ERC20_ABI, deployer);
        var fee = (0.3) * 10000;
        
        console.log(`-------------------------------`)
        // console.log(`Fetching Quote for: ${token0.symbol} to ${token1.symbol}`);
        console.log(`-------------------------------`)
        console.log(`Swap Amount: ${ethers.utils.formatUnits(amountIn)}`);

        console.log(`-------------------------------`)
        console.log(`quoteAndLogSwap`)
        const slot = await poolContract.slot0();
        const quoterContract = new ethers.Contract(QUOTER_CONTRACT_ADDRESS, UNISWAP_V3_QUOTER_ABI, deployer)
        const quotedAmountOut = await quoterContract.quoteExactInputSingle.staticCall({
            tokenIn: token0Address,
            tokenOut: token1Address,
            fee: fee,
            recipient: deployer.address,
            deadline: Math.floor(new Date().getTime() / 1000 + 60 * 10),
            amountIn: amountIn,
            sqrtPriceLimitX96: slot[0],
        });
        console.log(`-------------------------------`);
        console.log(`Token Swap will result in: ${ethers.utils.parseUnits(quotedAmountOut[0], 18)}`);

        console.log(`-------------------------------`);
        const params = await prepareSwapParams(poolContract, deployer, amountIn, quotedAmountOut[0].toString());
        
        
        const swapRouter = new ethers.Contract(SWAP_ROUTER_CONTRACT_ADDRESS, UNISWAP_V3_SWAP_ABI, deployer);
        await executeSwap(swapRouter, params, deployer);

    }catch(error){
        console.error("An error occurred:", error.message);
    }

}

main().catch(console.log)

