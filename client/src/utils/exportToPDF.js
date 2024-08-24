//this file converts the provided info from driverTreePage and driverPage into pdf images then exports them.

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const exportToPDF = async (title) => {
    const input = document.getElementById(title);
    await html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "mm", "a4");
      const imgWidth = 297;
      const pageHeight = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
  
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
  
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save("download.pdf");
    });
    setTimeout(() => {
      window.location.reload();
    }, 2500);
    // window.location.reload(); // Reload the page after exporting
  };

    export default exportToPDF;