"use client";

import SigninForm from "@/components/login/SigninForm";
import { PageContextProvider } from "./context/pageToShow";
import { useTokenContext } from "./context/tokenContext";


export default function Home() {
    const { isValid } = useTokenContext();

    return (
        <main className="h-screen w-screen">
            <PageContextProvider>

                {!isValid && <SigninForm/>}
            </PageContextProvider>
        </main>
    );
}
