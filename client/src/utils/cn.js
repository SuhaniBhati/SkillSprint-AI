import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names conditionally and resolves Tailwind conflicts.
 * @param {...any} inputs - class values (strings, arrays, objects)
 * @returns {string}
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}