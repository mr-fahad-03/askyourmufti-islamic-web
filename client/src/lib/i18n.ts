export const SUPPORTED_LOCALES = ["en", "ur", "de", "fr", "es"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export function isLocale(value: string | undefined | null): value is Locale {
    return !!value && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export function getLocaleFromPathname(pathname: string): Locale {
    const first = pathname.split("/").filter(Boolean)[0];
    if (isLocale(first)) return first;

    if (typeof document !== "undefined") {
        const cookie = document.cookie
            .split(";")
            .map((c) => c.trim())
            .find((c) => c.startsWith("NEXT_LOCALE="));
        const cookieLocale = cookie?.split("=")[1];
        if (isLocale(cookieLocale)) return cookieLocale;
    }

    return DEFAULT_LOCALE;
}

export function stripLocaleFromPathname(pathname: string): string {
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length === 0) return "/";
    if (isLocale(parts[0])) {
        const rest = parts.slice(1);
        return rest.length ? `/${rest.join("/")}` : "/";
    }
    return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

export function withLocale(pathname: string, locale: Locale): string {
    if (!pathname || pathname === "/") return `/${locale}`;
    if (pathname.startsWith("http://") || pathname.startsWith("https://")) return pathname;
    const clean = stripLocaleFromPathname(pathname);
    return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}
