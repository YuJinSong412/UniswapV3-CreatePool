/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */
/* eslint-disable no-var */
/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
const { Route,SwapQuoter, encodeSqrtRatioX96, nearestUsableTick, NonfungiblePositionManager, Position, Pool } = require("@uniswap/v3-sdk");
const { ethers } = require("ethers");
const { ethers: hreEthers } = require("hardhat");
const { UNISWAP_FACTOR_ABI, UNISWAP_V3_POOL_ABI } = require("./abi.js");
const { Percent, Token, CurrencyAmount, TradeType } = require("@uniswap/sdk-core");
const ERC20_ABI = require("../artifacts/contracts/Token.sol/Token.json").abi;

// const {fromReadableAmount} = require('./utils.js');



async function main(){
    poolAdd = "0x7526003337671fcA0c726919c5Ba77eABfA67F62";
    var deployer = await hreEthers.getSigner();
    var chainId = 11155111;
    var token0Decimals = 18;

    const poolContract = new ethers.Contract(poolAdd, UNISWAP_V3_POOL_ABI, deployer);
    var state = await getPoolState(poolContract);


    var token0Address = "0xb04F915966301a484C684dC4728C46dbdcA8A829";
    var token1Address = "0xf30f1c5A27622645CF46b5a6ABc4AB3a2Bf84235";
    const token0 = await getContract(token0Address, ERC20_ABI);
    const token1 = await getContract(token1Address, ERC20_ABI);


    const Token1 = new Token(chainId, token0.address, token0Decimals);
    const Token2 = new Token(chainId, token1.address, token0Decimals);

    const configuredPool = new Pool(
        Token1,
        Token2,
        fee,
        state.sqrtPriceX96.toString(),
        state.liquidity.toString(),
        state.tick
    );

    const swapRoute = new Route(
        configuredPool,
        Token1,
        Token2
    )

    const amountOut = await getOutputQuote(swapRoute);

    const {calldata} = await SwapQuoter.quoteCallParameters(
        swapRoute,
        CurrencyAmount.fromRawAmount(
            Token1,
            ethers.utils.parseUnits('10000', 18)
        ),
        TradeType.EXACT_INPUT,
        {
            useQuoterV2: false,
        }
    )

}


