const menuBtn = document.getElementById('menuBtn');
const menuDropdown = document.getElementById('menuDropdown');
const profileBtn = document.getElementById('profileBtn');
const profileMenu = document.getElementById('profileMenu');
const cacheMoreBtn = document.getElementById("cacheMoreBtn");
const cacheMoreMenu = document.getElementById("cacheMoreMenu");

function closeMenu(triggerEl, menuEl, { deactivateTrigger = false, focusTrigger = false } = {}) {
    if (!triggerEl || !menuEl) return;
    menuEl.classList.remove("open");
    if (deactivateTrigger) {
        triggerEl.classList.remove("active");
    }
    triggerEl.setAttribute("aria-expanded", "false");
    if (triggerEl.dataset?.labelOpen) {
        triggerEl.setAttribute("aria-label", triggerEl.dataset.labelOpen);
    }
    if (focusTrigger) {
        triggerEl.focus();
    }
}

function openMenu(triggerEl, menuEl) {
    if (!triggerEl || !menuEl) return;
    menuEl.classList.add("open");
    triggerEl.setAttribute("aria-expanded", "true");
    if (triggerEl.dataset?.labelClose) {
        triggerEl.setAttribute("aria-label", triggerEl.dataset.labelClose);
    }
}

menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    menuBtn.classList.toggle('active');
    const isMenuOpen = !menuDropdown.classList.contains("open");
    isMenuOpen
        ? openMenu(menuBtn, menuDropdown)
        : closeMenu(menuBtn, menuDropdown, {
            deactivateTrigger: true
        });
});

profileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isProfileMenuOpen = !profileMenu.classList.contains("open");
    isProfileMenuOpen
        ? openMenu(profileBtn, profileMenu)
        : closeMenu(profileBtn, profileMenu);
});

document.addEventListener('click', (e) => {
    if (!menuDropdown.contains(e.target) && !menuBtn.contains(e.target)) {
        closeMenu(menuBtn, menuDropdown, {
            deactivateTrigger: true
        });
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
        const isMenuOpen = menuDropdown.classList.contains("open");
        const isProfileMenuOpen = profileMenu.classList.contains("open");
        const isCacheMoreOpen = cacheMoreMenu?.classList.contains("open");

        closeMenu(menuBtn, menuDropdown, {
            deactivateTrigger: true,
            focusTrigger: isMenuOpen
        }
        );
        closeMenu(profileBtn, profileMenu, {
            focusTrigger: !isMenuOpen && isProfileMenuOpen
        });
        closeMenu(cacheMoreBtn, cacheMoreMenu, {
            focusTrigger: !isMenuOpen && !isProfileMenuOpen && isCacheMoreOpen
        });
    }
});

menuDropdown.querySelectorAll(".dropdown__item").forEach(item => {
    item.addEventListener("click", () => {
        closeMenu(menuBtn, menuDropdown, {
            deactivateTrigger: true,
            focusTrigger: true
        });
    });
});

profileMenu.querySelectorAll(".dropdown__item").forEach(item => {
    item.addEventListener("click", () => {
        closeMenu(profileBtn, profileMenu, {
            focusTrigger: true
        });
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
    const isCacheMenuOpen = !cacheMoreMenu.classList.contains("open");
    isCacheMenuOpen
        ? openMenu(cacheMoreBtn, cacheMoreMenu)
        : closeMenu(cacheMoreBtn, cacheMoreMenu);
});

cacheMoreMenu.querySelectorAll("button").forEach(item => {
    item.addEventListener("click", () => {
        activateCacheTab(item.dataset.tab);
        closeMenu(cacheMoreBtn, cacheMoreMenu, {
            focusTrigger: true
        });
    });
});

cacheTabs.forEach(tab => {
    tab.addEventListener("click", () => {
        activateCacheTab(tab.dataset.tab);
    });
});

function activateCacheTab(name) {
    cacheTabs.forEach(t => t.classList.remove("active"));
    cacheMoreMenu.querySelectorAll("button").forEach(btn => btn.classList.remove("active"));

    const mainTab = [...cacheTabs].find(tab => tab.dataset.tab === name);
    if (mainTab) {
        mainTab.classList.add("active");
    } else {
        const menuItem = [...cacheMoreMenu.querySelectorAll("button")].find(btn => btn.dataset.tab === name);
        if (menuItem) {
            menuItem.classList.add("active");
        }
    }

    renderCachePanel(name);
}

function renderCachePanel(name) {
    cachePanel.classList.add("active");
    const data = cacheTabsData[name];
    const {
        total = "0",
        origin = "0",
        tm = "0",
        originChart = [],
        tmChart = [],
    } = data ?? {};

    updateCacheValue(cacheTotalValueEl, total);
    updateCacheValue(cacheOriginValueEl, origin);
    updateCacheValue(cacheTmValueEl, tm);

    renderCachingChart(originChart, tmChart);
}

function updateCacheValue(element, value) {
    if (element) {
        element.textContent = value;
    }
}

renderTrafficCharts();
renderCachePanel("served");

window.addEventListener("resize", () => {
    renderTrafficCharts();
    const activeTab = document.querySelector(".caching__tab.active")?.dataset.tab || "served";
    renderCachePanel(activeTab);
});
