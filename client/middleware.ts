import { NextRequest, NextResponse } from "next/server";

const PUBLIC_FILE = /\.[^/]+$/;
const SUPPORTED_LOCALES = ["en", "ur", "de", "fr", "es"] as const;
const DEFAULT_LOCALE = "en";

function isLocale(value: string | undefined | null): value is (typeof SUPPORTED_LOCALES)[number] {
    return !!value && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

function stripLocaleFromPathname(pathname: string): string {
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length === 0) return "/";
    if (isLocale(parts[0])) {
        const rest = parts.slice(1);
        return rest.length ? `/${rest.join("/")}` : "/";
    }
    return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

function withLocale(pathname: string, locale: (typeof SUPPORTED_LOCALES)[number]): string {
    if (!pathname || pathname === "/") return `/${locale}`;
    const clean = stripLocaleFromPathname(pathname);
    return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

export function middleware(request: NextRequest) {
    try {
        const { pathname, search } = request.nextUrl;

        if (
            pathname.startsWith("/api") ||
            pathname.startsWith("/_next") ||
            pathname.startsWith("/_vercel") ||
            pathname.startsWith("/favicon.ico") ||
            PUBLIC_FILE.test(pathname)
        ) {
            return NextResponse.next();
        }

        const first = pathname.split("/").filter(Boolean)[0];

        if (isLocale(first)) {
            const response = NextResponse.next();
            response.cookies.set("NEXT_LOCALE", first, { path: "/", sameSite: "lax" });
            return response;
        }

        const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
        const locale = isLocale(cookieLocale) ? cookieLocale : DEFAULT_LOCALE;

        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = withLocale(pathname, locale);
        redirectUrl.search = search;
        return NextResponse.redirect(redirectUrl);
    } catch (error) {
        console.error("middleware error:", error);
        return NextResponse.next();
    }
}

export const config = {
    matcher: ["/:path*"],
};
