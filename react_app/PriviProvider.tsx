import React from "react";
import { PrivyProvider } from "@privy-io/react-auth";

export default function ({ children }: { children: React.ReactNode }) {
    return (
        <PrivyProvider
            appId="cm6rkbf5p009epl31q2z9fivi"
            config={{
                // Customize Privy's appearance in your app
                appearance: {
                    theme: "dark",
                    accentColor: "#676FFF",
                    logo: "/favicon.png",
                },
                loginMethods: ["email", "google"],
                // Create embedded wallets for users who don't have a wallet
                embeddedWallets: {
                    showWalletUIs: true,
                    solana: {
                        createOnLogin: "users-without-wallets",
                    },
                },
            }}
            children={children}
        />
    );
}
