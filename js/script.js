// ========== ФАЙЛ: js/script.js (ОБНОВЛЕННЫЙ) ==========

function isMobileDevice() {
    return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

let isMobile = isMobileDevice();
let totalPages = isMobile ? 32 : 20;

const getPagePath = (pageNumber) => {
    if (isMobile) {
        return `images/comics/Комикс Выпуск №1 стр ${pageNumber}.jpg`;
    } else {
        return `images/comics/Комикс Выпуск №1_стр${pageNumber}.jpg`;
    }
};

let allPages = [];
let chapters = [];

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

updateChapters();
updateAllPages();

window.addEventListener('resize', () => {
    const newIsMobile = isMobileDevice();
    if (newIsMobile !== isMobile) {
        isMobile = newIsMobile;
        totalPages = isMobile ? 32 : 20;
        updateChapters();
        updateAllPages();
        loadComic();
        renderChapterDropdown();
    }
});

const issues = {
    1: { name: { ru: "Выпуск 1", en: "Issue 1", de: "Ausgabe 1" }, available: true, totalPages: totalPages },
    2: { name: { ru: "Выпуск 2", en: "Issue 2", de: "Ausgabe 2" }, available: false }
};

let currentLang = localStorage.getItem('comic-lang') || 'ru';
let currentIssue = 1;
let currentSwiper = null;

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


function updateIconColors() {
    const isDark = document.body.classList.contains('dark-theme');
    const icons = document.querySelectorAll('.menu-icon, .contact-card img');
    icons.forEach(icon => {
        if (isDark) icon.style.filter = 'brightness(0) invert(1)';
        else icon.style.filter = 'brightness(0)';
    });
}

function updateLang() {
    const l = t[currentLang];
    
    // Перевод текстов
    document.getElementById('footerText').innerHTML = l.footer;
    document.getElementById('selectedChapter').innerHTML = l.selChap;
    document.getElementById('newsTitle').innerHTML = l.news;
    document.getElementById('news1Title').innerHTML = l.n1;
    document.getElementById('news1Desc').innerHTML = l.d1;
    document.getElementById('news1Date').innerHTML = l.d1_date; // Добавлено
    document.getElementById('news2Title').innerHTML = l.n2;
    document.getElementById('news2Desc').innerHTML = l.d2;
    document.getElementById('news2Date').innerHTML = l.d2_date; // Добавлено
    document.getElementById('contactsTitle').innerHTML = l.contacts;
    document.getElementById('contactsDesc').innerHTML = l.cDesc;
    
    const homeItem = document.getElementById('homeMenuItem');
    const newsItem = document.getElementById('newsMenuItem');
    const contactsItem = document.getElementById('contactsMenuItem');
    if (homeItem) homeItem.innerHTML = `<img src="images/icons/Домик.svg" class="menu-icon" alt="🏠"> ${l.home}`;
    if (newsItem) newsItem.innerHTML = `<img src="images/icons/Новости.svg" class="menu-icon" alt="📰"> ${l.newsT}`;
    if (contactsItem) contactsItem.innerHTML = `<img src="images/icons/Контакты.svg" class="menu-icon" alt="📬"> ${l.contactsT}`;
    
    const isDark = document.body.classList.contains('dark-theme');
    const theme = localStorage.getItem('comic-theme');
    document.getElementById('themeText').innerHTML = theme === 'system' ? l.system : (isDark ? l.dark : l.light);
    
    document.querySelectorAll('.menu-lang-option').forEach(opt => {
        if (opt.dataset.lang === currentLang) opt.classList.add('active');
        else opt.classList.remove('active');
    });
    
    document.getElementById('selectedIssue').innerHTML = issues[currentIssue].name[currentLang];
    renderIssueDropdown();
    renderChapterDropdown();
    updateIconColors();
}

function renderIssueDropdown() {
    const d = document.getElementById('issueDropdown');
    d.innerHTML = '';
    for (const id in issues) {
        const opt = document.createElement('div');
        opt.className = 'select-option';
        if (!issues[id].available) opt.classList.add('disabled');
        opt.innerHTML = issues[id].name[currentLang] + (!issues[id].available ? ` (${t[currentLang].soon})` : '');
        if (issues[id].available) {
            opt.onclick = () => {
                if (parseInt(id) !== currentIssue) {
                    currentIssue = parseInt(id);
                    document.getElementById('selectedIssue').innerHTML = issues[id].name[currentLang];
                    loadComic();
                    document.getElementById('issueSelector').classList.remove('open');
                }
            };
        }
        d.appendChild(opt);
    }
}

function renderChapterDropdown() {
    const d = document.getElementById('chapterDropdown');
    d.innerHTML = '';
    chapters.forEach((ch, i) => {
        const opt = document.createElement('div');
        opt.className = 'select-option';
        opt.innerHTML = ch.name[currentLang];
        opt.onclick = () => {
            if (currentSwiper) currentSwiper.slideTo(ch.s, 400);
            document.getElementById('chapterSelector').classList.remove('open');
        };
        d.appendChild(opt);
    });
}

// ========== ФАЙЛ: js/script.js (ИСПРАВЛЕННЫЙ БЛОК) ==========

function loadComic() {
    updateChapters();
    updateAllPages();
    
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
        img.alt = `Страница ${i+1}`;
        img.loading = 'lazy';
        
        zoomContainer.appendChild(img);
        slide.appendChild(zoomContainer);
        wrapper.appendChild(slide);
    });

    if (currentSwiper) currentSwiper.destroy(true, true);
    
    currentSwiper = new Swiper('.comic-swiper', {
        slidesPerView: 1,
        centeredSlides: true,
        spaceBetween: 0,
        grabCursor: true,
        autoHeight: false, // Оставляем false для корректного центрирования

        // 1. ВОЗВРАЩАЕМ НАВИГАЦИЮ
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            type: 'fraction',
        },

        zoom: {
            maxRatio: 4,
            minRatio: 1,
            toggle: false 
        },

        on: {
            zoomChange: function (swiper, scale) {
                if (scale > 1) {
                    document.body.classList.add('stop-scrolling');
                } else {
                    document.body.classList.remove('stop-scrolling');
                }
            },
            touchEnd: function () {
                const swiper = this;
                if (swiper.zoom && swiper.zoom.scale > 1) {
                    setTimeout(() => {
                        swiper.zoom.out();
                        document.body.classList.remove('stop-scrolling');
                    }, 50); 
                }
            },
            slideChange: function () {
                this.zoom.out();
                document.body.classList.remove('stop-scrolling');
                
                // 2. ВОЗВРАЩАЕМ ЛОГИКУ КНОПКИ "В НАЧАЛО"
                if (typeof checkScroll === 'function') {
                    checkScroll();
                }
            }
        }
    });

    // Проверяем состояние кнопки сразу после создания слайдера
    if (typeof checkScroll === 'function') checkScroll();
}

// ... (остальные функции setTheme, toggleTheme, detectTheme, showPage, openMenu, closeMenu без изменений) ...

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
}

function toggleTheme() {
    const s = localStorage.getItem('comic-theme');
    if (s === 'light') setTheme('dark');
    else if (s === 'dark') setTheme('system');
    else setTheme('light');
}

function detectTheme() {
    const s = localStorage.getItem('comic-theme');
    if (s === 'light') setTheme('light');
    else if (s === 'dark') setTheme('dark');
    else setTheme('system');
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (localStorage.getItem('comic-theme') === 'system') {
        const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (dark) document.body.classList.add('dark-theme');
        else document.body.classList.remove('dark-theme');
        const icon = document.getElementById('themeIconImg');
        if (icon) icon.src = dark ? 'images/icons/Луна.svg' : 'images/icons/Солнце.svg';
        updateIconColors();
    }
});

function setLang(l) {
    currentLang = l;
    localStorage.setItem('comic-lang', l);
    updateLang();
}

function showPage(p) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(p).classList.add('active');
    closeMenu();
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

const scrollToTopBtn = document.getElementById('scrollToTopBtn');

function checkScroll() {
    if (currentSwiper && scrollToTopBtn) {
        const currentIndex = currentSwiper.activeIndex;
        if (currentIndex === totalPages - 1) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    }
}

function scrollToStart() {
    if (currentSwiper) {
        currentSwiper.slideTo(0, 400);
    }
}

if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', scrollToStart);
}

// ИНИЦИАЛИЗАЦИЯ
detectTheme();
updateLang();
loadComic();
updateIconColors();

document.getElementById('burgerBtn').onclick = openMenu;
document.getElementById('menuCloseBtn').onclick = closeMenu;
document.getElementById('menuOverlay').onclick = closeMenu;
document.getElementById('homeMenuItem').onclick = () => showPage('mainPage');
document.getElementById('newsMenuItem').onclick = () => showPage('newsPage');
document.getElementById('contactsMenuItem').onclick = () => showPage('contactsPage');
document.getElementById('homeLogo').onclick = () => showPage('mainPage');
document.getElementById('menuThemeItem').onclick = (e) => { e.stopPropagation(); toggleTheme(); };

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