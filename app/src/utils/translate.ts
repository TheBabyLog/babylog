import { en } from "../translations/en";
import { es } from "../translations/es";

type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

export type TranslationKey = NestedKeyOf<typeof en>;

const isBrowser = typeof window !== "undefined";

let currentLanguage = "en";
if (isBrowser) {
  currentLanguage = localStorage.getItem("language") || "en";
}

const translations: { [key: string]: typeof en } = {
  en,
  es,
};

export const getCurrentLanguage = () => currentLanguage;

export function t(
  key: string,
  params: Record<string, string | number> = {}
): string {
  if (!translations[currentLanguage]) {
    console.warn(
      `Translation language ${currentLanguage} not loaded, falling back to English`
    );
    currentLanguage = "en";
  }

  const keys = key.split(".");
  let translation = keys.reduce<unknown>(
    (obj, key) =>
      obj && typeof obj === "object"
        ? (obj as Record<string, unknown>)[key]
        : undefined,
    translations[currentLanguage]
  );

  if (typeof translation !== "string") {
    console.warn(`Translation missing for key: ${key}`);
    return key;
  }

  let value = translation;
  if (params) {
    Object.entries(params).forEach(([param, replacement]) => {
      value = value.replace(`{{${param}}}`, replacement.toString());
    });
  }

  return value;
}

export const setLanguage = (lang: string) => {
  if (translations[lang]) {
    currentLanguage = lang;
    if (isBrowser) {
      localStorage.setItem("language", lang);
    }
  } else {
    console.warn(`Language ${lang} not loaded`);
  }
};
