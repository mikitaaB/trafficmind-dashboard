const menuBtn = document.getElementById('menuBtn');
const menuDropdown = document.getElementById('menuDropdown');
const profileBtn = document.getElementById('profileBtn');
const profileMenu = document.getElementById('profileMenu');
const cacheMoreBtn = document.getElementById("cacheMoreBtn");
const cacheMoreMenu = document.getElementById("cacheMoreMenu");

function closeMenu(triggerEl, menuEl, { deactivateTrigger = false, focusTrigger = false } = {}) {
    if (!triggerEl || !menuEl) return;
    menuEl.classList.remove("open");
    if (deactivateTrigger) triggerEl.classList.remove("active");
    triggerEl.setAttribute("aria-expanded", "false");
    if (triggerEl.dataset?.labelOpen) triggerEl.setAttribute("aria-label", triggerEl.dataset.labelOpen);
    if (focusTrigger) triggerEl.focus();
}

function openMenu(triggerEl, menuEl) {
    if (!triggerEl || !menuEl) return;
    menuEl.classList.add("open");
    triggerEl.setAttribute("aria-expanded", "true");
    if (triggerEl.dataset?.labelClose) triggerEl.setAttribute("aria-label", triggerEl.dataset.labelClose);
}

menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    menuBtn.classList.toggle('active');
    const willOpen = !menuDropdown.classList.contains("open");
    if (willOpen) openMenu(menuBtn, menuDropdown);
    else closeMenu(menuBtn, menuDropdown, { deactivateTrigger: true });
});

profileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const willOpen = !profileMenu.classList.contains("open");
    if (willOpen) openMenu(profileBtn, profileMenu);
    else closeMenu(profileBtn, profileMenu);
});

document.addEventListener('click', (e) => {
    if (!menuDropdown.contains(e.target) && !menuBtn.contains(e.target)) {
        closeMenu(menuBtn, menuDropdown, { deactivateTrigger: true });
    }

    if (!profileMenu.contains(e.target) && !profileBtn.contains(e.target)) {
        closeMenu(profileBtn, profileMenu);
    }

    if (!cacheMoreBtn.contains(e.target) && !cacheMoreMenu.contains(e.target)) {
        closeMenu(cacheMoreBtn, cacheMoreMenu);
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const wasMenuOpen = menuDropdown.classList.contains("open");
        const wasProfileOpen = profileMenu.classList.contains("open");
        const wasCacheMoreOpen = cacheMoreMenu?.classList.contains("open");

        closeMenu(menuBtn, menuDropdown, { deactivateTrigger: true, focusTrigger: wasMenuOpen });
        closeMenu(profileBtn, profileMenu, { focusTrigger: !wasMenuOpen && wasProfileOpen });
        closeMenu(cacheMoreBtn, cacheMoreMenu, { focusTrigger: !wasMenuOpen && !wasProfileOpen && wasCacheMoreOpen });
    }
});

menuDropdown.querySelectorAll(".menu-item").forEach((item) => {
    item.addEventListener("click", () => {
        closeMenu(menuBtn, menuDropdown, { deactivateTrigger: true, focusTrigger: true });
    });
});

profileMenu.querySelectorAll(".menu-item").forEach((item) => {
    item.addEventListener("click", () => {
        closeMenu(profileBtn, profileMenu, { focusTrigger: true });
    });
});

const cacheTabs = document.querySelectorAll(".cache-tab");
const cachePanel = document.getElementById("cachePanel");

const cacheTabsData = CONFIG.cacheData;

cacheMoreBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const willOpen = !cacheMoreMenu.classList.contains("open");
    if (willOpen) openMenu(cacheMoreBtn, cacheMoreMenu);
    else closeMenu(cacheMoreBtn, cacheMoreMenu);
});

cacheMoreMenu.querySelectorAll("button").forEach(item => {
    item.addEventListener("click", () => {
        activateCacheTab(item.dataset.tab);
        closeMenu(cacheMoreBtn, cacheMoreMenu, { focusTrigger: true });
    });
});

cacheTabs.forEach(tab => {
    tab.addEventListener("click", () => {
        activateCacheTab(tab.dataset.tab);
    });
});

function activateCacheTab(name) {
    cacheTabs.forEach(t => t.classList.remove("active"));
    cacheMoreMenu.querySelectorAll("button").forEach(p => p.classList.remove("active"));

    const mainTab = [...cacheTabs].find(t => t.dataset.tab === name);
    if (mainTab) {
        mainTab.classList.add("active");
    } else {
        const menuItem = [...cacheMoreMenu.querySelectorAll("button")].find(p => p.dataset.tab === name);
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

renderTrafficCharts();
renderCachePanel("served");

window.addEventListener("resize", () => {
    renderTrafficCharts();
    const activeTab = document.querySelector(".cache-tab.active")?.dataset.tab || "served";
    renderCachePanel(activeTab);
});
