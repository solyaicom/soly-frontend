import React, { useEffect } from "react";
import { useDelegatedActions, usePrivy } from "@privy-io/react-auth";
import { useFundWallet, useSolanaWallets } from "@privy-io/react-auth/solana";

export default function () {
    const { user } = usePrivy();
    const { exportWallet, ready, wallets } = useSolanaWallets();
    const { delegateWallet, revokeWallets } = useDelegatedActions();
    const { fundWallet } = useFundWallet();

    useEffect(() => {
        window.postMessage(
            {
                origin: "privy",
                type: "user",
                data: user,
            },
            "*"
        );
    }, [user]);

    function onExportWallet() {
        console.log("export", wallets);

        if (wallets?.length > 0) {
            exportWallet({ address: user?.wallet?.address || "" });
        }
    }

    useEffect(() => {
        window.addEventListener("message", (event) => {
            if (event.data.origin === "request_privy") {
                if (event.data.method === "export") {
                    onExportWallet();
                }
                if (event.data.method === "delegate") {
                    delegateWallet({ address: user?.wallet?.address || "", chainType: "solana" });
                }
                if (event.data.method === "revoke_delegate") {
                    revokeWallets();
                }
                if (event.data.method === "deposit") {
                    fundWallet(user?.wallet?.address || "");
                }
            }
        });
        return () => {
            window.removeEventListener("message", (event) => {});
        };
    }, [ready, user]);

    return null;
}
