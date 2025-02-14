import React from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";
const solanaConnectors = toSolanaWalletConnectors({
    shouldAutoConnect: false,
});
export default function ({ children }: { children: React.ReactNode }) {
    return (
        <PrivyProvider
            appId={AppConfig.env.PRIVY_APP_ID}
            clientId={AppConfig.env.PRIVY_CLIENT_ID}
            config={{
                // Customize Privy's appearance in your app
                appearance: {
                    theme: "dark",
                    accentColor: "#676FFF",
                    logo: "/favicon.png",
                },
                loginMethods: ["email", "google"],
                externalWallets: {
                    solana: {
                        connectors: solanaConnectors,
                    },
                },
                // Create embedded wallets for users who don't have a wallet
                embeddedWallets: {
                    showWalletUIs: true,
                    solana: {
                        createOnLogin: "users-without-wallets",
                    },
                },
                solanaClusters: [
                    {
                        name: "mainnet-beta",
                        rpcUrl: "https://mainnet.helius-rpc.com/?api-key=c4d2bbb1-4ab8-4f88-bff2-f8863270aabd",
                    },
                ],
            }}
            children={children}
        />
    );
}
