import { drawDOM, exportPDF } from "@progress/kendo-drawing";
import { saveAs } from "@progress/kendo-file-saver";

export function exportElement(element, options, outcomeTitle) {
 
  drawDOM(element, options)
    .then((group) => {
      return exportPDF(group);
    })
    .then((dataUri) => {
      saveAs(dataUri, `${outcomeTitle}.pdf`);
    }).then(() => {
      window.location.reload();
    });
}