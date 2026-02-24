import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactCompiler: true,
    async redirects() {
        return [
            {
                source: "/",
                destination: "/en",
                permanent: false,
            },
        ];
    },
    async rewrites() {
        return [
            {
                source: "/:locale(en|ur|de|fr|es)",
                destination: "/",
            },
            {
                source: "/:locale(en|ur|de|fr|es)/:path*",
                destination: "/:path*",
            },
        ];
    },
};

export default nextConfig;
