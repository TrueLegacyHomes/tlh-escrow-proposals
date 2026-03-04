import { jsPDF } from 'jspdf';
import type { ProposalSet } from '../types';
import { OAKWOOD_LOGO_BASE64 } from './logo-data';
import {
  OAKWOOD,
  OAKWOOD_OFFICER,
  OAKWOOD_FONT,
  pdfCurrency,
  pdfDate,
  drawDetailRow,
  drawFeeRow,
} from './shared';

/**
 * Generate the Oakwood Escrow fee proposal PDF.
 *
 * Brand: Oakwood Escrow (A Division of Lawyers Title Company)
 * Font: Helvetica (clean sans-serif)
 * Colors: Gold (#af9c6e), Charcoal (#2c2c2c), Cream (#f8f7f4)
 * Logo: Oakwood metro logo (base64 PNG)
 *
 * This PDF should look like Oakwood generated it — not TLH.
 */
export function generateOakwoodPDF(proposal: ProposalSet): jsPDF {
  const { transaction, oakwood } = proposal;
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 60;
  const contentWidth = pageWidth - margin * 2;
  const font = OAKWOOD_FONT;

  const { gold, charcoal, cream, textGray, white } = OAKWOOD;

  let y = 0;

  // === HEADER BAR (charcoal with gold accent) ===
  doc.setFillColor(charcoal[0], charcoal[1], charcoal[2]);
  doc.rect(0, 0, pageWidth, 110, 'F');

  // Gold accent line
  doc.setFillColor(gold[0], gold[1], gold[2]);
  doc.rect(0, 110, pageWidth, 4, 'F');

  // Logo (left side)
  try {
    doc.addImage(OAKWOOD_LOGO_BASE64, 'PNG', margin, 15, 110, 72);
  } catch (err) {
    console.warn('Oakwood logo failed to embed:', err);
  }

  // Company info (right side)
  const headerRight = pageWidth - margin;
  doc.setFont(font, 'normal');
  doc.setFontSize(9);
  doc.setTextColor(white[0], white[1], white[2]);
  doc.text(OAKWOOD_OFFICER.office, headerRight, 35, { align: 'right' });
  doc.text(OAKWOOD_OFFICER.city, headerRight, 48, { align: 'right' });
  doc.text(`Phone: ${OAKWOOD_OFFICER.companyPhone}`, headerRight, 65, { align: 'right' });
  doc.text(`Fax: ${OAKWOOD_OFFICER.companyFax}`, headerRight, 78, { align: 'right' });
  doc.setFontSize(8);
  doc.setTextColor(gold[0], gold[1], gold[2]);
  doc.text(OAKWOOD_OFFICER.license, headerRight, 95, { align: 'right' });

  y = 140;

  // === TITLE + DATE ===
  doc.setFont(font, 'bold');
  doc.setFontSize(22);
  doc.setTextColor(charcoal[0], charcoal[1], charcoal[2]);
  doc.text('Escrow Fee Proposal', margin, y);

  // Today's date (right-aligned)
  doc.setFont(font, 'normal');
  doc.setFontSize(10);
  doc.setTextColor(textGray[0], textGray[1], textGray[2]);
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  doc.text(today, pageWidth - margin, y, { align: 'right' });

  y += 8;
  doc.setFillColor(gold[0], gold[1], gold[2]);
  doc.rect(margin, y, 80, 3, 'F');
  y += 24;

  // === TRANSACTION DETAILS ===
  doc.setFillColor(charcoal[0], charcoal[1], charcoal[2]);
  doc.rect(margin, y, contentWidth, 28, 'F');
  doc.setFont(font, 'bold');
  doc.setFontSize(11);
  doc.setTextColor(white[0], white[1], white[2]);
  doc.text('TRANSACTION DETAILS', margin + 14, y + 18);
  y += 28;

  const detailColors = {
    altBg: cream,
    whiteBg: white,
    labelColor: textGray,
    valueColor: charcoal,
  };

  const details: [string, string][] = [
    ['Property Address', transaction.propertyAddress],
    ['Purchase Price', pdfCurrency(transaction.purchasePrice)],
    ['Estimated Close of Escrow', pdfDate(transaction.estimatedCOE)],
    ['Agent', transaction.agentName],
    ['Agent Phone', transaction.agentPhone],
  ];

  details.forEach(([label, value], i) => {
    drawDetailRow(doc, label, value, margin, y, contentWidth, 24, i % 2 === 0, detailColors, font);
    y += 24;
  });

  // Gold bottom border
  doc.setFillColor(gold[0], gold[1], gold[2]);
  doc.rect(margin, y, contentWidth, 2, 'F');
  y += 24;

  // === ESCROW FEE SCHEDULE ===
  doc.setFillColor(charcoal[0], charcoal[1], charcoal[2]);
  doc.rect(margin, y, contentWidth, 28, 'F');
  doc.setFont(font, 'bold');
  doc.setFontSize(11);
  doc.setTextColor(white[0], white[1], white[2]);
  doc.text('ESCROW FEE SCHEDULE', margin + 14, y + 18);
  y += 28;

  // Column headers (gold bar)
  doc.setFillColor(gold[0], gold[1], gold[2]);
  doc.rect(margin, y, contentWidth, 26, 'F');
  doc.setFont(font, 'bold');
  doc.setFontSize(9);
  doc.setTextColor(white[0], white[1], white[2]);
  doc.text('DESCRIPTION', margin + 14, y + 17);
  doc.text('AMOUNT', pageWidth - margin - 14, y + 17, { align: 'right' });
  y += 26;

  const feeColors = {
    altBg: cream,
    whiteBg: white,
    textColor: charcoal,
  };

  // Seller Fee
  drawFeeRow(
    doc, 'Seller Escrow Fee', pdfCurrency(oakwood.sellerFee),
    margin, y, contentWidth, 26, true, true, feeColors, font,
  );
  y += 26;

  // Buyer Fee
  drawFeeRow(
    doc, 'Buyer Escrow Fee', pdfCurrency(oakwood.buyerFee),
    margin, y, contentWidth, 26, false, true, feeColors, font,
  );
  y += 26;

  // Gold border
  doc.setFillColor(gold[0], gold[1], gold[2]);
  doc.rect(margin, y, contentWidth, 2, 'F');
  y += 6;

  // Total bar (charcoal with gold amount)
  doc.setFillColor(charcoal[0], charcoal[1], charcoal[2]);
  doc.rect(margin, y, contentWidth, 36, 'F');
  doc.setFont(font, 'bold');
  doc.setFontSize(12);
  doc.setTextColor(white[0], white[1], white[2]);
  doc.text('TOTAL ESCROW FEES', margin + 14, y + 23);
  doc.setTextColor(gold[0], gold[1], gold[2]);
  doc.setFontSize(14);
  doc.text(pdfCurrency(oakwood.totalFees), pageWidth - margin - 14, y + 23, { align: 'right' });
  y += 36;

  // === ESCROW OFFICER ===
  y += 20;
  doc.setFont(font, 'bold');
  doc.setFontSize(10);
  doc.setTextColor(charcoal[0], charcoal[1], charcoal[2]);
  doc.text('Your Escrow Officer:', margin, y);
  y += 16;
  doc.setFont(font, 'normal');
  doc.setFontSize(10);
  doc.text(OAKWOOD_OFFICER.name, margin, y);
  y += 14;
  doc.setTextColor(textGray[0], textGray[1], textGray[2]);
  doc.text(`${OAKWOOD_OFFICER.phone}  |  ${OAKWOOD_OFFICER.email}`, margin, y);
  y += 30;

  // === DISCLAIMER ===
  doc.setFont(font, 'normal');
  doc.setFontSize(8);
  doc.setTextColor(textGray[0], textGray[1], textGray[2]);
  const disclaimerText =
    'Estimate only — doc fees, wire fees, messenger fees, archive fees and loan tie-in fees may apply. ' +
    'Oakwood Escrow Inc. is a licensed, independent escrow company. We are not affiliated with any ' +
    'broker, lender, or agent. We serve as a neutral third party in all transactions.';
  doc.text(disclaimerText, margin, y, { maxWidth: contentWidth });
  y += 36;

  // === BOTTOM BAR ===
  doc.setFillColor(charcoal[0], charcoal[1], charcoal[2]);
  doc.rect(0, pageHeight - 40, pageWidth, 40, 'F');
  doc.setFillColor(gold[0], gold[1], gold[2]);
  doc.rect(0, pageHeight - 40, pageWidth, 3, 'F');

  doc.setFont(font, 'normal');
  doc.setFontSize(8);
  doc.setTextColor(gold[0], gold[1], gold[2]);
  doc.text('PROTECTION  \u2022  TRUST  \u2022  NEUTRALITY', pageWidth / 2, pageHeight - 20, {
    align: 'center',
  });
  doc.setTextColor(180, 180, 180);
  doc.text('www.oakwoodescrow.com', pageWidth / 2, pageHeight - 10, { align: 'center' });

  return doc;
}
