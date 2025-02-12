import React, { useEffect } from "react";
import { useSolanaWallets } from "@privy-io/react-auth/solana";
import { useLogin, LoginModal, usePrivy, useDelegatedActions, useIdentityToken } from "@privy-io/react-auth";

export default function ({ children, onSuccess, onError }: { children: React.ReactNode; onSuccess: () => void; onError: (error?: any) => void }) {
    const { user } = usePrivy();
    const { delegateWallet, revokeWallets } = useDelegatedActions();

    useEffect(() => {
        onDelegate();
    }, []);

    async function onDelegate() {
        if (!user?.wallet) {
            return onError("No wallet connected");
        }
        try {
            await delegateWallet({ address: user.wallet.address, chainType: "solana" });
            onSuccess();
        } catch (error) {
            onError(error);
        }
    }

    return null;
}
