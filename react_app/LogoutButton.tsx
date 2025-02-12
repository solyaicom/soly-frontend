import React, { useEffect } from "react";
import { usePrivy, useIdentityToken } from "@privy-io/react-auth";

export default function ({ children, onSuccess }: { children: React.ReactNode; onSuccess: (id_token: string) => void }) {
    const { user, logout, getAccessToken } = usePrivy();
    const { identityToken } = useIdentityToken();

    useEffect(() => {
        if (user)
            getAccessToken().then((v) => {
                console.log("user", user);
            });
    }, [user]);

    async function onClick() {
        if (user) {
            await logout();
            window.location.href = "/auth/login";
        }
    }
    return (
        <div class={"py-2 px-3 font-[500] cursor-pointer row-center hover:bg-[#232323]"} onClick={onClick}>
            <span class="flex-1 text-[red]">Logout</span>
        </div>
    );
}
