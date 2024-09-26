document.addEventListener('DOMContentLoaded', function() {
    try {
        console.log("DOM content loaded, initializing chart...");

        let categories = [];
        let currentValues = [];
        let exportHeading = "";

        promptForName().then(userName => {
            console.log("User's name is: " + userName);
            exportHeading = userName + "'s " + title + ' Growth Bubble'
        });

        

        // Fetch categories from JSON file
        fetch('categories/categories.json')
        .then(response => response.json())
        .then(data => {
            categories = data.categories;
            initializeChart();
        })
        .catch(error => console.error('Error loading categories:', error));

        function initializeChart() {
            const width = 940;
            const height = 500;
            const margin = 100;
            const radius = Math.min(width, 800) / 2.5 - margin;

            const svg = d3.select("#chart")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", `translate(${width / 2},${height / 2})`);

            // Define the gradient for the blue bubble
            const gradient = svg.append("defs")
                .append("radialGradient")
                .attr("id", "blue-gradient")
                .attr("cx", "50%")
                .attr("cy", "50%")
                .attr("r", "50%");

            gradient.append("stop")
                .attr("offset", "0%")
                .attr("stop-color", "#3498db");

            gradient.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", "rgba(137, 207, 235, 0.75)");

            const radialScale = d3.scaleLinear()
                .domain([0, 6])
                .range([0, radius]);

            const angleSlice = Math.PI * 2 / categories.length;

            // Paths for goal (green) and current (blue)
            const goalPath = svg.append("path")
                .attr("fill", "rgba(144, 238, 144, 0.2)"); // Light green color for the goal

            const currentPath = svg.append("path")
                .attr("fill", "url(#blue-gradient)") // Apply the gradient to the blue bubble
                .attr("stroke", "rgba(137, 207, 235, 0.75)")
                .attr("stroke-width", 2);

            const data = new Array(categories.length).fill(5); // Current status (blue)
            const goalData = new Array(categories.length).fill(7); // Goal (green)

            const lineGenerator = d3.lineRadial()
                .angle((d, i) => i * angleSlice)
                .radius(d => radialScale(d))
                .curve(d3.curveCatmullRomClosed);

            function updateChart(forExport = false) {
                currentValues = categories.map((category, i) => {
                    const input = document.getElementById(category.split(/[ ,]+/)[0].toLowerCase());
                    return input ? +input.value : 3;  // default to 3 if input not found
                });

                data.forEach((d, i) => {
                    const input = document.getElementById(categories[i].split(/[ ,]+/)[0].toLowerCase());
                    if (input) {
                        data[i] = +input.value;
                    }
                });

                goalData.forEach((d, i) => {
                    const goalInput = document.getElementById(categories[i].split(/[ ,]+/)[0].toLowerCase() + '-goal');
                    if (goalInput) {
                        goalData[i] = +goalInput.value;
                    }
                });

                // Update goal path (green) first so it underlaps the blue
                goalPath.transition()
                    .duration(500)
                    .attr("d", lineGenerator(goalData));

                // Update current path (blue)
                currentPath.transition()
                    .duration(500)
                    .attr("d", lineGenerator(data));

                // Update or redraw category labels for export
                drawCategoryLabels(forExport);

                
            }   

            function drawCategoryLabels(forExport = true) {
                svg.selectAll(".category-label").remove();
                categories.forEach((d, i) => {
                    const angle = i * angleSlice;
                    svg.append("line")
                        .attr("x1", 0)
                        .attr("y1", 0)
                        .attr("x2", radius * Math.cos(angle - Math.PI / 2))
                        .attr("y2", radius * Math.sin(angle - Math.PI / 2))
                        .attr("stroke", "rgba(137, 207, 235, 0.15)")
                        .attr("stroke-width", 1);

                    const labelRadius = radius + 8;
                    const x = labelRadius * Math.cos(angle - Math.PI / 2);
                    const y = labelRadius * Math.sin(angle - Math.PI / 2);

                    let labelText = d;
                    if (forExport) {
                        labelText += ` (${currentValues[i]})`;
                    }

                    svg.append("text")
                        .attr("class", "category-label")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("text-anchor", (Math.cos(angle - Math.PI / 2) < 0) ? "end" : "start")
                        .attr("dominant-baseline", "central")
                        .style("font-size", "16px")
                        .style("fill", "#555")
                        .style("font-family", "DM Serif Display, serif")
                        .text(labelText);
                });
            }

            // Drawing circular grid lines
            const gridLevels = 3;
            for (let i = 1; i <= gridLevels; i++) {
                const gridRadius = (radius / gridLevels) * i;
                svg.append("circle")
                    .attr("cx", 0)
                    .attr("cy", 0)
                    .attr("r", gridRadius)
                    .attr("fill", "none")
                    .attr("stroke", "rgba(137, 207, 235, 0.15)")
                    .attr("stroke-width", 1);

                
            }

            generateInputGroups(categories, updateChart, showModal);

            
            

            function exportPNG() {
                
                const font = "DM Serif Display, sans-serif";
                const svg = document.querySelector("svg");
                const svgData = new XMLSerializer().serializeToString(svg);
                const scaleFactor = 4;
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
            
                    // Change to position the chart horizontally and vertically
                    ctx.drawImage(img, 0, 64);
            
                    ctx.fillStyle = "#3498db";
                    ctx.font = "bold 36px " + font;
                    ctx.textAlign = "center";
                    ctx.fillText(exportHeading, width / 2, 50);

                     // Add current date and time
                    const now = new Date();
                    const dateTimeString = now.toLocaleString();
                    ctx.fillStyle = "#333";
                    ctx.font = "10px " + font;
                    ctx.fillText(dateTimeString, width / 2, 65);

                    // Add legend
                    const legendY = height + 64;
                    ctx.font = "16px " + font;
                    ctx.textAlign = "left";
                    
                    // Current (Blue) legend item
                    ctx.fillStyle = "#3498db";
                    ctx.fillRect(width / 2 - 100, legendY, 20, 20);
                    ctx.fillStyle = "#000000";
                    ctx.fillText("Current", width / 2 - 70, legendY + 15);
                    
                    // Goal (Green) legend item
                    ctx.fillStyle = "rgba(144, 238, 144, 0.8)";
                    ctx.fillRect(width / 2 + 50, legendY, 20, 20);
                    ctx.fillStyle = "#000000";
                    ctx.fillText("Goal", width / 2 + 80, legendY + 15);
                    
                    const pngUrl = canvas.toDataURL("image/png");
                    const downloadLink = document.createElement("a");
                    downloadLink.href = pngUrl;
                    downloadLink.download = exportHeading + ".png";
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);
                };
                img.src = url;
            }

            updateChart();
            drawCategoryLabels();
            

            // Set up export button event listeners
            document.getElementById("download-png").addEventListener("click", exportPNG);
        }

    } catch (error) {
        console.error("An error occurred while initializing the chart:", error);
    }
});