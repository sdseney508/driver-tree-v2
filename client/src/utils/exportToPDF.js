//this file converts the provided info from driverTreePage and driverPage into pdf images then exports them.

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import html2pdf from "html2pdf.js";

const exportToPDF = (title) => {
  const input = document.getElementById(title);

  const opt = {
    margin: 1,
    filename: 'crap.pdf',
    image: { type: 'png', quality: 1 },
    html2canvas: { scale: 3, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
  };

  html2pdf().from(input).set(opt).save();

//   html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
//     const imgData = canvas.toDataURL("image/png");

//     // A4 size in landscape mode
//     const pageWidth = 297; // in mm
//     const pageHeight = 210; // in mm
    
//     // Get canvas dimensions in pixels
//     const canvasWidth = canvas.width;
//     const canvasHeight = canvas.height;

//     // Calculate dimensions of the image on the PDF
//     const canvasAspectRatio = canvasWidth / canvasHeight;
//     const pdfAspectRatio = pageWidth / pageHeight;

//     let imgWidth, imgHeight;

//     // Scale the image to fit within the page's width
//     if (canvasAspectRatio > pdfAspectRatio) {
//       imgWidth = pageWidth;
//       imgHeight = pageWidth / canvasAspectRatio;
//     } else {
//       imgHeight = pageHeight;
//       imgWidth = pageHeight * canvasAspectRatio;
//     }

//     // Ensure the entire image fits on one page
//     const pdf = new jsPDF("landscape", "mm", "a4");

//     // Add the image to the PDF
//     pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

//     pdf.save("download.pdf");
//   });
};

export default exportToPDF;