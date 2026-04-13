function isMobileDevice() {
    return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

let isMobile = isMobileDevice();
let totalPages = isMobile ? 32 : 20;

const getPagePath = (pageNumber) => {
    return isMobile
        ? `images/comics/Комикс Выпуск №1 стр ${pageNumber}.jpg`
        : `images/comics/Комикс Выпуск №1_стр${pageNumber}.jpg`;
};

let allPages = [];
let chapters = [];
let currentLang = localStorage.getItem('comic-lang') || 'ru';
let currentIssue = 1;
let currentSwiper = null;
let resizeTimer = null;

const issues = {
    1: { name: { ru: "Выпуск 1", en: "Issue 1", de: "Ausgabe 1" }, available: true },
    2: { name: { ru: "Выпуск 2", en: "Issue 2", de: "Ausgabe 2" }, available: false }
};

const t = {
    ru: {
        footer: "© 2026 Эжен Знаменский",
        selChap: "Главы",
        soon: "Скоро",
        news: "Новости",
        n1: "Второй выпуск в разработке",
        d1: "Работа над продолжением идет полным ходом.",
        d1_date: "15 марта 2026",
        n2: "Первый выпуск доступен",
        d2: "Все страницы первого выпуска уже на сайте.",
        d2_date: "1 марта 2026",
        contacts: "Связь с автором",
        cDesc: "Вопросы, отзывы — напишите!",
        home: "На главную",
        newsT: "Новости",
        contactsT: "Контакты",
        dark: "Темная тема",
        light: "Светлая тема",
        system: "Системная тема",
        stt: "В начало"
    },
    en: {
        footer: "© 2026 Eugene Znamensky",
        selChap: "Chapters",
        soon: "Soon",
        news: "News",
        n1: "Issue 2 in Progress",
        d1: "The sequel is well underway.",
        d1_date: "March 15, 2026",
        n2: "Issue 1 is Out Now",
        d2: "All pages are available for reading.",
        d2_date: "March 1, 2026",
        contacts: "Contact",
        cDesc: "Questions or feedback? Reach out!",
        home: "Home",
        newsT: "News",
        contactsT: "Contacts",
        dark: "Dark",
        light: "Light",
        system: "System",
        stt: "Back to top"
    },
    de: {
        footer: "© 2026 Eugen Znamenski",
        selChap: "Kapitel",
        soon: "Demnächst",
        news: "News",
        n1: "Ausgabe 2 in Arbeit",
        d1: "Die Fortsetzung ist in vollem Gange.",
        d1_date: "15. März 2026",
        n2: "Ausgabe 1 verfügbar",
        d2: "Alle Seiten sind jetzt online.",
        d2_date: "1. März 2026",
        contacts: "Kontakt",
        cDesc: "Fragen? Schreib mir einfach!",
        home: "Startseite",
        newsT: "News",
        contactsT: "Kontakte",
        dark: "Dunkel",
        light: "Hell",
        system: "System",
        stt: "Nach oben"
    }
};

function updateAllPages() {
    allPages = [];
    for (let i = 1; i <= totalPages; i++) {
        allPages.push(getPagePath(i));
    }
}

function updateChapters() {
    if (isMobile) {
        chapters = [
            { s: 0, e: 2 }, { s: 3, e: 5 }, { s: 6, e: 10 },
            { s: 11, e: 16 }, { s: 17, e: 21 }, { s: 22, e: 31 }
        ];
    } else {
        chapters = [
            { s: 0, e: 1 }, { s: 2, e: 3 }, { s: 4, e: 6 },
            { s: 7, e: 10 }, { s: 11, e: 13 }, { s: 14, e: 17 }
        ];
    }

    const namesRu = ["Обложка", "Глава 1: Больше!", "Глава 2: Парафин", "Глава 3: К черту", "Глава 4: Флинт и старец", "Глава 5: Круговерть"];
    const namesEn = ["Cover", "Ch.1: More!", "Ch.2: Paraffin", "Ch.3: To Hell", "Ch.4: Flint", "Ch.5: Whirlwind"];
    const namesDe = ["Cover", "Kap.1: Mehr!", "Kap.2: Paraffin", "Kap.3: Zur Hölle", "Kap.4: Flint", "Kap.5: Wirbel"];

    chapters.forEach((c, i) => {
        c.name = { ru: namesRu[i], en: namesEn[i], de: namesDe[i] };
    });
}

function updateIconColors() {
    const isDark = document.body.classList.contains('dark-theme');
    const icons = document.querySelectorAll('.menu-icon, .contact-card img');
    icons.forEach(icon => {
        icon.style.filter = isDark ? 'brightness(0) invert(1)' : 'brightness(0)';
    });
}

function renderIssueDropdown() {
    const dropdown = document.getElementById('issueDropdown');
    if (!dropdown) return;

    dropdown.innerHTML = '';

    for (const id in issues) {
        const opt = document.createElement('div');
        opt.className = 'select-option';

        if (!issues[id].available) {
            opt.classList.add('disabled');
        }

        opt.innerHTML = issues[id].name[currentLang] + (!issues[id].available ? ` (${t[currentLang].soon})` : '');

        if (issues[id].available) {
            opt.onclick = () => {
                if (parseInt(id, 10) !== currentIssue) {
                    currentIssue = parseInt(id, 10);
                    document.getElementById('selectedIssue').innerHTML = issues[id].name[currentLang];
                    loadComic(true);
                    document.getElementById('issueSelector').classList.remove('open');
                }
            };
        }

        dropdown.appendChild(opt);
    }
}

function renderChapterDropdown() {
    const dropdown = document.getElementById('chapterDropdown');
    if (!dropdown) return;

    dropdown.innerHTML = '';

    chapters.forEach((chapter) => {
        const opt = document.createElement('div');
        opt.className = 'select-option';
        opt.innerHTML = chapter.name[currentLang];
        opt.onclick = () => {
            if (currentSwiper) currentSwiper.slideTo(chapter.s, 400);
            document.getElementById('chapterSelector').classList.remove('open');
        };
        dropdown.appendChild(opt);
    });
}

function updateLang() {
    const l = t[currentLang];

    document.getElementById('footerText').innerHTML = l.footer;
    document.getElementById('selectedChapter').innerHTML = l.selChap;
    document.getElementById('newsTitle').innerHTML = l.news;
    document.getElementById('news1Title').innerHTML = l.n1;
    document.getElementById('news1Desc').innerHTML = l.d1;
    document.getElementById('news1Date').innerHTML = l.d1_date;
    document.getElementById('news2Title').innerHTML = l.n2;
    document.getElementById('news2Desc').innerHTML = l.d2;
    document.getElementById('news2Date').innerHTML = l.d2_date;
    document.getElementById('contactsTitle').innerHTML = l.contacts;
    document.getElementById('contactsDesc').innerHTML = l.cDesc;
    document.getElementById('scrollToTopBtn').innerHTML = l.stt;

    const homeItem = document.getElementById('homeMenuItem');
    const newsItem = document.getElementById('newsMenuItem');
    const contactsItem = document.getElementById('contactsMenuItem');

    if (homeItem) homeItem.innerHTML = `<img src="images/icons/Домик.svg" class="menu-icon" alt="🏠"> ${l.home}`;
    if (newsItem) newsItem.innerHTML = `<img src="images/icons/Новости.svg" class="menu-icon" alt="📰"> ${l.newsT}`;
    if (contactsItem) contactsItem.innerHTML = `<img src="images/icons/Контакты.svg" class="menu-icon" alt="📬"> ${l.contactsT}`;

    const isDark = document.body.classList.contains('dark-theme');
    const savedTheme = localStorage.getItem('comic-theme');
    document.getElementById('themeText').innerHTML = savedTheme === 'system' ? l.system : (isDark ? l.dark : l.light);
    document.getElementById('selectedIssue').innerHTML = issues[currentIssue].name[currentLang];

    document.querySelectorAll('.menu-lang-option').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.lang === currentLang);
    });

    renderIssueDropdown();
    renderChapterDropdown();
    updateIconColors();
}

function setTheme(theme) {
    const l = t[currentLang];
    const icon = document.getElementById('themeIconImg');

    if (theme === 'light') {
        document.body.classList.remove('dark-theme');
        localStorage.setItem('comic-theme', 'light');
        document.getElementById('themeText').innerHTML = l.light;
        if (icon) icon.src = 'images/icons/Солнце.svg';
    } else if (theme === 'dark') {
        document.body.classList.add('dark-theme');
        localStorage.setItem('comic-theme', 'dark');
        document.getElementById('themeText').innerHTML = l.dark;
        if (icon) icon.src = 'images/icons/Луна.svg';
    } else {
        localStorage.setItem('comic-theme', 'system');
        document.getElementById('themeText').innerHTML = l.system;

        const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (dark) {
            document.body.classList.add('dark-theme');
            if (icon) icon.src = 'images/icons/Луна.svg';
        } else {
            document.body.classList.remove('dark-theme');
            if (icon) icon.src = 'images/icons/Солнце.svg';
        }
    }

    updateIconColors();

    if (currentSwiper) {
        setTimeout(() => currentSwiper.update(), 50);
    }
}

function toggleTheme() {
    const saved = localStorage.getItem('comic-theme');
    if (saved === 'light') setTheme('dark');
    else if (saved === 'dark') setTheme('system');
    else setTheme('light');
}

function detectTheme() {
    const saved = localStorage.getItem('comic-theme');
    if (saved === 'light') setTheme('light');
    else if (saved === 'dark') setTheme('dark');
    else setTheme('system');
}

function destroySwiper() {
    if (currentSwiper) {
        currentSwiper.destroy(true, true);
        currentSwiper = null;
    }
}

function buildSlides() {
    const wrapper = document.getElementById('swiperWrapper');
    if (!wrapper) return;

    wrapper.innerHTML = '';

    allPages.forEach((path, i) => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide comic-slide';

        const zoomContainer = document.createElement('div');
        zoomContainer.className = 'swiper-zoom-container';

        const img = document.createElement('img');
        img.src = path;
        img.alt = `Страница ${i + 1}`;
        img.loading = i < 2 ? 'eager' : 'lazy';
        img.decoding = 'async';
        img.draggable = false;

        zoomContainer.appendChild(img);
        slide.appendChild(zoomContainer);
        wrapper.appendChild(slide);
    });
}

function checkScroll() {
    const btn = document.getElementById('scrollToTopBtn');
    if (!btn || !currentSwiper) return;

    if (currentSwiper.activeIndex >= totalPages - 1) {
        btn.classList.add('show');
    } else {
        btn.classList.remove('show');
    }
}

function initSwiper(initialSlide = 0) {
    destroySwiper();

    currentSwiper = new Swiper('.comic-swiper', {
        slidesPerView: 1,
        centeredSlides: true,
        spaceBetween: 0,
        grabCursor: !isMobile,
        autoHeight: false,
        initialSlide,
        preloadImages: false,
        updateOnWindowResize: true,
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
        watchSlidesProgress: true,
        resistanceRatio: 0.85,
        touchStartPreventDefault: false,

        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        },

        pagination: {
            el: '.swiper-pagination',
            type: 'fraction'
        },

        zoom: {
            maxRatio: 3,
            minRatio: 1,
            toggle: false,
            panOnMouseMove: false
        },

        on: {
            zoomChange: function (swiper, scale) {
                const activeZoom = scale > 1.01;

                swiper.allowTouchMove = !activeZoom;

                if (activeZoom) {
                    document.body.classList.add('stop-scrolling');
                    swiper.el.classList.add('is-zooming');
                } else {
                    document.body.classList.remove('stop-scrolling');
                    swiper.el.classList.remove('is-zooming');
                    swiper.allowTouchMove = true;
                }
            },

            touchEnd: function () {
                const swiper = this;

                if (swiper._zoomResetTimer) {
                    clearTimeout(swiper._zoomResetTimer);
                }

                if (swiper.zoom && swiper.zoom.scale > 1.01) {
                    swiper._zoomResetTimer = setTimeout(() => {
                        swiper.zoom.out();
                        swiper.allowTouchMove = true;
                        document.body.classList.remove('stop-scrolling');
                        swiper.el.classList.remove('is-zooming');
                    }, 180);
                }
            },

            slideChange: function () {
                if (this._zoomResetTimer) {
                    clearTimeout(this._zoomResetTimer);
                }

                this.zoom.out();
                this.allowTouchMove = true;
                document.body.classList.remove('stop-scrolling');
                this.el.classList.remove('is-zooming');

                if (typeof checkScroll === 'function') {
                    checkScroll();
                }
            }
        }
    });

    setTimeout(() => {
        if (currentSwiper) {
            currentSwiper.update();
            checkScroll();
        }
    }, 120);
}

function loadComic(preserveSlide = false) {
    updateChapters();
    updateAllPages();

    const prevIndex = preserveSlide && currentSwiper ? currentSwiper.activeIndex : 0;

    buildSlides();
    initSwiper(prevIndex);
}

function openMenu() {
    document.getElementById('sideMenu').classList.add('open');
    document.getElementById('menuOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMenu() {
    document.getElementById('sideMenu').classList.remove('open');
    document.getElementById('menuOverlay').classList.remove('active');
    document.body.style.overflow = '';
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    closeMenu();

    if (pageId === 'mainPage' && currentSwiper) {
        setTimeout(() => {
            if (currentSwiper) {
                currentSwiper.update();
                checkScroll();
            }
        }, 80);

        setTimeout(() => {
            if (currentSwiper) {
                currentSwiper.update();
                checkScroll();
            }
        }, 220);
    }
}

function setLang(lang) {
    currentLang = lang;
    localStorage.setItem('comic-lang', lang);
    updateLang();
}

function scrollToStart() {
    if (currentSwiper) {
        currentSwiper.slideTo(0, 400);
    }
}

function handleResize() {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
        const nextIsMobile = isMobileDevice();

        if (nextIsMobile !== isMobile) {
            isMobile = nextIsMobile;
            totalPages = isMobile ? 32 : 20;
            loadComic(true);
            renderChapterDropdown();
        } else if (currentSwiper && document.getElementById('mainPage').classList.contains('active')) {
            currentSwiper.update();
            checkScroll();
        }
    }, 180);
}

/* ---------- init ---------- */
updateChapters();
updateAllPages();
detectTheme();
updateLang();
loadComic(false);
updateIconColors();

/* ---------- events ---------- */
window.addEventListener('resize', handleResize);

window.addEventListener('orientationchange', () => {
    setTimeout(handleResize, 150);
});

window.addEventListener('load', () => {
    if (currentSwiper) {
        setTimeout(() => currentSwiper.update(), 120);
        setTimeout(() => currentSwiper.update(), 400);
    }
});

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (localStorage.getItem('comic-theme') === 'system') {
        detectTheme();
    }
});

const scrollToTopBtn = document.getElementById('scrollToTopBtn');
if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', scrollToStart);
}

document.getElementById('burgerBtn').onclick = openMenu;
document.getElementById('menuCloseBtn').onclick = closeMenu;
document.getElementById('menuOverlay').onclick = closeMenu;
document.getElementById('homeMenuItem').onclick = () => showPage('mainPage');
document.getElementById('newsMenuItem').onclick = () => showPage('newsPage');
document.getElementById('contactsMenuItem').onclick = () => showPage('contactsPage');
document.getElementById('homeLogo').onclick = () => showPage('mainPage');
document.getElementById('menuThemeItem').onclick = (e) => {
    e.stopPropagation();
    toggleTheme();
};

const issueSelector = document.getElementById('issueSelector');
const chapterSelector = document.getElementById('chapterSelector');

if (issueSelector) {
    issueSelector.querySelector('.select-btn').onclick = (e) => {
        e.stopPropagation();
        issueSelector.classList.toggle('open');
        if (chapterSelector) chapterSelector.classList.remove('open');
    };
}

if (chapterSelector) {
    chapterSelector.querySelector('.select-btn').onclick = (e) => {
        e.stopPropagation();
        chapterSelector.classList.toggle('open');
        if (issueSelector) issueSelector.classList.remove('open');
    };
}

document.onclick = () => {
    if (issueSelector) issueSelector.classList.remove('open');
    if (chapterSelector) chapterSelector.classList.remove('open');
};

document.querySelectorAll('.menu-lang-option').forEach(opt => {
    opt.onclick = (e) => {
        e.stopPropagation();
        setLang(opt.dataset.lang);
        closeMenu();
    };
});