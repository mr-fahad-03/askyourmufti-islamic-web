import type { MetadataRoute } from "next";

const getSiteUrl = () => {
    const envUrl =
        process.env.NEXT_PUBLIC_SITE_URL ||
        process.env.SITE_URL ||
        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
    return (envUrl || "https://askyourmufti-islamic-web.vercel.app").replace(/\/+$/, "");
};

export default function robots(): MetadataRoute.Robots {
    const siteUrl = getSiteUrl();

    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/islamic-admin", "/api/", "/islamic-admin/*"],
            },
        ],
        sitemap: `${siteUrl}/sitemap.xml`,
        host: siteUrl,
    };
}
