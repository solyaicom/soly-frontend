import React, { useEffect } from "react";
import { useSolanaWallets } from "@privy-io/react-auth/solana";
import { useLogin, LoginModal, usePrivy, useDelegatedActions, useIdentityToken } from "@privy-io/react-auth";

export default function ({ children, onSuccess }: { children: React.ReactNode; onSuccess: (id_token: string) => void }) {
    const { user, login, logout } = usePrivy();
    const { identityToken } = useIdentityToken();

    useEffect(() => {
        if (identityToken && user) {
            localStorage.setItem("privy_address", user.wallet?.address || "");
            onSuccess(identityToken);
        }
    }, [identityToken, user]);

    async function onClick() {
        if (user) {
            await logout();
        }
        return login();
    }
    return (
        <button
            onClick={onClick}
            class={
                "flex items-center justify-center bg-[#fff] py-[12px] text-[16px] text-[#131313] font-[600] rounded-[16px] border-[1px] border-[#ffffff1a]"
            }
            style={{ width: "100%", marginTop: "16px" }}
        >
            Login
        </button>
    );
}
