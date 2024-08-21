"use client";

import { Saira, Saira_Stencil_One } from "next/font/google";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import "./globals.css";
import UserNavBar from "@/components/header/UserNavBar";
import AdminNavBar from "@/components/header/AdminNavBar";

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
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const cookies = parseCookies();
        const token = cookies.token;

        if (token) {
            fetch("/api/tokenVerify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.isValid) {
                        setIsLoggedIn(true);
                        setRole(data.role);
                    } else {
                        setIsLoggedIn(false);
                    }
                })
                .catch((err) => {
                    console.error("Error verifying token:", err);
                    setIsLoggedIn(false);
                });
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    return (
        <html className={`${sairaStencil.variable} ${saira.variable}`}>
            <body>
                {isLoggedIn && (
                    <>
                        {role === "admin" && <AdminNavBar />}
                        {role === "client" && <UserNavBar />}
                    </>
                )}
                {children}
            </body>
        </html>
    );
}
