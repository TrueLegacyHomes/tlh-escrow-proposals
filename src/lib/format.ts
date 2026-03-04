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
 * Extract street number + street name from a full address and return a
 * filename-safe string like "1234_Main".
 *
 * Strips city/state/zip, replaces spaces with underscores, and truncates
 * to a reasonable length.
 */
export function parseAddressForFilename(address: string): string {
  if (!address) return 'proposal';

  // Take only the street portion (before the first comma)
  const streetPart = address.split(',')[0].trim();

  // Extract street number and first word of street name
  const parts = streetPart.split(/\s+/);
  if (parts.length === 0) return 'proposal';

  // Take at most the number + street name (first two meaningful words)
  const meaningful = parts.slice(0, 2);
  const slug = meaningful.join('_').replace(/[^a-zA-Z0-9_]/g, '');

  return slug || 'proposal';
}
