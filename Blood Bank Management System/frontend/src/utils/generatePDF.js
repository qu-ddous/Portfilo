/**
 * generatePDF.js — PDF generation utilities using jsPDF + html2canvas
 */
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// BloodLink brand colors
const COLORS = {
  primary: '#C0392B',
  primaryLight: '#E74C3C',
  dark: '#2C3E50',
  muted: '#7F8C8D',
  border: '#E5E7EB',
  success: '#27AE60',
  white: '#FFFFFF',
};

/**
 * Capture a DOM element and download as PDF
 * @param {HTMLElement|string} elementOrId - DOM element or element ID
 * @param {string} filename - File name without extension
 */
export const exportElementAsPDF = async (elementOrId, filename = 'export') => {
  const element =
    typeof elementOrId === 'string'
      ? document.getElementById(elementOrId)
      : elementOrId;

  if (!element) {
    console.error('PDF export: element not found');
    return;
  }

  const canvas = await html2canvas(element, { scale: 2, useCORS: true });
  const imgData = canvas.toDataURL('image/png');

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  pdf.save(`${filename}.pdf`);
};

/**
 * Generate a Donation Certificate PDF
 * @param {Object} options
 * @param {string} options.donorName
 * @param {string} options.bloodType
 * @param {string} options.donationDate  - formatted date string
 * @param {number} options.units
 * @param {string} [options.donationId]
 */
export const generateDonationCertificate = ({
  donorName,
  bloodType,
  donationDate,
  units,
  donationId = '',
}) => {
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const W = pdf.internal.pageSize.getWidth();   // 297
  const H = pdf.internal.pageSize.getHeight();  // 210

  // --- Background ---
  pdf.setFillColor(248, 249, 250);
  pdf.rect(0, 0, W, H, 'F');

  // --- Outer border (double line) ---
  pdf.setDrawColor(192, 57, 43);
  pdf.setLineWidth(3);
  pdf.rect(8, 8, W - 16, H - 16);
  pdf.setLineWidth(0.8);
  pdf.rect(12, 12, W - 24, H - 24);

  // --- Header ribbon ---
  pdf.setFillColor(192, 57, 43);
  pdf.rect(8, 8, W - 16, 28, 'F');

  // --- Logo text ---
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('🩸 BloodLink', W / 2, 24, { align: 'center' });

  // --- Subtitle ribbon ---
  pdf.setFillColor(231, 76, 60);
  pdf.rect(8, 36, W - 16, 12, 'F');
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Blood Bank Management System', W / 2, 44, { align: 'center' });

  // --- Certificate heading ---
  pdf.setTextColor(44, 62, 80);
  pdf.setFontSize(28);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Certificate of Blood Donation', W / 2, 72, { align: 'center' });

  // --- Divider line ---
  pdf.setDrawColor(192, 57, 43);
  pdf.setLineWidth(0.5);
  pdf.line(40, 78, W - 40, 78);

  // --- Body text ---
  pdf.setFontSize(13);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(127, 140, 141);
  pdf.text('THIS CERTIFIES THAT', W / 2, 90, { align: 'center' });

  // --- Donor Name ---
  pdf.setFontSize(32);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(192, 57, 43);
  pdf.text(donorName, W / 2, 108, { align: 'center' });

  // --- Underline ---
  const nameWidth = pdf.getTextWidth(donorName);
  const nameX = W / 2 - nameWidth / 2;
  pdf.setDrawColor(192, 57, 43);
  pdf.setLineWidth(0.5);
  pdf.line(nameX, 111, nameX + nameWidth, 111);

  // --- Donation details ---
  pdf.setFontSize(13);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(44, 62, 80);
  pdf.text(
    `has successfully donated ${units} unit(s) of  ${bloodType}  blood on  ${donationDate}.`,
    W / 2,
    124,
    { align: 'center' }
  );

  pdf.setTextColor(127, 140, 141);
  pdf.setFontSize(11);
  pdf.text(
    'Thank you for your generous contribution in saving lives.',
    W / 2,
    136,
    { align: 'center' }
  );

  // --- Bottom divider ---
  pdf.setDrawColor(229, 231, 235);
  pdf.setLineWidth(0.4);
  pdf.line(40, 148, W - 40, 148);

  // --- Footer info ---
  pdf.setFontSize(9);
  pdf.setTextColor(127, 140, 141);
  if (donationId) {
    pdf.text(`Certificate ID: ${donationId}`, 20, 158);
  }
  pdf.text(`Issued on: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, W - 20, 158, { align: 'right' });

  // --- Hospital stamp placeholder ---
  pdf.setDrawColor(192, 57, 43);
  pdf.setLineWidth(0.4);
  pdf.circle(W / 2, 168, 16);
  pdf.setFontSize(7);
  pdf.setTextColor(192, 57, 43);
  pdf.text('OFFICIAL', W / 2, 165, { align: 'center' });
  pdf.text('STAMP', W / 2, 172, { align: 'center' });

  pdf.save(`BloodLink_Certificate_${donorName.replace(/\s+/g, '_')}.pdf`);
};

/**
 * Generate a Reports Summary PDF capturing a DOM element
 * @param {string} elementId - ID of the report container element
 * @param {string} reportTitle - Title shown in filename
 */
export const generateReportPDF = async (elementId, reportTitle = 'Report') => {
  await exportElementAsPDF(elementId, `BloodLink_${reportTitle}`);
};
