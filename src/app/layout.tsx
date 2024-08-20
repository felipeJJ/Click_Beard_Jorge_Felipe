import { Saira, Saira_Stencil_One } from "next/font/google";
import "./globals.css";

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
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html className={`${sairaStencil.variable} ${saira.variable}`}>
            <body>{children}</body>
        </html>
    );
}
