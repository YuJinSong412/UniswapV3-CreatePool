const {Token, TradeType} = require('@uniswap/sdk-core')
const {Trade} = require('@uniswap/v3-sdk')
const { ethers } = require("ethers");

const MAX_DECIMALS = 4

export function fromReadableAmount(
  amount,
  decimals
){
  return ethers.utils.parseUnits(amount.toString(), decimals)
}

export function toReadableAmount(rawAmount, decimals) {
  return ethers.utils.formatUnits(rawAmount, decimals).slice(0, MAX_DECIMALS)
}

export function displayTrade(trade) {
  return `${trade.inputAmount.toExact()} ${
    trade.inputAmount.currency.symbol
  } for ${trade.outputAmount.toExact()} ${trade.outputAmount.currency.symbol}`
}