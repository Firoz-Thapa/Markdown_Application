import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import showdown from 'showdown';

// Initialize Showdown converter with tables and strikethrough enabled
const converter = new showdown.Converter({ tables: true, strikethrough: true });

export const exportToPDF = (markdown) => {
  const html = converter.makeHtml(markdown);
  
  // Create a temporary element to render HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  document.body.appendChild(tempDiv);

  // Wait for the temporary element to render before capturing it
  html2canvas(tempDiv).then((canvas) => {
    const imgData = canvas.toDataURL('image/png');
    const doc = new jsPDF();
    
    // Add image to PDF
    doc.addImage(imgData, 'PNG', 1, 1);
    doc.save('document.pdf');

    // Clean up the temporary element
    document.body.removeChild(tempDiv);
  });
};
