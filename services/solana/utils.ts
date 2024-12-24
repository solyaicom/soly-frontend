import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { CONNECTION_CONFIG } from "~/constants/solana-connection";
import { getAccount, getAssociatedTokenAddress } from "@solana/spl-token";

export const connection = new anchor.web3.Connection(CONNECTION_CONFIG.mainnet, "confirmed");

export async function getSolBalance(pk: string) {
  try {
    const wallet = new PublicKey(pk);
    const balance = await connection.getBalance(wallet);
    return balance / anchor.web3.LAMPORTS_PER_SOL;
  } catch {
    return 0;
  }
}

export async function getTokenBalance(pk: PublicKey, tokenMintAddress: string) {
  if (!tokenMintAddress || !pk) {
    return 0;
  }
  const mintPublicKey = new PublicKey(tokenMintAddress);
  try {
    const associatedTokenAddress = await getAssociatedTokenAddress(mintPublicKey, pk);
    const tokenAccountInfo = await getAccount(connection, associatedTokenAddress);
    return tokenAccountInfo.amount;
  } catch {
    return 0;
  }
}
