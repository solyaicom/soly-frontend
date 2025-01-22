import { PublicKey } from "@solana/web3.js";
import DLMM, { StrategyType } from "@meteora-ag/dlmm";
export async function getPoolBin({
  poolAddress,
  min,
  max,
  decimalX,
  decimalY,
}: {
  poolAddress: string;
  min: number;
  max: number;
  decimalX: number;
  decimalY: number;
}) {
  try {
    const poolPublicKey = new PublicKey(poolAddress);
    const dlmmPool = await DLMM.create(connection, poolPublicKey);
    const minPerLamport = DLMM.getPricePerLamport(decimalX, decimalY, min);
    const maxPerLamport = DLMM.getPricePerLamport(decimalX, decimalY, max);
    const { bins } = await dlmmPool.getBinsBetweenMinAndMaxPrice(Number(minPerLamport), Number(maxPerLamport));
    const res = await dlmmPool.quoteCreatePosition({
      strategy: {
        strategyType: StrategyType.SpotBalanced,
        minBinId: bins[0]?.binId,
        maxBinId: bins[bins.length - 1]?.binId,
      },
    });

    return {
      binLength: bins.length,
      cost: res,
    };
  } catch (error) {
    console.log("get pool bin", error);
    return {
      binLength: 0,
    };
  }
}

export async function getQuotePosition() {}
