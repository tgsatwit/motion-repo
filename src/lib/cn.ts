type ClassValue = string | false | null | undefined;

/** Join conditional class names. Deliberately tiny - no merge semantics. */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
