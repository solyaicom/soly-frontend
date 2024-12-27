import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { CONNECTION_CONFIG } from "~/constants/solana-connection";
import { getAccount, getAssociatedTokenAddress, getMint, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { searchWalletAssets } from "./helius-api";
import { transformToPortfolio, WalletPortfolio } from "./portfolio";

export const connection = new anchor.web3.Connection(CONNECTION_CONFIG.mainnet, {
  commitment: "confirmed",
  disableRetryOnRateLimit: true,
});

const TOKEN_SOLANA = {
  symbol: "SOL",
  decimals: 9,
  address: "So11111111111111111111111111111111111111112",
  name: "Solana",
  imageUrl: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
};

export async function getSolBalance(walletAddress: string) {
  try {
    const wallet = new PublicKey(walletAddress);
    const balance = await connection.getBalance(wallet);
    return balance / anchor.web3.LAMPORTS_PER_SOL;
  } catch {
    return 0;
  }
}

export async function getWalletPortfolio(walletAddress: string): Promise<WalletPortfolio> {
  try {
    const assets = await searchWalletAssets(walletAddress);

    const portfolio = transformToPortfolio(walletAddress, assets.fungibleTokens, []);

    // First, separate SOL from other tokens
    const solToken = portfolio.tokens.find((token) => token.symbol === "SOL");
    const otherTokens = portfolio.tokens
      .filter((token) => token.symbol !== "SOL")
      .filter((token) => token.usdPrice > 3)
      .sort((a, b) => b.usdPrice - a.usdPrice);

    // Combine SOL with other tokens, ensuring SOL is first
    portfolio.tokens = solToken ? [solToken, ...otherTokens] : otherTokens;

    return portfolio;
  } catch (error) {
    console.log("getAllTokenBalance error", error);
    return {
      tokens: [],
      totalBalance: 0,
      address: walletAddress,
      nfts: [],
    };
  }
}

export async function getTokenInfor(tokenMintAddress: string) {
  if (!tokenMintAddress) {
    return null;
  }
  if (tokenMintAddress === TOKEN_SOLANA.address) {
    return TOKEN_SOLANA;
  }
  const mintPublicKey = new PublicKey(tokenMintAddress);
  try {
    const tokenAccountInfo = await getMint(connection, mintPublicKey);
    console.log("tokenAccountInfo", tokenAccountInfo);
    return tokenAccountInfo;
  } catch (error) {
    console.log("getTokenInfor error", error);
    return null;
  }
}

export async function getTokenBalance(walletAddress: string, tokenMintAddress: string) {
  if (!tokenMintAddress || !walletAddress) {
    return 0;
  }
  const mintPublicKey = new PublicKey(tokenMintAddress);
  try {
    const wallet = new PublicKey(walletAddress);
    const associatedTokenAddress = await getAssociatedTokenAddress(mintPublicKey, wallet);
    const tokenAccountInfo = await getAccount(connection, associatedTokenAddress);
    return tokenAccountInfo.amount;
  } catch {
    return 0;
  }
}
