import React, { useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";

export default function () {
    const { user } = usePrivy();

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

    return null;
}
