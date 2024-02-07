
const arrowSVGWithConversion = async (svg) => {
        const svgString = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        canvas.width = svg.width.baseVal.value;
        canvas.height = svg.height.baseVal.value;
        const ctx = canvas.getContext("2d");
        const img = document.createElement("img");
        img.setAttribute("src", "data:image/svg+xml;base64," + btoa(svgString));
        await new Promise((resolve) => {
            img.onload = () => {
            ctx.drawImage(img, 0, 0);
            resolve();
            };
        });
        return canvas.toDataURL("image/png");
        
};

export {arrowSVGWithConversion};