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

menuDropdown.querySelectorAll(".dropdown__item").forEach((item) => {
    item.addEventListener("click", () => {
        closeMenu(menuBtn, menuDropdown, { deactivateTrigger: true, focusTrigger: true });
    });
});

profileMenu.querySelectorAll(".dropdown__item").forEach((item) => {
    item.addEventListener("click", () => {
        closeMenu(profileBtn, profileMenu, { focusTrigger: true });
    });
});

const cacheTabs = document.querySelectorAll(".caching__tab");
const cachePanel = document.getElementById("cachePanel");
const cacheTotalValueEl = document.getElementById("cacheTotalValue");
const cacheOriginValueEl = document.getElementById("cacheOriginValue");
const cacheTmValueEl = document.getElementById("cacheTmValue");

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
    cachePanel.classList.add("active");

    const data = cacheTabsData[name];

    const total = data?.total ?? "0";
    const origin = data?.origin ?? "0";
    const tm = data?.tm ?? "0";

    if (cacheTotalValueEl) cacheTotalValueEl.textContent = total;
    if (cacheOriginValueEl) cacheOriginValueEl.textContent = origin;
    if (cacheTmValueEl) cacheTmValueEl.textContent = tm;

    const originChart = data?.originChart ?? [];
    const tmChart = data?.tmChart ?? [];

    renderCachingChart(originChart, tmChart);
}

renderTrafficCharts();
renderCachePanel("served");

window.addEventListener("resize", () => {
    renderTrafficCharts();
    const activeTab = document.querySelector(".caching__tab.active")?.dataset.tab || "served";
    renderCachePanel(activeTab);
});
