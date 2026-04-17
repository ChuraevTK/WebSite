function isMobileDevice() {
    return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

const PAGE_COUNTS = { mobile: 32, desktop: 20 };
const CONTACT_EMAIL = "renatakhmerov@yahoo.com";
const CHAPTER_NAMES = {
    ru: ["Обложка", "Глава 1: Больше!", "Глава 2: Парафин", "Глава 3: К черту", "Глава 4: Флинт и старец", "Глава 5: Круговерть"],
    en: ["Cover", "Ch. 1: More!", "Ch. 2: Paraffin", "Ch. 3: To Hell", "Ch. 4: Flint", "Ch. 5: Whirlwind"],
    de: ["Cover", "Kap. 1: Mehr!", "Kap. 2: Paraffin", "Kap. 3: Zur Hölle", "Kap. 4: Flint", "Kap. 5: Wirbel"]
};

const issues = {
    1: { name: { ru: "Выпуск 1", en: "Issue 1", de: "Ausgabe 1" }, available: true },
    2: { name: { ru: "Выпуск 2", en: "Issue 2", de: "Ausgabe 2" }, available: false }
};

const t = {
    ru: {
        footer: "© Хроники пластической хирургии Эжена Знаменского. Все права защищены.",
        footerMenu: "Меню",
        menuFooter: "© 2026 Хроники пластической хирургии Эжена Знаменского",
        selChap: "Главы",
        soon: "Скоро",
        news: "Новости",
        n1: "Первый выпуск доступен",
        d1: "Все страницы первого выпуска уже на сайте. Нажмите, чтобы открыть выпуск.",
        d1Date: "15 марта 2026",
        n2: "Идёт перевод комикса на другие языки",
        d2: "Готовятся локализованные версии на английском и немецком языках.",
        d2More1: "Наши переводчики вовсю трудятся над переводом комикса.",
        d2More2: "После завершения перевода переключение между языковыми версиями будет доступно через меню сайта.",
        d2Date: "10 апреля 2026",
        contacts: "Наши контакты",
        cDesc: "Вопросы, предложения, отзывы — напишите нам!",
        home: "На главную",
        newsT: "Новости",
        contactsT: "Контакты",
        footerBrand: "Хроники пластической хирургии",
        footerDesc: "Комикс о медицине, людях и странных историях из практики.",
        footerContactLabel: "Контакты",
        dark: "Темная тема",
        light: "Светлая тема",
        system: "Системная тема",
        stt: "В начало"
    },
    en: {
        footer: "© Eugene Znamensky. All rights reserved.",
        footerMenu: "Menu",
        menuFooter: "© 2026 Eugene Znamensky",
        selChap: "Chapters",
        soon: "Soon",
        news: "News",
        n1: "Issue 1 Is Available",
        d1: "All pages of the first issue are already on the site. Click to open the issue.",
        d1Date: "March 15, 2026",
        n2: "Comic Translation Is in Progress",
        d2: "Localized English and German versions are currently being prepared.",
        d2More1: "Our translators are working hard on the comic translation.",
        d2More2: "Once the translation is complete, switching between language versions will be available through the site menu.",
        d2Date: "April 10, 2026",
        contacts: "Contact the Author",
        cDesc: "Questions, suggestions, or feedback — write to us!",
        home: "Home",
        newsT: "News",
        contactsT: "Contacts",
        footerBrand: "Plastic Surgery Chronicles",
        footerDesc: "A comic about medicine, people, and the strange stories that happen in practice.",
        footerContactLabel: "Contact",
        dark: "Dark theme",
        light: "Light theme",
        system: "System theme",
        stt: "Back to top"
    },
    de: {
        footer: "© Eugen Znamenski. Alle Rechte vorbehalten.",
        footerMenu: "Menü",
        menuFooter: "© 2026 Eugen Znamenski",
        selChap: "Kapitel",
        soon: "Demnächst",
        news: "News",
        n1: "Ausgabe 1 ist verfügbar",
        d1: "Alle Seiten der ersten Ausgabe sind bereits auf der Website. Klicke, um die Ausgabe zu öffnen.",
        d1Date: "15. März 2026",
        n2: "Die Übersetzung des Comics läuft",
        d2: "Lokalisierte englische und deutsche Versionen werden derzeit vorbereitet.",
        d2More1: "Unsere Übersetzer arbeiten mit Hochdruck an der Übersetzung des Comics.",
        d2More2: "Nach Abschluss der Übersetzung wird der Wechsel zwischen den Sprachversionen über das Website-Menü verfügbar sein.",
        d2Date: "10. April 2026",
        contacts: "Kontakt mit dem Autor",
        cDesc: "Fragen, Vorschläge oder Feedback — schreiben Sie uns!",
        home: "Startseite",
        newsT: "News",
        contactsT: "Kontakte",
        footerBrand: "Chroniken der plastischen Chirurgie",
        footerDesc: "Ein Comic über Medizin, Menschen und seltsame Geschichten aus der Praxis.",
        footerContactLabel: "Kontakt",
        dark: "Dunkles Thema",
        light: "Helles Thema",
        system: "Systemthema",
        stt: "Nach oben"
    }
};

let isMobile = isMobileDevice();
let totalPages = isMobile ? PAGE_COUNTS.mobile : PAGE_COUNTS.desktop;
let allPages = [];
let chapters = [];
let currentLang = localStorage.getItem("comic-lang") || "ru";
let currentIssue = 1;
let currentSwiper = null;
let resizeTimer = null;

const els = {
    html: document.documentElement,
    body: document.body,
    footerText: document.getElementById("footerText"),
    footerBrandText: document.getElementById("footerBrandText"),
    footerDescText: document.getElementById("footerDescText"),
    footerMenuLabel: document.getElementById("footerMenuLabel"),
    footerContactLabel: document.getElementById("footerContactLabel"),
    footerHomeLink: document.getElementById("footerHomeLink"),
    footerNewsLink: document.getElementById("footerNewsLink"),
    footerContactsLink: document.getElementById("footerContactsLink"),
    footerEmailLink: document.getElementById("footerEmailLink"),
    contactEmailLink: document.getElementById("contactEmailLink"),
    menuFooterText: document.getElementById("menuFooterText"),
    newsTitle: document.getElementById("newsTitle"),
    news1Title: document.getElementById("news1Title"),
    news1Desc: document.getElementById("news1Desc"),
    news1Date: document.getElementById("news1Date"),
    news2Title: document.getElementById("news2Title"),
    news2Desc: document.getElementById("news2Desc"),
    news2More1: document.getElementById("news2More1"),
    news2More2: document.getElementById("news2More2"),
    news2Date: document.getElementById("news2Date"),
    newsIssue1Link: document.getElementById("newsIssue1Link"),
    newsLangEntry: document.getElementById("newsLangEntry"),
    newsLangToggle: document.getElementById("newsLangToggle"),
    newsLangDetailsWrap: document.getElementById("newsLangDetailsWrap"),
    contactsTitle: document.getElementById("contactsTitle"),
    contactsDesc: document.getElementById("contactsDesc"),
    scrollToTopBtn: document.getElementById("scrollToTopBtn"),
    homeMenuText: document.getElementById("homeMenuText"),
    newsMenuText: document.getElementById("newsMenuText"),
    contactsMenuText: document.getElementById("contactsMenuText"),
    themeText: document.getElementById("themeText"),
    themeIconImg: document.getElementById("themeIconImg"),
    selectedIssue: document.getElementById("selectedIssue"),
    selectedChapter: document.getElementById("selectedChapter"),
    headerThemeToggle: document.getElementById("headerThemeToggle"),
    issueSelector: document.getElementById("issueSelector"),
    chapterSelector: document.getElementById("chapterSelector"),
    issueDropdown: document.getElementById("issueDropdown"),
    chapterDropdown: document.getElementById("chapterDropdown"),
    swiperWrapper: document.getElementById("swiperWrapper"),
    sideMenu: document.getElementById("sideMenu"),
    menuOverlay: document.getElementById("menuOverlay"),
    mainPage: document.getElementById("mainPage")
};

const systemDarkMedia = window.matchMedia("(prefers-color-scheme: dark)");

const getPagePath = (pageNumber) => (
    isMobile
        ? `images/comics/Комикс Выпуск №1 стр ${pageNumber}.jpg`
        : `images/comics/Комикс Выпуск №1_стр${pageNumber}.jpg`
);

function setText(element, value) {
    if (element) element.textContent = value;
}

function syncContactEmail() {
    const mailto = `mailto:${CONTACT_EMAIL}`;

    if (els.contactEmailLink) {
        els.contactEmailLink.href = mailto;
    }

    if (els.footerEmailLink) {
        els.footerEmailLink.href = mailto;
        els.footerEmailLink.textContent = CONTACT_EMAIL;
    }
}


function syncTranslationNewsHeight() {
    if (!els.newsLangDetailsWrap) return;

    if (els.newsLangEntry?.classList.contains("is-open")) {
        els.newsLangDetailsWrap.style.maxHeight = `${els.newsLangDetailsWrap.scrollHeight}px`;
    } else {
        els.newsLangDetailsWrap.style.maxHeight = "0px";
    }
}

function updateAllPages() {
    allPages = Array.from({ length: totalPages }, (_, index) => getPagePath(index + 1));
}

function updateChapters() {
    const ranges = isMobile
        ? [{ s: 0, e: 2 }, { s: 3, e: 5 }, { s: 6, e: 10 }, { s: 11, e: 16 }, { s: 17, e: 21 }, { s: 22, e: 31 }]
        : [{ s: 0, e: 1 }, { s: 2, e: 3 }, { s: 4, e: 6 }, { s: 7, e: 10 }, { s: 11, e: 13 }, { s: 14, e: 17 }];

    chapters = ranges.map((range, index) => ({
        ...range,
        name: {
            ru: CHAPTER_NAMES.ru[index],
            en: CHAPTER_NAMES.en[index],
            de: CHAPTER_NAMES.de[index]
        }
    }));
}

function getCurrentChapter() {
    if (!currentSwiper || !chapters.length) return null;
    const index = currentSwiper.activeIndex;
    return chapters.find((chapter) => index >= chapter.s && index <= chapter.e) || null;
}

function updateCurrentChapterLabel() {
    const chapter = getCurrentChapter();
    setText(els.selectedChapter, chapter ? chapter.name[currentLang] : t[currentLang].selChap);
}

function updateHeaderThemeToggle() {
    if (!els.headerThemeToggle) return;
    const savedTheme = localStorage.getItem("comic-theme") || "system";
    els.headerThemeToggle.setAttribute("data-theme-mode", savedTheme);
}

function renderIssueDropdown() {
    if (!els.issueDropdown) return;

    els.issueDropdown.innerHTML = "";

    Object.entries(issues).forEach(([id, issue]) => {
        const option = document.createElement("div");
        option.className = "select-option";
        option.textContent = issue.name[currentLang] + (issue.available ? "" : ` (${t[currentLang].soon})`);

        if (!issue.available) {
            option.classList.add("disabled");
        } else {
            option.addEventListener("click", () => {
                const nextIssue = Number(id);

                if (nextIssue === currentIssue) {
                    els.issueSelector?.classList.remove("open");
                    return;
                }

                currentIssue = nextIssue;
                setText(els.selectedIssue, issue.name[currentLang]);
                loadComic(true);
                els.issueSelector?.classList.remove("open");
            });
        }

        els.issueDropdown.appendChild(option);
    });
}

function renderChapterDropdown() {
    if (!els.chapterDropdown) return;

    els.chapterDropdown.innerHTML = "";

    chapters.forEach((chapter) => {
        const option = document.createElement("div");
        option.className = "select-option";
        option.textContent = chapter.name[currentLang];

        option.addEventListener("click", () => {
            currentSwiper?.slideTo(chapter.s, 400);
            els.chapterSelector?.classList.remove("open");
        });

        els.chapterDropdown.appendChild(option);
    });
}

function updateLang() {
    const langPack = t[currentLang];

    els.html.lang = currentLang;

    setText(els.footerText, langPack.footer);
    setText(els.footerMenuLabel, langPack.footerMenu);
    setText(els.footerContactLabel, langPack.footerContactLabel);
    setText(els.footerHomeLink, langPack.home);
    setText(els.footerNewsLink, langPack.newsT);
    setText(els.footerContactsLink, langPack.contactsT);
    setText(els.menuFooterText, langPack.menuFooter);
    setText(els.newsTitle, langPack.news);
    setText(els.news1Title, langPack.n1);
    setText(els.news1Desc, langPack.d1);
    setText(els.news1Date, langPack.d1Date);
    setText(els.news2Title, langPack.n2);
    setText(els.news2Desc, langPack.d2);
    setText(els.news2More1, langPack.d2More1);
    setText(els.news2More2, langPack.d2More2);
    setText(els.news2Date, langPack.d2Date);
    setText(els.contactsTitle, langPack.contacts);
    setText(els.contactsDesc, langPack.cDesc);
    setText(els.scrollToTopBtn, langPack.stt);
    setText(els.homeMenuText, langPack.home);
    setText(els.newsMenuText, langPack.newsT);
    setText(els.contactsMenuText, langPack.contactsT);
    setText(els.selectedIssue, issues[currentIssue].name[currentLang]);

    const savedTheme = localStorage.getItem("comic-theme") || "system";
    const isDarkTheme = els.body.classList.contains("dark-theme");
    setText(els.themeText, savedTheme === "system" ? langPack.system : (isDarkTheme ? langPack.dark : langPack.light));

    document.querySelectorAll(".menu-lang-option").forEach((option) => {
        option.classList.toggle("active", option.dataset.lang === currentLang);
    });

    renderIssueDropdown();
    renderChapterDropdown();
    updateCurrentChapterLabel();
    updateHeaderThemeToggle();
    syncTranslationNewsHeight();
}

function setTheme(theme) {
    const langPack = t[currentLang];
    localStorage.setItem("comic-theme", theme);

    if (theme === "dark") {
        els.body.classList.add("dark-theme");
        setText(els.themeText, langPack.dark);
        if (els.themeIconImg) els.themeIconImg.src = "images/icons/Луна.svg";
    } else if (theme === "light") {
        els.body.classList.remove("dark-theme");
        setText(els.themeText, langPack.light);
        if (els.themeIconImg) els.themeIconImg.src = "images/icons/Солнце.svg";
    } else {
        els.body.classList.toggle("dark-theme", systemDarkMedia.matches);
        setText(els.themeText, langPack.system);
        if (els.themeIconImg) els.themeIconImg.src = "images/icons/Системная тема.svg";
    }

    updateHeaderThemeToggle();
    refreshSwiper(50);
}

function toggleTheme() {
    const savedTheme = localStorage.getItem("comic-theme") || "system";
    const nextTheme = savedTheme === "light" ? "dark" : savedTheme === "dark" ? "system" : "light";
    setTheme(nextTheme);
}

function detectTheme() {
    setTheme(localStorage.getItem("comic-theme") || "system");
}

function destroySwiper() {
    if (!currentSwiper) return;
    currentSwiper.destroy(true, true);
    currentSwiper = null;
}

function buildSlides() {
    if (!els.swiperWrapper) return;

    els.swiperWrapper.innerHTML = "";

    allPages.forEach((path, index) => {
        const slide = document.createElement("div");
        slide.className = "swiper-slide comic-slide";

        const zoomContainer = document.createElement("div");
        zoomContainer.className = "swiper-zoom-container";

        const image = document.createElement("img");
        image.src = path;
        image.alt = `Страница ${index + 1}`;
        image.loading = index < 2 ? "eager" : "lazy";
        image.decoding = "async";
        image.draggable = false;

        zoomContainer.appendChild(image);
        slide.appendChild(zoomContainer);
        els.swiperWrapper.appendChild(slide);
    });
}

function checkScroll() {
    if (!els.scrollToTopBtn || !currentSwiper) return;
    els.scrollToTopBtn.classList.toggle("show", currentSwiper.activeIndex >= totalPages - 1);
}

function refreshSwiper(delay = 0) {
    if (!currentSwiper) return;

    window.setTimeout(() => {
        if (!currentSwiper) return;
        currentSwiper.update();
        attachCustomMobileZoom();
        checkScroll();
        updateCurrentChapterLabel();
    }, delay);
}

/* ========= CUSTOM MOBILE ZOOM ========= */
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function getTouchDistance(t1, t2) {
    return Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
}

function getTouchMidpoint(t1, t2) {
    return {
        x: (t1.clientX + t2.clientX) / 2,
        y: (t1.clientY + t2.clientY) / 2
    };
}

function resetAllCustomZooms() {
    const containers = [
        document.querySelector(".swiper-slide-active .swiper-zoom-container"),
        document.querySelector(".swiper-slide-prev .swiper-zoom-container"),
        document.querySelector(".swiper-slide-next .swiper-zoom-container")
    ];

    containers.forEach((container) => {
        if (container && typeof container.__resetZoom === "function") {
            container.__resetZoom(true);
        }
    });

    els.body.classList.remove("stop-scrolling");

    if (currentSwiper) {
        currentSwiper.allowTouchMove = true;
    }
}

function attachCustomMobileZoom() {
    if (!isMobile) return;

    document.querySelectorAll(".swiper-zoom-container").forEach((container) => {
        if (container.dataset.customZoomReady === "1") return;

        const image = container.querySelector("img");
        if (!image) return;

        container.dataset.customZoomReady = "1";

        const state = {
            scale: 1,
            x: 0,
            y: 0,
            startScale: 1,
            startDistance: 0,
            startMidX: 0,
            startMidY: 0,
            startX: 0,
            startY: 0,
            panStartX: 0,
            panStartY: 0
        };

        const applyTransform = (animate = false) => {
            image.style.transition = animate ? "transform 0.22s ease-out" : "none";
            image.style.transform = `translate3d(${state.x}px, ${state.y}px, 0) scale(${state.scale})`;
        };

        const clampTranslation = () => {
            const rect = container.getBoundingClientRect();
            const maxX = Math.max(0, (rect.width * state.scale - rect.width) / 2);
            const maxY = Math.max(0, (rect.height * state.scale - rect.height) / 2);

            state.x = clamp(state.x, -maxX, maxX);
            state.y = clamp(state.y, -maxY, maxY);
        };

        const lockOuter = () => {
            els.body.classList.add("stop-scrolling");
            if (currentSwiper) currentSwiper.allowTouchMove = false;
        };

        const unlockOuter = () => {
            els.body.classList.remove("stop-scrolling");
            if (currentSwiper) currentSwiper.allowTouchMove = true;
        };

        const resetZoom = (animate = true) => {
            state.scale = 1;
            state.x = 0;
            state.y = 0;
            applyTransform(animate);
            unlockOuter();
        };

        container.__resetZoom = resetZoom;

        container.addEventListener("touchstart", (event) => {
            if (event.touches.length === 2) {
                const [t1, t2] = event.touches;
                state.startDistance = getTouchDistance(t1, t2);
                state.startScale = state.scale;

                const mid = getTouchMidpoint(t1, t2);
                state.startMidX = mid.x;
                state.startMidY = mid.y;
                state.startX = state.x;
                state.startY = state.y;

                lockOuter();
                event.preventDefault();
            } else if (event.touches.length === 1 && state.scale > 1.01) {
                const touch = event.touches[0];
                state.panStartX = touch.clientX - state.x;
                state.panStartY = touch.clientY - state.y;

                lockOuter();
                event.preventDefault();
            }
        }, { passive: false });

        container.addEventListener("touchmove", (event) => {
            if (event.touches.length === 2) {
                const [t1, t2] = event.touches;
                const distance = getTouchDistance(t1, t2);
                const mid = getTouchMidpoint(t1, t2);

                state.scale = clamp(state.startScale * (distance / state.startDistance), 1, 3);
                state.x = state.startX + (mid.x - state.startMidX);
                state.y = state.startY + (mid.y - state.startMidY);

                clampTranslation();
                applyTransform(false);
                lockOuter();
                event.preventDefault();
            } else if (event.touches.length === 1 && state.scale > 1.01) {
                const touch = event.touches[0];
                state.x = touch.clientX - state.panStartX;
                state.y = touch.clientY - state.panStartY;

                clampTranslation();
                applyTransform(false);
                lockOuter();
                event.preventDefault();
            }
        }, { passive: false });

        container.addEventListener("touchend", (event) => {
            if (event.touches.length === 1 && state.scale > 1.01) {
                const touch = event.touches[0];
                state.panStartX = touch.clientX - state.x;
                state.panStartY = touch.clientY - state.y;
                event.preventDefault();
                return;
            }

            if (event.touches.length === 0 && state.scale > 1.01) {
                resetZoom(true);
            } else if (event.touches.length === 0) {
                unlockOuter();
            }
        }, { passive: false });

        container.addEventListener("touchcancel", () => {
            resetZoom(true);
        }, { passive: true });
    });
}
/* ========= END CUSTOM MOBILE ZOOM ========= */

function initSwiper(initialSlide = 0) {
    destroySwiper();

    currentSwiper = new Swiper(".comic-swiper", {
        slidesPerView: 1,
        centeredSlides: true,
        spaceBetween: 0,
        grabCursor: !isMobile,
        autoHeight: false,
        initialSlide,
        preloadImages: false,
        updateOnWindowResize: true,
        resistanceRatio: 0.85,
        touchStartPreventDefault: false,
        observer: false,
        observeParents: false,
        observeSlideChildren: false,
        watchSlidesProgress: false,
        maxBackfaceHiddenSlides: 2,

        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev"
        },

        pagination: {
            el: ".swiper-pagination",
            type: "fraction"
        },

        on: {
            init() {
                attachCustomMobileZoom();
                checkScroll();
                updateCurrentChapterLabel();
            },
            slideChange() {
                resetAllCustomZooms();
                checkScroll();
                updateCurrentChapterLabel();
            },
            transitionEnd() {
                checkScroll();
                updateCurrentChapterLabel();
            }
        }
    });

    refreshSwiper(120);
}

function loadComic(preserveSlide = false) {
    updateChapters();
    updateAllPages();

    const initialSlide = preserveSlide && currentSwiper ? currentSwiper.activeIndex : 0;

    buildSlides();
    initSwiper(initialSlide);
    updateCurrentChapterLabel();
}

function openMenu() {
    els.sideMenu?.classList.add("open");
    els.menuOverlay?.classList.add("active");
    els.body.style.overflow = "hidden";
}

function closeMenu() {
    els.sideMenu?.classList.remove("open");
    els.menuOverlay?.classList.remove("active");
    els.body.style.overflow = "";
}

function showPage(pageId) {
    resetAllCustomZooms();

    document.querySelectorAll(".page").forEach((page) => page.classList.remove("active"));
    document.getElementById(pageId)?.classList.add("active");
    closeMenu();

    if (pageId === "mainPage") {
        [80, 220].forEach(refreshSwiper);
    }
}

function setLang(lang) {
    currentLang = lang;
    localStorage.setItem("comic-lang", lang);
    updateLang();
}

function scrollToStart() {
    resetAllCustomZooms();
    currentSwiper?.slideTo(0, 400);
}


function toggleTranslationNews(forceState) {
    if (!els.newsLangEntry || !els.newsLangToggle) return;

    const shouldOpen = typeof forceState === "boolean"
        ? forceState
        : !els.newsLangEntry.classList.contains("is-open");

    els.newsLangEntry.classList.toggle("is-open", shouldOpen);
    els.newsLangToggle.setAttribute("aria-expanded", String(shouldOpen));
    syncTranslationNewsHeight();
}


function openIssueFromNews() {
    showPage("mainPage");

    window.setTimeout(() => {
        currentSwiper?.slideTo(0, 400);
        updateCurrentChapterLabel();
    }, 100);
}

function handleResize() {
    clearTimeout(resizeTimer);

    resizeTimer = window.setTimeout(() => {
        const nextIsMobile = isMobileDevice();

        if (nextIsMobile !== isMobile) {
            isMobile = nextIsMobile;
            totalPages = isMobile ? PAGE_COUNTS.mobile : PAGE_COUNTS.desktop;
            loadComic(true);
            renderChapterDropdown();
            return;
        }

        if (currentSwiper && els.mainPage?.classList.contains("active")) {
            refreshSwiper();
        }

        syncTranslationNewsHeight();
    }, 180);
}

function init() {
    updateChapters();
    updateAllPages();
    detectTheme();
    updateLang();
    syncContactEmail();
    loadComic();
    syncTranslationNewsHeight();

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", () => window.setTimeout(handleResize, 150));
    window.addEventListener("load", () => [120, 400].forEach(refreshSwiper));

    systemDarkMedia.addEventListener("change", () => {
        if ((localStorage.getItem("comic-theme") || "system") === "system") {
            setTheme("system");
        }
    });

    els.scrollToTopBtn?.addEventListener("click", scrollToStart);

    els.headerThemeToggle?.querySelectorAll(".theme-toggle-segment").forEach((button) => {
        button.addEventListener("click", (event) => {
            event.stopPropagation();
            const theme = button.dataset.theme;
            if (theme) setTheme(theme);
        });
    });

    document.getElementById("burgerBtn")?.addEventListener("click", openMenu);
    document.getElementById("menuCloseBtn")?.addEventListener("click", closeMenu);
    els.menuOverlay?.addEventListener("click", closeMenu);
    document.getElementById("homeMenuItem")?.addEventListener("click", () => showPage("mainPage"));
    document.getElementById("newsMenuItem")?.addEventListener("click", () => showPage("newsPage"));
    document.getElementById("contactsMenuItem")?.addEventListener("click", () => showPage("contactsPage"));
    document.getElementById("homeLogo")?.addEventListener("click", () => showPage("mainPage"));
    els.footerHomeLink?.addEventListener("click", (event) => {
        event.preventDefault();
        showPage("mainPage");
    });
    els.footerNewsLink?.addEventListener("click", (event) => {
        event.preventDefault();
        showPage("newsPage");
    });
    els.footerContactsLink?.addEventListener("click", (event) => {
        event.preventDefault();
        showPage("contactsPage");
    });
    document.getElementById("menuThemeItem")?.addEventListener("click", (event) => {
        event.stopPropagation();
        toggleTheme();
    });

    els.issueSelector?.querySelector(".select-btn")?.addEventListener("click", (event) => {
        event.stopPropagation();
        els.issueSelector?.classList.toggle("open");
        els.chapterSelector?.classList.remove("open");
    });

    els.chapterSelector?.querySelector(".select-btn")?.addEventListener("click", (event) => {
        event.stopPropagation();
        els.chapterSelector?.classList.toggle("open");
        els.issueSelector?.classList.remove("open");
    });

    els.newsIssue1Link?.addEventListener("click", (event) => {
        event.preventDefault();
        openIssueFromNews();
    });

    els.newsLangEntry?.addEventListener("click", (event) => {
        event.preventDefault();
        toggleTranslationNews();
    });

    document.addEventListener("click", () => {
        els.issueSelector?.classList.remove("open");
        els.chapterSelector?.classList.remove("open");
    });

    document.querySelectorAll(".menu-lang-option").forEach((option) => {
        option.addEventListener("click", (event) => {
            event.stopPropagation();
            setLang(option.dataset.lang);
            closeMenu();
        });
    });
}

init();
