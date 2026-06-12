import { format } from "date-fns-jalali";

// Active setting for persian digits or english digits
let globalPersianDigits = true;

export function setGlobalPersianDigits(state: boolean) {
  globalPersianDigits = state;
}

export function getGlobalPersianDigits(): boolean {
  return globalPersianDigits;
}

/**
 * Converts English digits to Persian digits.
 */
export function toPersianDigits(val: string | number): string {
  const str = String(val);
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str.replace(/[0-9]/g, (w) => persianDigits[parseInt(w, 10)]);
}

/**
 * Converts Persian digits to English digits.
 */
export function toEnglishDigits(str: string): string {
  const map = {
    "۰": "0",
    "۱": "1",
    "۲": "2",
    "۳": "3",
    "۴": "4",
    "۵": "5",
    "۶": "6",
    "۷": "7",
    "۸": "8",
    "۹": "9",
  };
  return str.replace(/[۰-۹]/g, (w) => map[w as keyof typeof map] || w);
}

/**
 * Formats a number in Toman currency format with thousand separators.
 * Example: 1250000 -> "۱٬۲۵۰٬۰۰۰ تومان" (if usePersianDigits is true) or "1,250,000 تومان"
 */
export function formatToman(num: number, usePersianDigits = globalPersianDigits): string {
  const formatted = new Intl.NumberFormat("en-US").format(num);
  const priceString = usePersianDigits ? toPersianDigits(formatted) : formatted;
  return `${priceString} تومان`;
}

/**
 * Formats a date using Jalali calendar
 */
export function formatJalali(
  date: Date | string | number,
  pattern = "yyyy/MM/dd HH:mm",
  usePersianDigits = globalPersianDigits
): string {
  try {
    const d = typeof date === "string" ? new Date(date) : date;
    const formatted = format(d, pattern);
    return usePersianDigits ? toPersianDigits(formatted) : formatted;
  } catch (error) {
    console.error("Jalali formatting error", error);
    return String(date);
  }
}
