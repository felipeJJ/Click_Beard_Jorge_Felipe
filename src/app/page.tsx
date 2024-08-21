"use client";

import SigninForm from "@/components/login/SigninForm";
import { useEffect, useState } from "react";
import { parseCookies } from "nookies";

export default function Home() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const cookies = parseCookies();
        const token = cookies.token;

        if (token) {
            setIsLoggedIn(true);
        }
        setLoading(false);
    },[]);

    if (loading) {
        return null;
    }

    return (
        <main className="h-screen w-screen">
            {!isLoggedIn && <SigninForm setIsLoggedIn={setIsLoggedIn} />}
        </main>
    );
}
