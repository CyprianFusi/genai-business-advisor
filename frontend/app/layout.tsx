import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "GenAI Business Advisor",
    description: "Discover how Generative AI can transform your business — powered by CrewAI multi-agent systems.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                {/* Toaster must be present for react-hot-toast notifications to render */}
                <Toaster position="top-right" />
                <Header />
                {children}
            </body>
        </html>
    );
}