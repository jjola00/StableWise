import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Add helper to convert country code (e.g. "US") to its corresponding emoji flag.
export function countryToFlag(country: string): string {
  if (!country) return "";
  let code = country.trim();
  // If a full country name is supplied, fall back to using its first two letters.
  if (code.length !== 2) {
    code = code.slice(0, 2);
  }
  code = code.toUpperCase();
  if (code.length !== 2) return "";
  // Convert ASCII letters to regional indicator symbols.
  return String.fromCodePoint(
    0x1f1e6 - 65 + code.charCodeAt(0),
    0x1f1e6 - 65 + code.charCodeAt(1)
  );
}
