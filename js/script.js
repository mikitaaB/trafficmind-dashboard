const menuBtn = document.getElementById('menuBtn');
const menuDropdown = document.getElementById('menuDropdown');
const profileBtn = document.getElementById('profileBtn');
const profileMenu = document.getElementById('profileMenu');

menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    menuBtn.classList.toggle('active');
    menuDropdown.classList.toggle('open');
});

profileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    profileMenu.classList.toggle('open');
});

document.addEventListener('click', (e) => {
    if (!menuDropdown.contains(e.target) && !menuBtn.contains(e.target)) {
        menuDropdown.classList.remove('open');
        menuBtn.classList.remove('active');
    }

    if (!profileMenu.contains(e.target) && !profileBtn.contains(e.target)) {
        profileMenu.classList.remove('open');
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        menuDropdown.classList.remove('open');
        profileMenu.classList.remove('open');
        menuBtn.classList.remove('active');
    }
});


new Chart(document.getElementById('requestsChart'), {
    type: 'line',
    data: {
        labels: CONFIG.trafficRequestsData.map(() => ""),
        datasets: [{
            data: CONFIG.trafficRequestsData,
            borderColor: CONFIG.trafficChartBorderColor,
            backgroundColor: CONFIG.chartBackgroundColor,
            fill: true
        }]
    },
    options: CONFIG.trafficChartOptions
});

new Chart(document.getElementById('transferChart'), {
    type: 'line',
    data: {
        labels: CONFIG.trafficTransferData.map(() => ""),
        datasets: [{
            data: CONFIG.trafficTransferData,
            borderColor: CONFIG.trafficChartBorderColor,
            backgroundColor: CONFIG.chartBackgroundColor,
            fill: true
        }]
    },
    options: CONFIG.trafficChartOptions
});

const cacheTabs = document.querySelectorAll(".cache-tab");
const cacheMoreBtn = document.getElementById("cacheMoreBtn");
const cacheMoreMenu = document.getElementById("cacheMoreMenu");
const cachePanel = document.getElementById("cachePanel");

const cacheTabsData = CONFIG.cacheData;

cacheMoreBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    cacheMoreMenu.style.display =
        cacheMoreMenu.style.display === "block" ? "none" : "block";
});

document.addEventListener("click", (e) => {
    if (!cacheMoreBtn.contains(e.target) && !cacheMoreMenu.contains(e.target)) {
        cacheMoreMenu.style.display = "none";
    }
});

cacheMoreMenu.querySelectorAll("p").forEach(item => {
    item.addEventListener("click", () => {
        activateCacheTab(item.dataset.tab);
        cacheMoreMenu.style.display = "none";
    });
});

cacheTabs.forEach(tab => {
    tab.addEventListener("click", () => {
        activateCacheTab(tab.dataset.tab);
    });
});

function activateCacheTab(name) {
    cacheTabs.forEach(t => t.classList.remove("active"));
    cacheMoreMenu.querySelectorAll("p").forEach(p => p.classList.remove("active"));

    const mainTab = [...cacheTabs].find(t => t.dataset.tab === name);
    if (mainTab) {
        mainTab.classList.add("active");
    } else {
        const menuItem = [...cacheMoreMenu.querySelectorAll("p")].find(p => p.dataset.tab === name);
        if (menuItem) menuItem.classList.add("active");
    }

    renderCachePanel(name);
}

function renderCachePanel(name) {
    cachePanel.innerHTML = "";
    cachePanel.classList.add("active");

    const data = cacheTabsData[name];

    if (!data) {
        cachePanel.innerHTML = `<div class="cache-empty">No data</div>`;
        return;
    }

    cachePanel.innerHTML = `
        <div class="cache-stats-row">
            <div class="cache-stat">
                <p class="cache-stat-title">Total</p>
                <p class="cache-stat-value">${data.total}</p>
            </div>

            <div class="cache-stat">
                <p class="cache-stat-title">
                <span class="dot dot-lightblue"></span> Served by origin
                </p>
                <p class="cache-stat-value">${data.origin}</p>
            </div>

            <div class="cache-stat">
                <p class="cache-stat-title">
                <span class="dot dot-blue"></span> Served by Trafficmind
                </p>
                <p class="cache-stat-value">${data.tm}</p>
            </div>
        </div>

        <div class="cache-chart-box">
            <canvas id="cachingChart"></canvas>
        </div>
    `;

    renderCachingChart(data.originChart, data.tmChart);
}

function renderCachingChart(originData, tmData) {
    const ctx = document.getElementById("cachingChart");
    if (!ctx) return;

    new Chart(ctx, {
        type: "line",
        data: {
            datasets: [
                {
                    label: "Served by origin",
                    data: originData,
                    borderColor: CONFIG.cacheOriginBorderColor,
                    backgroundColor: CONFIG.cacheChartBackgroundColor,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0
                },
                {
                    label: "Served by Trafficmind",
                    data: tmData,
                    borderColor: CONFIG.cacheTrafficmindBorderColor,
                    backgroundColor: CONFIG.cacheChartBackgroundColor,
                    fill: false,
                    tension: 0.4,
                    pointRadius: 0
                }
            ]
        },
        options: CONFIG.cacheChartOptions
    });
}

renderCachePanel("served");
