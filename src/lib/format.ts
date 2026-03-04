/**
 * Format a number as USD currency.
 * Whole numbers display without decimals: "$1,234"
 * Fractional numbers display with two decimals: "$1,234.56"
 */
export function formatCurrency(amount: number): string {
  if (Number.isInteger(amount)) {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Convert an ISO date string (e.g. "2026-03-10") to a readable format
 * like "March 10, 2026".
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  // Parse as local date to avoid timezone offset issues
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Extract street name + number from a full address for use in filenames.
 *
 * "1234 Ocean View Dr, Del Mar, CA 92014"  →  { street: "Ocean View Dr", number: "1234" }
 *
 * Used to build filenames like: Escrow_Fee_Oakwood_Ocean View Dr_1234
 */
export function parseAddressForFilename(address: string): { street: string; number: string } {
  if (!address) return { street: 'Address', number: '' };

  // Take only the street portion (before the first comma)
  const streetPart = address.split(',')[0].trim();
  const parts = streetPart.split(/\s+/);
  if (parts.length === 0) return { street: 'Address', number: '' };

  // First token is the street number, rest is the street name
  const number = parts[0].replace(/[^a-zA-Z0-9]/g, '');
  const street = parts.slice(1).join(' ').replace(/[^a-zA-Z0-9 ]/g, '').trim();

  return { street: street || 'Address', number };
}
