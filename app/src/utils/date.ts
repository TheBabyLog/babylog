import { t, getCurrentLanguage } from "~/src/utils/translate";

export const getRelativeTime = (date: Date) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const eventDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const diffInMs = today.getTime() - eventDate.getTime();
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  if (diffInDays === 0) {
    return t("global.time.today");
  }
  if (diffInDays === 1) {
    return t("global.time.yesterday");
  }
  if (diffInDays < 7) {
    return t("global.time.daysAgo", { count: diffInDays });
  }
  if (diffInDays < 14) {
    return t("global.time.lastWeek");
  }

  const lang = getCurrentLanguage();
  if (lang === "es") {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  }

  return date.toLocaleDateString();
}; 