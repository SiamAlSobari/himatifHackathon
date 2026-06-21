/**
 * Helper to format any Indonesian phone number into the international format (e.g. 628xxx)
 * @param phone Raw phone number string from user input
 * @returns Formatted international phone number
 */
export function formatToIndonesianNumber(phone: string): string {
  // Strip all non-numeric characters except +
  let clean = phone.replace(/[^0-9+]/g, "");

  // Remove leading +
  if (clean.startsWith("+")) {
    clean = clean.slice(1);
  }

  // Convert leading 0 to 62
  if (clean.startsWith("0")) {
    clean = "62" + clean.slice(1);
  }

  // Convert leading 8 (e.g. 812xxxx) to 62812xxxx
  if (clean.startsWith("8")) {
    clean = "62" + clean;
  }

  return clean;
}
