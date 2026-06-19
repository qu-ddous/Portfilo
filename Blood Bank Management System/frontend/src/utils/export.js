/**
 * Reusable PDF Export function for tables using Dynamic Imports
 * This fixes the Vite/ESM 500 resolution errors.
 */
export const exportToPDF = async (title, columns, data, filename) => {
  try {
    // Dynamically import libraries to avoid Vite startup analysis errors
    const { default: jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');

    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(192, 57, 43); // Blood Theme Red
    doc.text(title, 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    
    // Table 
    autoTable(doc, {
      startY: 40,
      head: [columns],
      body: data,
      theme: 'grid',
      headStyles: { fillColor: [192, 57, 43], fontStyle: 'bold' },
      styles: { fontSize: 9, cellPadding: 4 }
    });
    
    doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
    return true;
  } catch (err) {
    console.error('PDF Export Error:', err);
    return false;
  }
};
