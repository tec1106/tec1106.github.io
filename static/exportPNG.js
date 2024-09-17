function exportPNGx(width, height, exportHeading) {
    updateChart(true);
    
    const svg = document.querySelector("svg");
    const svgData = new XMLSerializer().serializeToString(svg);
    
    const scaleFactor = 2;
    const canvas = document.createElement("canvas");
    canvas.width = width * scaleFactor;
    canvas.height = (height + 100) * scaleFactor;

    const ctx = canvas.getContext("2d");
    ctx.scale(scaleFactor, scaleFactor);

    const img = new Image();
    const svgBlob = new Blob([svgData], {type: "image/svg+xml;charset=utf-8"});
    const url = URL.createObjectURL(svgBlob);

    img.onload = function() {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width / scaleFactor, canvas.height / scaleFactor);

        ctx.drawImage(img, 0, 0);

        ctx.fillStyle = "#3498db";
        ctx.font = "bold 36px 'Roboto', sans-serif";
        ctx.textAlign = "center";
        console.log(exportHeading + "t4et");
        ctx.fillText(exportHeading, width / 2, 50);
        
        const pngUrl = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = "pm_growth_bubble_high_res.png";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        updateChart(false);
        
    };
    img.src = url;
}