import React, { useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";

export default function () {
    const { user } = usePrivy();

    function onMessage(event: any) {
        console.log("event", event);
    }
    useEffect(() => {
        window.addEventListener("message", onMessage);
        return () => {
            window.removeEventListener("message", onMessage);
        };
    }, []);

    return null;
}
