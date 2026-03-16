const CONFIG = {
    trafficRequestsData: [2, 3, 4, 6, 10, 25, 8, 6, 5, 4, 4, 4, 4, 4, 4, 4],
    trafficTransferData: [2, 3, 4, 6, 4, 5, 7, 6, 5, 4, 4, 4, 4, 4, 4, 4],
    trafficChartBorderColor: "#4A90E2",
    chartBackgroundColor: "#f3f9ff",
    cacheOriginBorderColor: "#2d76fb",
    cacheTrafficmindBorderColor: "#0040e3",
    cacheChartBackgroundColor: "#2d76fb14",
    trafficChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                display: false
            },
            y: {
                display: false
            },
        },
        plugins: {
            legend: {
                display: false
            }
        },
        elements: {
            line: { tension: 0.4, borderWidth: 2 },
            point: { radius: 0 }
        }
    },
    cacheChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleFont: {
                    size: 13,
                    family: "'Poppins', sans-serif"
                },
                bodyFont: {
                    size: 12,
                    family: "'Poppins', sans-serif"
                },
                padding: 12,
                cornerRadius: 8,
                displayColors: true,
                callbacks: {
                    label: function (context) {
                        return context.dataset.label + ': ' + context.parsed.y;
                    }
                }
            },
            legend: {
                display: false
            },
        },
        elements: {
            line: { tension: 0.4, borderWidth: 2 },
            point: { radius: 0, hoverRadius: 6 }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        },
        scales: {
            x: {
                type: "category",
                ticks: {
                    font: {
                        size: 11
                    },
                    maxRotation: 0,
                    autoSkip: true,
                    maxTicksLimit: 12
                },
                grid: {
                    display: false
                }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    font: {
                        size: 11
                    }
                },
                grid: {
                    color: "rgba(0,0,0,0.08)",
                    drawBorder: false
                }
            }
        }
    },
    cacheData: {
        "served": {
            "total": "4.21M",
            "tm": "18.76K",
            "origin": "4.19M",
            originChart: [
                { x: "1:00", y: 120 },
                { x: "2:00", y: 140 },
                { x: "3:00", y: 160 },
                { x: "4:00", y: 180 },
                { x: "5:00", y: 200 },
                { x: "6:00", y: 220 },
                { x: "7:00", y: 240 },
                { x: "8:00", y: 260 },
                { x: "9:00", y: 280 },
                { x: "10:00", y: 300 },
                { x: "11:00", y: 280 },
                { x: "12:00", y: 250 },
                { x: "13:00", y: 220 },
                { x: "14:00", y: 180 },
                { x: "15:00", y: 150 },
                { x: "16:00", y: 130 },
                { x: "17:00", y: 110 },
                { x: "18:00", y: 90 }
            ],
            tmChart: [
                { x: "1:00", y: 5 },
                { x: "2:00", y: 8 },
                { x: "3:00", y: 10 },
                { x: "4:00", y: 12 },
                { x: "5:00", y: 15 },
                { x: "6:00", y: 18 },
                { x: "7:00", y: 20 },
                { x: "8:00", y: 22 },
                { x: "9:00", y: 25 },
                { x: "10:00", y: 28 },
                { x: "11:00", y: 26 },
                { x: "12:00", y: 22 },
                { x: "13:00", y: 18 },
                { x: "14:00", y: 15 },
                { x: "15:00", y: 12 },
                { x: "16:00", y: 10 },
                { x: "17:00", y: 8 },
                { x: "18:00", y: 6 }
            ]
        },
        "cache-status": null,
        "country": null,
        "host": null,
        "status-code": null,
        "device": null
    }
};
