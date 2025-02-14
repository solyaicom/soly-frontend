import React, { useEffect } from "react";
import { useSolanaWallets } from "@privy-io/react-auth/solana";
import { useLogin, LoginModal, usePrivy, useDelegatedActions } from "@privy-io/react-auth";
import { useFundWallet, useSolanaFundingPlugin } from "@privy-io/react-auth/solana";

export default function ({ onSuccess, onError }: { onSuccess: () => void; onError: (error?: any) => void }) {
    const { user } = usePrivy();

    const { fundWallet } = useFundWallet();
    useEffect(() => {
        onFund();
    }, []);

    async function onFund() {
        if (!user?.wallet) {
            return onError("No wallet connected");
        }
        try {
            await fundWallet(user.wallet.address);
            onSuccess();
        } catch (error) {
            console.log("erorr", error);
            onError(error);
        }
    }

    return null;
}
