function setupCanvas(canvas) {
    if (!canvas) return null;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return {
        ctx,
        width: rect.width,
        height: rect.height
    };
}

function drawMiniAreaChart(canvas, data, options) {
    const setup = setupCanvas(canvas);
    if (!setup || !data?.length) return;
    const { ctx, width, height } = setup;
    const { lineColor } = options;

    ctx.clearRect(0, 0, width, height);

    const padding = 6;
    const minVal = Math.min(...data);
    const maxVal = Math.max(...data);
    const range = maxVal - minVal || 1;
    const stepX = data.length > 1 ? (width - padding * 2) / (data.length - 1) : 0;

    const points = data.map((v, i) => {
        const x = padding + i * stepX;
        const yNorm = (v - minVal) / range;
        const y = height - padding - yNorm * (height - padding * 2);
        return { x, y };
    });

    ctx.beginPath();
    ctx.moveTo(points[0].x, height - padding);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, height - padding);
    ctx.closePath();

    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, options.fillColor || "#0000000F");
    gradient.addColorStop(1, "#00000000");

    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.stroke();
}

function drawNoData({ctx, width, height}) {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#333";
    ctx.font = "20px 'Roboto', system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("No data", width / 2, height / 2);
}

function drawCachingChart(canvas, originData, tmData) {
    const setup = setupCanvas(canvas);
    if (!setup || (!originData?.length && !tmData?.length)) {
        drawNoData(setup);
        return;
    }

    const { ctx, width, height } = setup;
    ctx.clearRect(0, 0, width, height);

    const paddingLeft = 35;
    const paddingRight = 8;
    const paddingTop = 10;
    const paddingBottom = 36;

    const allY = originData.concat(tmData).map(p => p.y);
    const maxY = Math.max(...allY);
    const minY = 0;
    const rangeY = maxY - minY || 1;

    const n = originData.length;
    const stepX = n > 1 ? (width - paddingLeft - paddingRight) / (n - 1) : 0;

    function mapPoint(d, index) {
        const x = paddingLeft + index * stepX;
        const yNorm = (d.y - minY) / rangeY;
        const y = height - paddingBottom - yNorm * (height - paddingTop - paddingBottom);
        return { x, y };
    }

    const gridLines = 4;
    ctx.strokeStyle = "#00000014";
    ctx.lineWidth = 1;
    for (let i = 0; i <= gridLines; i++) {
        const t = i / gridLines;
        const y = paddingTop + t * (height - paddingTop - paddingBottom);
        ctx.beginPath();
        ctx.moveTo(paddingLeft, y);
        ctx.lineTo(width - paddingRight, y);
        ctx.stroke();
    }

    const originPoints = originData.map(mapPoint);
    ctx.beginPath();
    ctx.moveTo(originPoints[0].x, height - paddingBottom);
    originPoints.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(originPoints[originPoints.length - 1].x, height - paddingBottom);
    ctx.closePath();
    ctx.fillStyle = CONFIG.chartBackgroundColor;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(originPoints[0].x, originPoints[0].y);
    originPoints.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = CONFIG.cacheOriginBorderColor;
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.stroke();

    const tmPoints = tmData.map(mapPoint);
    ctx.beginPath();
    ctx.moveTo(tmPoints[0].x, tmPoints[0].y);
    tmPoints.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = CONFIG.cacheTrafficmindBorderColor;
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.stroke();

    ctx.fillStyle = "#666";
    ctx.font = "11px 'Roboto', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";

    for (let i = 0; i <= gridLines; i++) {
        const t = i / gridLines;
        const yValue = minY + t * rangeY;
        const yPosition = paddingTop + (1 - t) * (height - paddingTop - paddingBottom);
        ctx.fillText(yValue.toFixed(0), paddingLeft - 6, yPosition);
    }

    originData.forEach((p, i) => {
        if (i % 2 !== 0 && i !== n - 1) return;
        const { x } = mapPoint(p, i);
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(p.x, x, height - paddingBottom + 10);
    });
}

function renderTrafficCharts() {
    const requestsCanvas = document.getElementById("requestsChart");
    const transferCanvas = document.getElementById("transferChart");

    if (requestsCanvas) {
        drawMiniAreaChart(requestsCanvas, CONFIG.trafficRequestsData, {
            lineColor: CONFIG.trafficChartBorderColor,
            fillColor: CONFIG.chartBackgroundColor
        });
    }

    if (transferCanvas) {
        drawMiniAreaChart(transferCanvas, CONFIG.trafficTransferData, {
            lineColor: CONFIG.trafficChartBorderColor,
            fillColor: CONFIG.chartBackgroundColor
        });
    }
}

function renderCachingChart(originData, tmData) {
    const canvas = document.getElementById("cachingChart");
    if (!canvas) return;
    drawCachingChart(canvas, originData, tmData);
}
