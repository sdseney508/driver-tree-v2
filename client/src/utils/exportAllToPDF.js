import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const exportAllToPDF = async (element, title = "export") => {
  const pdf = new jsPDF("landscape", "mm", "a4");
  const pageWidth = 297; // A4 width in mm
  const pageHeight = 210; // A4 height in mm

  // Find all sections to export, using the `.page-break` class as a delimiter
  const sections = element.querySelectorAll(".page-break");

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];

    // Wait for a brief moment to ensure content is fully rendered
    await new Promise((resolve) => setTimeout(resolve, 200));

    try {
      // Render the current section as a canvas
      const canvas = await html2canvas(section, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff", // Set a background color to avoid transparency issues
        logging: true,
      });

      const imgData = canvas.toDataURL("image/png");

      // Check if imgData is valid
      if (!imgData.startsWith("data:image/png")) {
        console.error("Invalid image data detected.");
        throw new Error("Failed to generate image data.");
      }

      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add the image to the PDF
      if (i > 0) {
        pdf.addPage();
      }
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    } catch (error) {
      console.error(`Error processing section ${i}:`, error);
    }
  }

  // Save the PDF
  try {
    await pdf.save(`${title}.pdf`);
  } catch (error) {
    console.error("Error saving the PDF:", error);
  }

  // Optionally reload the page or reset the UI state
  window.location.reload();
};

export default exportAllToPDF;
