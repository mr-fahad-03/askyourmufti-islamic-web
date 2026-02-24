import type { Locale } from "@/lib/i18n";

type TopicLabelMap = Record<Locale, string>;

const TOPIC_LABELS: Record<string, TopicLabelMap> = {
    "salah-worship": {
        en: "Salah & Worship",
        ur: "\u0646\u0645\u0627\u0632 \u0627\u0648\u0631 \u0639\u0628\u0627\u062f\u0627\u062a",
        de: "Gebet und Anbetung",
        fr: "Priere et adoration",
        es: "Salah y adoracion",
    },
    "zakat-finance": {
        en: "Zakat & Finance",
        ur: "\u0632\u06a9\u0648\u0670\u0629 \u0627\u0648\u0631 \u0645\u0627\u0644\u06cc\u0627\u062a",
        de: "Zakat und Finanzen",
        fr: "Zakat et finance",
        es: "Zakat y finanzas",
    },
    "business-halal-income": {
        en: "Business & Halal Income",
        ur: "\u06a9\u0627\u0631\u0648\u0628\u0627\u0631 \u0627\u0648\u0631 \u062d\u0644\u0627\u0644 \u0622\u0645\u062f\u0646",
        de: "Geschaft und Halal-Einkommen",
        fr: "Business et revenus halal",
        es: "Negocios e ingresos halal",
    },
    "marriage-family": {
        en: "Marriage & Family",
        ur: "\u0646\u06a9\u0627\u062d \u0627\u0648\u0631 \u062e\u0627\u0646\u062f\u0627\u0646",
        de: "Ehe und Familie",
        fr: "Mariage et famille",
        es: "Matrimonio y familia",
    },
    "women-hijab": {
        en: "Women & Hijab",
        ur: "\u062e\u0648\u0627\u062a\u06cc\u0646 \u0627\u0648\u0631 \u062d\u062c\u0627\u0628",
        de: "Frauen und Hijab",
        fr: "Femmes et hijab",
        es: "Mujeres e hiyab",
    },
    "gambling-sports": {
        en: "Gambling & Sports",
        ur: "\u062c\u0648\u0627 \u0627\u0648\u0631 \u06a9\u06be\u06cc\u0644",
        de: "Glucksspiel und Sport",
        fr: "Jeux d'argent et sport",
        es: "Juegos de azar y deportes",
    },
    "education-social-issues": {
        en: "Education & Social Issues",
        ur: "\u062a\u0639\u0644\u06cc\u0645 \u0627\u0648\u0631 \u0633\u0645\u0627\u062c\u06cc \u0645\u0633\u0627\u0626\u0644",
        de: "Bildung und soziale Themen",
        fr: "Education et questions sociales",
        es: "Educacion y temas sociales",
    },
    "social-issues": {
        en: "Social Issues",
        ur: "\u0633\u0645\u0627\u062c\u06cc \u0645\u0633\u0627\u0626\u0644",
        de: "Soziale Themen",
        fr: "Questions sociales",
        es: "Temas sociales",
    },
    "trade-contracts": {
        en: "Trade & Contracts",
        ur: "\u062a\u062c\u0627\u0631\u062a \u0627\u0648\u0631 \u0645\u0639\u0627\u06c1\u062f\u0627\u062a",
        de: "Handel und Vertrage",
        fr: "Commerce et contrats",
        es: "Comercio y contratos",
    },
    "islamic-law-contracts": {
        en: "Islamic Law & Contracts",
        ur: "\u0627\u0633\u0644\u0627\u0645\u06cc \u0642\u0627\u0646\u0648\u0646 \u0627\u0648\u0631 \u0645\u0639\u0627\u06c1\u062f\u0627\u062a",
        de: "Islamisches Recht und Vertrage",
        fr: "Droit islamique et contrats",
        es: "Ley islamica y contratos",
    },
    finance: {
        en: "Finance",
        ur: "\u0645\u0627\u0644\u06cc\u0627\u062a",
        de: "Finanzen",
        fr: "Finance",
        es: "Finanzas",
    },
    business: {
        en: "Business",
        ur: "\u06a9\u0627\u0631\u0648\u0628\u0627\u0631",
        de: "Geschaft",
        fr: "Business",
        es: "Negocios",
    },
    marriage: {
        en: "Marriage",
        ur: "\u0646\u06a9\u0627\u062d",
        de: "Ehe",
        fr: "Mariage",
        es: "Matrimonio",
    },
    women: {
        en: "Women",
        ur: "\u062e\u0648\u0627\u062a\u06cc\u0646",
        de: "Frauen",
        fr: "Femmes",
        es: "Mujeres",
    },
    zakat: {
        en: "Zakat",
        ur: "\u0632\u06a9\u0648\u0670\u0629",
        de: "Zakat",
        fr: "Zakat",
        es: "Zakat",
    },
    salah: {
        en: "Salah",
        ur: "\u0646\u0645\u0627\u0632",
        de: "Salah",
        fr: "Salah",
        es: "Salah",
    },
};

const TOPIC_ALIASES: Record<string, string> = {
    "salah and worship": "salah-worship",
    "salah & worship": "salah-worship",
    "zakat and finance": "zakat-finance",
    "zakat & finance": "zakat-finance",
    "business and halal income": "business-halal-income",
    "business & halal income": "business-halal-income",
    "marriage and family": "marriage-family",
    "marriage & family": "marriage-family",
    "women and hijab": "women-hijab",
    "women & hijab": "women-hijab",
    "gambling and sports": "gambling-sports",
    "gambling & sports": "gambling-sports",
    "social issues": "social-issues",
    "education and social issues": "education-social-issues",
    "education & social issues": "education-social-issues",
    "trade and contracts": "trade-contracts",
    "trade & contracts": "trade-contracts",
    "islamic law and contracts": "islamic-law-contracts",
    "islamic law & contracts": "islamic-law-contracts",
};

function normalize(input: string): string {
    return input
        .toLowerCase()
        .trim()
        .replace(/&/g, " and ")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, " ")
        .replace(/-/g, " ");
}

function toSlug(input: string): string {
    return normalize(input).replace(/\s+/g, "-");
}

function resolveTopicKey(input: string): string | null {
    const normalized = normalize(input);
    const fromAlias = TOPIC_ALIASES[normalized];
    if (fromAlias) return fromAlias;

    const asSlug = toSlug(input);
    if (TOPIC_LABELS[asSlug]) return asSlug;

    return null;
}

export function translateTopicLabel(label: string, locale: Locale): string {
    const key = resolveTopicKey(label);
    if (!key) return label;
    const labels = TOPIC_LABELS[key];
    return labels?.[locale] || labels?.en || label;
}
