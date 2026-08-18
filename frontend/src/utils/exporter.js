import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Exports a poem container element to a high-quality PDF.
 * @param {Object} poem - Poem data object.
 * @param {HTMLElement} element - The DOM element containing the poem content.
 */
export async function exportPoemToPDF(poem, element) {
  if (!element) {
    throw new Error('Poem element not found for PDF export.');
  }

  try {
    // Save current scroll position
    const scrollTop = element.scrollTop;
    
    // Add printing class to temporarily clean up scrollbars and margins
    element.classList.add('export-printing-active');

    const canvas = await html2canvas(element, {
      scale: 2, // Double scale for high-quality text resolution
      useCORS: true,
      allowTaint: true,
      backgroundColor: null, // Transparent background to capture theme gradients
      logging: false,
    });

    // Remove the printing class
    element.classList.remove('export-printing-active');
    element.scrollTop = scrollTop;

    const imgData = canvas.toDataURL('image/png');
    
    // Set up PDF document
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    
    const contentWidth = pdfWidth - (margin * 2);
    const contentHeight = (canvas.height * contentWidth) / canvas.width;

    let heightLeft = contentHeight;
    let position = margin;

    // Add first page
    pdf.addImage(imgData, 'PNG', margin, position, contentWidth, contentHeight, undefined, 'FAST');
    heightLeft -= (pdfHeight - (margin * 2));

    // Handle multi-page poems dynamically
    while (heightLeft > 0) {
      position = heightLeft - contentHeight + margin;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', margin, position, contentWidth, contentHeight, undefined, 'FAST');
      heightLeft -= (pdfHeight - (margin * 2));
    }

    // Save with sanitized filename
    const filename = `${poem.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
    pdf.save(filename);
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}

/**
 * Exports a poem container element to a high-resolution JPEG.
 * @param {Object} poem - Poem data object.
 * @param {HTMLElement} element - The DOM element containing the poem content.
 */
export async function exportPoemToJPEG(poem, element) {
  if (!element) {
    throw new Error('Poem element not found for JPEG export.');
  }

  try {
    const scrollTop = element.scrollTop;
    element.classList.add('export-printing-active');

    // Render HTML element to a canvas
    const canvas = await html2canvas(element, {
      scale: 3, // Triple scale for social media sharing clarity
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
    });

    element.classList.remove('export-printing-active');
    element.scrollTop = scrollTop;

    // Convert canvas to image url
    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    // Trigger download
    const link = document.createElement('a');
    link.download = `${poem.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpg`;
    link.href = imgData;
    link.click();

    return true;
  } catch (error) {
    console.error('Error generating JPEG:', error);
    throw error;
  }
}
