import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

const playfair = Playfair_Display({
    variable: "--font-playfair",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Archive.TM - Digital Library of Knowledge",
    description: "Preserving the teachings of Mufti Tariq Masood",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookieStore = await cookies();
    const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;
    const locale = isLocale(localeCookie) ? localeCookie : DEFAULT_LOCALE;
    const dir = locale === "ur" ? "rtl" : "ltr";

    return (
        <html lang={locale} dir={dir}>
            <body
                className={`${inter.variable} ${playfair.variable} antialiased`}
            >
                {children}
            </body>
        </html>
    );
}
