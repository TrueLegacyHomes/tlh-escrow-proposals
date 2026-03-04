import { jsPDF } from 'jspdf';
import type { ProposalSet } from '../types';
import { FA_LOGO_BASE64 } from './logo-data';
import {
  FIRST_AM,
  FA_OFFICER,
  FA_FONT,
  pdfCurrency,
  pdfDate,
  drawDetailRow,
  drawFeeRow,
} from './shared';

/**
 * Generate the First American Title fee proposal PDF.
 *
 * Brand: First American Title Insurance Company — Title Insurance
 * Font: Times (traditional serif — matches FA's corporate documents)
 * Colors: Blue (#4eade1), Navy (#141d3a), Light Blue (#ebf6fc)
 * Logo: First American eagle with key (base64 PNG from firstam.com)
 *
 * MATCHES the FA Escrow layout but with title-specific content:
 * - Policy Type row (Eagle Owner's Policy)
 * - Seller Title Fee + Buyer Title Fees (Binder)
 * - Different disclaimer about endorsements/sub escrow fees
 *
 * This PDF should look like First American generated it — not TLH.
 */
export function generateFATitlePDF(proposal: ProposalSet): jsPDF {
  const { transaction, faTitle } = proposal;
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 60;
  const contentWidth = pageWidth - margin * 2;
  const font = FA_FONT;

  const { blue, navy, lightBlue, textGray, white } = FIRST_AM;

  let y = 0;

  // === HEADER BAR (navy — matches FA Escrow) ===
  doc.setFillColor(navy[0], navy[1], navy[2]);
  doc.rect(0, 0, pageWidth, 100, 'F');

  // Blue accent line
  doc.setFillColor(blue[0], blue[1], blue[2]);
  doc.rect(0, 100, pageWidth, 4, 'F');

  // Eagle logo (left side)
  try {
    doc.addImage(FA_LOGO_BASE64, 'PNG', margin, 20, 180, 42);
  } catch (err) {
    doc.setFont(font, 'bold');
    doc.setFontSize(18);
    doc.setTextColor(white[0], white[1], white[2]);
    doc.text('First American', margin, 45);
  }

  // Subtitle below logo
  doc.setFont(font, 'italic');
  doc.setFontSize(11);
  doc.setTextColor(blue[0], blue[1], blue[2]);
  doc.text('Title Insurance', margin, 80);

  // Office info (right side)
  const headerRight = pageWidth - margin;
  doc.setFont(font, 'normal');
  doc.setFontSize(9);
  doc.setTextColor(white[0], white[1], white[2]);
  doc.text(FA_OFFICER.office, headerRight, 30, { align: 'right' });
  doc.text(FA_OFFICER.city, headerRight, 43, { align: 'right' });
  doc.text(`Phone: ${FA_OFFICER.phone}`, headerRight, 60, { align: 'right' });
  doc.setTextColor(blue[0], blue[1], blue[2]);
  doc.text(FA_OFFICER.email, headerRight, 73, { align: 'right' });
  doc.setFontSize(7);
  doc.setTextColor(150, 160, 180);
  doc.text('www.firstam.com', headerRight, 90, { align: 'right' });

  y = 130;

  // === TITLE ===
  doc.setFont(font, 'bold');
  doc.setFontSize(22);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text('Title Fee Proposal', margin, y);

  y += 8;
  doc.setFillColor(blue[0], blue[1], blue[2]);
  doc.rect(margin, y, 80, 3, 'F');
  y += 28;

  // === PROPOSAL INTRO ===
  if (transaction.agentName) {
    doc.setFont(font, 'normal');
    doc.setFontSize(11);
    doc.setTextColor(textGray[0], textGray[1], textGray[2]);
    doc.text(`Dear ${transaction.agentName},`, margin, y);
    y += 20;
    doc.text(
      'Thank you for the opportunity to provide title insurance services. Below is our',
      margin,
      y,
    );
    y += 16;
    doc.text('estimated title fee proposal for the following transaction:', margin, y);
    y += 28;
  }

  // === TRANSACTION DETAILS ===
  doc.setFillColor(navy[0], navy[1], navy[2]);
  doc.rect(margin, y, contentWidth, 28, 'F');
  doc.setFont(font, 'bold');
  doc.setFontSize(11);
  doc.setTextColor(white[0], white[1], white[2]);
  doc.text('TRANSACTION DETAILS', margin + 14, y + 18);
  y += 28;

  const detailColors = {
    altBg: lightBlue,
    whiteBg: white,
    labelColor: textGray,
    valueColor: navy,
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

  // Blue bottom border
  doc.setFillColor(blue[0], blue[1], blue[2]);
  doc.rect(margin, y, contentWidth, 2, 'F');
  y += 24;

  // === TITLE FEE SCHEDULE ===
  doc.setFillColor(navy[0], navy[1], navy[2]);
  doc.rect(margin, y, contentWidth, 28, 'F');
  doc.setFont(font, 'bold');
  doc.setFontSize(11);
  doc.setTextColor(white[0], white[1], white[2]);
  doc.text('TITLE FEE SCHEDULE', margin + 14, y + 18);
  y += 28;

  // Column headers (blue bar)
  doc.setFillColor(blue[0], blue[1], blue[2]);
  doc.rect(margin, y, contentWidth, 26, 'F');
  doc.setFont(font, 'bold');
  doc.setFontSize(9);
  doc.setTextColor(white[0], white[1], white[2]);
  doc.text('DESCRIPTION', margin + 14, y + 17);
  doc.text('AMOUNT', pageWidth - margin - 14, y + 17, { align: 'right' });
  y += 26;

  const feeColors = {
    altBg: lightBlue,
    whiteBg: white,
    textColor: navy,
  };

  // Policy Type row
  drawFeeRow(
    doc, 'Policy Type', faTitle.policyType,
    margin, y, contentWidth, 26, true, false, feeColors, font,
  );
  y += 26;

  // Seller Title Fee
  drawFeeRow(
    doc, 'Seller Title Fee', pdfCurrency(faTitle.sellerTitleFee),
    margin, y, contentWidth, 26, false, true, feeColors, font,
  );
  y += 26;

  // Buyer Title Fees (Binder)
  drawFeeRow(
    doc, 'Buyer Title Fees (Binder)', pdfCurrency(faTitle.buyerTitleFee),
    margin, y, contentWidth, 26, true, true, feeColors, font,
  );
  y += 26;

  // Blue border
  doc.setFillColor(blue[0], blue[1], blue[2]);
  doc.rect(margin, y, contentWidth, 2, 'F');
  y += 6;

  // Total bar (navy with white label, blue amount)
  doc.setFillColor(navy[0], navy[1], navy[2]);
  doc.rect(margin, y, contentWidth, 36, 'F');
  doc.setFont(font, 'bold');
  doc.setFontSize(12);
  doc.setTextColor(white[0], white[1], white[2]);
  doc.text('TOTAL TITLE FEES', margin + 14, y + 23);
  doc.setTextColor(blue[0], blue[1], blue[2]);
  doc.setFontSize(14);
  doc.text(pdfCurrency(faTitle.totalFees), pageWidth - margin - 14, y + 23, {
    align: 'right',
  });
  y += 36;

  // === TITLE OFFICER ===
  y += 20;
  doc.setFont(font, 'bold');
  doc.setFontSize(10);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text('Your Title Officer:', margin, y);
  y += 16;
  doc.setFont(font, 'normal');
  doc.setFontSize(10);
  doc.text(FA_OFFICER.name, margin, y);
  y += 14;
  doc.setTextColor(textGray[0], textGray[1], textGray[2]);
  doc.text(`${FA_OFFICER.phone}  |  ${FA_OFFICER.email}`, margin, y);
  y += 30;

  // === DISCLAIMER ===
  doc.setFont(font, 'italic');
  doc.setFontSize(8);
  doc.setTextColor(textGray[0], textGray[1], textGray[2]);
  const disclaimers = [
    'Estimate only- endorsements, sub escrow fees, wire fees may apply.',
    'First American Title Insurance Company makes no express or implied warranty respecting the',
    'information presented and assumes no responsibility for errors or omissions.',
  ];
  disclaimers.forEach((line) => {
    doc.text(line, margin, y);
    y += 12;
  });

  // === BOTTOM BAR — matches FA Escrow ===
  doc.setFillColor(navy[0], navy[1], navy[2]);
  doc.rect(0, pageHeight - 40, pageWidth, 40, 'F');
  doc.setFillColor(blue[0], blue[1], blue[2]);
  doc.rect(0, pageHeight - 40, pageWidth, 3, 'F');

  doc.setFont(font, 'italic');
  doc.setFontSize(9);
  doc.setTextColor(blue[0], blue[1], blue[2]);
  doc.text('Own What\u2019s Next\u2122', pageWidth / 2, pageHeight - 20, { align: 'center' });
  doc.setFontSize(7);
  doc.setTextColor(150, 160, 180);
  doc.text('www.firstam.com', pageWidth / 2, pageHeight - 10, { align: 'center' });

  return doc;
}
