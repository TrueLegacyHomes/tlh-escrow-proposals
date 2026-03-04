import type { jsPDF } from 'jspdf';

/* ------------------------------------------------------------------ */
/* Brand fonts                                                         */
/* jsPDF built-in: helvetica (sans), times (serif), courier (mono)     */
/* ------------------------------------------------------------------ */

/** Oakwood uses clean sans-serif (helvetica) */
export const OAKWOOD_FONT = 'helvetica';

/** First American uses traditional serif (times) — matches their corporate docs */
export const FA_FONT = 'times';

/* ------------------------------------------------------------------ */
/* Color palettes                                                      */
/* ------------------------------------------------------------------ */

export const OAKWOOD = {
  gold: [175, 156, 110] as const,
  charcoal: [44, 44, 44] as const,
  cream: [248, 247, 244] as const,
  textGray: [100, 100, 100] as const,
  white: [255, 255, 255] as const,
};

export const FIRST_AM = {
  blue: [78, 173, 225] as const,
  navy: [20, 29, 58] as const,
  lightBlue: [235, 246, 252] as const,
  textGray: [100, 100, 100] as const,
  white: [255, 255, 255] as const,
};

/* ------------------------------------------------------------------ */
/* Officer contact info                                                */
/* ------------------------------------------------------------------ */

export const OAKWOOD_OFFICER = {
  name: 'Cathia Serpa',
  phone: '(619) 430-4592',
  email: 'TeamCathia@Oakwoodmetro.com',
  office: '2690 Via De La Valle, Suite D260',
  city: 'Del Mar, CA 92014',
  companyPhone: '(858) 324-1700',
  companyFax: '(858) 324-1707',
  license: 'DFPI License #96DBO-45861',
};

export const FA_OFFICER = {
  name: 'Steve Hlavacek',
  phone: '(858) 229-2162',
  email: 'shlavacek@firstam.com',
  office: '1455 Frazee Road, Suite 710',
  city: 'San Diego, CA 92108',
};

/* ------------------------------------------------------------------ */
/* Shared helpers                                                      */
/* ------------------------------------------------------------------ */

/**
 * Format number as USD currency for PDF display.
 * Always shows 2 decimal places for consistency in documents.
 */
export function pdfCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format an ISO date string for PDF display.
 */
export function pdfDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Draw a detail row with label + value in alternating background.
 * Font is brand-configurable.
 */
export function drawDetailRow(
  doc: jsPDF,
  label: string,
  value: string,
  x: number,
  y: number,
  width: number,
  rowHeight: number,
  isAlt: boolean,
  colors: {
    altBg: readonly [number, number, number];
    whiteBg: readonly [number, number, number];
    labelColor: readonly [number, number, number];
    valueColor: readonly [number, number, number];
  },
  font = 'helvetica',
): void {
  const bg = isAlt ? colors.altBg : colors.whiteBg;
  doc.setFillColor(bg[0], bg[1], bg[2]);
  doc.rect(x, y, width, rowHeight, 'F');

  doc.setFont(font, 'bold');
  doc.setFontSize(9);
  doc.setTextColor(colors.labelColor[0], colors.labelColor[1], colors.labelColor[2]);
  doc.text(label.toUpperCase(), x + 14, y + rowHeight * 0.65);

  doc.setFont(font, 'normal');
  doc.setFontSize(10);
  doc.setTextColor(colors.valueColor[0], colors.valueColor[1], colors.valueColor[2]);
  doc.text(value, x + 180, y + rowHeight * 0.65);
}

/**
 * Draw a fee row with description + amount, alternating background.
 * Font is brand-configurable.
 */
export function drawFeeRow(
  doc: jsPDF,
  description: string,
  amount: string,
  x: number,
  y: number,
  width: number,
  rowHeight: number,
  isAlt: boolean,
  isBold: boolean,
  colors: {
    altBg: readonly [number, number, number];
    whiteBg: readonly [number, number, number];
    textColor: readonly [number, number, number];
  },
  font = 'helvetica',
): void {
  const bg = isAlt ? colors.altBg : colors.whiteBg;
  doc.setFillColor(bg[0], bg[1], bg[2]);
  doc.rect(x, y, width, rowHeight, 'F');

  doc.setFont(font, isBold ? 'bold' : 'normal');
  doc.setFontSize(10);
  doc.setTextColor(colors.textColor[0], colors.textColor[1], colors.textColor[2]);
  doc.text(description, x + 14, y + rowHeight * 0.65);

  doc.setFont(font, isBold ? 'bold' : 'normal');
  doc.text(amount, x + width - 14, y + rowHeight * 0.65, { align: 'right' });
}
