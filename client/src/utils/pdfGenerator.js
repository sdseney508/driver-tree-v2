import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { PDFExport, savePDF } from '@progress/kendo-react-pdf';

const pdfExportComponent = React.useRef(null);

const exportPDFWithMethod = () => {
    let element = document.quaerySelector('.pdf-export') || document.body;
    savePDF(element, { paperSize: 'A4' });
};

const exportPDFWithComponent = () => {
    if (pdfExportComponent.current) {
        pdfExportComponent.current.save();
    }
};

export { exportPDFWithComponent, exportPDFWithMethod }