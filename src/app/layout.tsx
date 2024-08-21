"use client";

import "./globals.css";
import { Saira, Saira_Stencil_One } from "next/font/google";
import { TokenContextProvider, useTokenContext } from "./context/tokenContext";
import NavBar from "@/components/header/NavBar";

const sairaStencil = Saira_Stencil_One({
    weight: ["400"],
    subsets: ["latin"],
    variable: "--font-saira-stencil",
});

const saira = Saira({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600"],
    variable: "--font-saira",
});

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html className={`${sairaStencil.variable} ${saira.variable}`}>
            <body>
                <TokenContextProvider>
                    <Content>{children}</Content>
                </TokenContextProvider>
            </body>
        </html>
    );
}

function Content({ children }: { children: React.ReactNode }) {
    const { role, isValid } = useTokenContext();

    return (
        <>
            {isValid && <NavBar />}
            {children}
        </>
    );
}
