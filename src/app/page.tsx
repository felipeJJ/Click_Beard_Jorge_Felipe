"use client";

import { useEffect, useState } from "react";
import SigninForm from "@/components/login/SigninForm";
import { usePageContext } from "./context/pageToShow";
import { useTokenContext } from "./context/tokenContext";
import BarbersForm from "@/components/barbersCreation/BarbersForm";

export default function Home() {
    const { isValid } = useTokenContext();
    const { barbers } = usePageContext();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center">
                <span className="loading loading-dots loading-sm"></span>
            </div>
        );
    }

    return (
        <main className="h-screen w-screen">
            {!isValid && <SigninForm />}
            {barbers && <BarbersForm />}
        </main>
    );
}
