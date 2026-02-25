import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_LOCALE, isLocale, withLocale } from "./src/lib/i18n";

const PUBLIC_FILE = /\.[^/]+$/;

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
