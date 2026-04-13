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
let currentLang = localStorage.getItem('comic-lang') || 'ru';
let currentIssue = 1;
let currentSwiper = null;
let resizeTimer = null;
let swiperInitToken = 0;

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

updateChapters();
updateAllPages();

function waitForFonts() {
    if (document.fonts && document.fonts.ready) {
        return document.fonts.ready.catch(() => Promise.resolve());
    }
    return Promise.resolve();
}

function waitForImages(container, limit = 2) {
    const images = Array.from(container.querySelectorAll('img')).slice(0, limit);
    if (images.length === 0) return Promise.resolve();

    return Promise.all(
        images.map(img => {
            if (img.complete && img.naturalWidth > 0) {
                return Promise.resolve();
            }

            return new Promise(resolve => {
                const done = () => resolve();
                img.addEventListener('load', done, { once: true });
                img.addEventListener('error', done, { once: true });
            });
        })
    );
}
function updateIconColors() {
    const isDark = document.body.classList.contains('dark-theme');
    const icons = document.querySelectorAll('.menu-icon, .contact-card img');

    icons.forEach(icon => {
        icon.style.filter = isDark ? 'brightness(0) invert(1)' : 'brightness(0)';
    });
}

function applyResponsiveFixes() {
    const mobile = isMobileDevice();

    const controlsPanel = document.querySelector('.controls-panel');
    const selectors = document.querySelectorAll('.issue-selector, .chapter-selector');
    const contactsPage = document.querySelector('.contacts-page');
    const newsPage = document.querySelector('.news-page');
    const contactsGrid = document.querySelector('.contacts-grid');
    const contactCards = document.querySelectorAll('.contact-card');
    const logo = document.querySelector('.logo');
    const headerLeft = document.querySelector('.header-left');

    if (mobile) {
        if (controlsPanel) {
            controlsPanel.style.display = 'grid';
            controlsPanel.style.gridTemplateColumns = '1fr 1fr';
            controlsPanel.style.justifyContent = 'center';
            controlsPanel.style.alignItems = 'center';
            controlsPanel.style.marginLeft = 'auto';
            controlsPanel.style.marginRight = 'auto';
        }

        selectors.forEach(el => {
            el.style.width = '100%';
            el.style.minWidth = '0';
            el.style.justifySelf = 'center';
        });

        if (contactsPage) {
            contactsPage.style.textAlign = 'center';
            contactsPage.style.marginLeft = 'auto';
            contactsPage.style.marginRight = 'auto';
        }

        if (newsPage) {
            newsPage.style.textAlign = 'center';
            newsPage.style.marginLeft = 'auto';
            newsPage.style.marginRight = 'auto';
        }

        if (contactsGrid) {
            contactsGrid.style.justifyItems = 'center';
            contactsGrid.style.alignItems = 'stretch';
        }

        contactCards.forEach(card => {
            card.style.marginLeft = 'auto';
            card.style.marginRight = 'auto';
            card.style.textAlign = 'center';
            card.style.width = '100%';
            card.style.maxWidth = '260px';
        });

        if (headerLeft) {
            headerLeft.style.alignItems = 'center';
        }

        if (logo) {
            logo.style.textAlign = 'left';
        }
    } else {
        if (controlsPanel) {
            controlsPanel.style.display = '';
            controlsPanel.style.gridTemplateColumns = '';
            controlsPanel.style.justifyContent = '';
            controlsPanel.style.alignItems = '';
            controlsPanel.style.marginLeft = '';
            controlsPanel.style.marginRight = '';
        }

        selectors.forEach(el => {
            el.style.width = '';
            el.style.minWidth = '';
            el.style.justifySelf = '';
        });

        if (contactsPage) {
            contactsPage.style.textAlign = '';
            contactsPage.style.marginLeft = '';
            contactsPage.style.marginRight = '';
        }

        if (newsPage) {
            newsPage.style.textAlign = '';
            newsPage.style.marginLeft = '';
            newsPage.style.marginRight = '';
        }

        if (contactsGrid) {
            contactsGrid.style.justifyItems = '';
            contactsGrid.style.alignItems = '';
        }

        contactCards.forEach(card => {
            card.style.marginLeft = '';
            card.style.marginRight = '';
            card.style.textAlign = '';
            card.style.width = '';
            card.style.maxWidth = '';
        });

        if (headerLeft) {
            headerLeft.style.alignItems = '';
        }

        if (logo) {
            logo.style.textAlign = '';
        }
    }
}

function forceLayoutUpdate() {
    applyResponsiveFixes();

    if (currentSwiper) {
        currentSwiper.updateSize();
        currentSwiper.updateSlides();
        currentSwiper.updateProgress();
        currentSwiper.updateAutoHeight?.();
        currentSwiper.update();
        checkScroll();
    }
}

function destroySwiper() {
    if (currentSwiper) {
        try {
            currentSwiper.destroy(true, true);
        } catch (e) {
            console.warn('Ошибка при destroy Swiper:', e);
        }
        currentSwiper = null;
    }
}

function buildSlides() {
    const wrapper = document.getElementById('swiperWrapper');
    if (!wrapper) return null;

    wrapper.innerHTML = '';

    allPages.forEach((path, i) => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide comic-slide';

        const zoomContainer = document.createElement('div');
        zoomContainer.className = 'swiper-zoom-container';

        const img = document.createElement('img');
        img.src = path;
        img.alt = `Страница ${i + 1}`;
        img.loading = i < 3 ? 'eager' : 'lazy';
        img.decoding = 'async';

        zoomContainer.appendChild(img);
        slide.appendChild(zoomContainer);
        wrapper.appendChild(slide);
    });

    return wrapper;
}

function createSwiper(initialSlide = 0) {
    destroySwiper();

    currentSwiper = new Swiper('.comic-swiper', {
        slidesPerView: 1,
        centeredSlides: true,
        spaceBetween: 0,
        grabCursor: true,
        autoHeight: false,
        initialSlide,
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
        updateOnWindowResize: true,

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
            init: function () {
                checkScroll();
                setTimeout(forceLayoutUpdate, 50);
                setTimeout(forceLayoutUpdate, 200);
            },

            imagesReady: function () {
                forceLayoutUpdate();
            },

            slideChange: function () {
                this.zoom.out();
                document.body.classList.remove('stop-scrolling');
                checkScroll();
            },

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
            }
        }
    });

    return currentSwiper;
}

async function loadComic(preserveSlide = false) {
    const initId = ++swiperInitToken;

    updateChapters();
    updateAllPages();

    const prevIndex = preserveSlide && currentSwiper ? currentSwiper.activeIndex : 0;
    const wrapper = buildSlides();
    if (!wrapper) return;

    applyResponsiveFixes();

    await waitForFonts();
    await waitForImages(wrapper, 2);

    if (initId !== swiperInitToken) return;

    createSwiper(prevIndex);

    requestAnimationFrame(() => {
        if (initId !== swiperInitToken || !currentSwiper) return;
        forceLayoutUpdate();
        currentSwiper.slideTo(prevIndex, 0);
    });

    setTimeout(() => {
        if (initId !== swiperInitToken || !currentSwiper) return;
        forceLayoutUpdate();
    }, 200);

    setTimeout(() => {
        if (initId !== swiperInitToken || !currentSwiper) return;
        forceLayoutUpdate();
    }, 600);
}

function updateLang() {
    const l = t[currentLang];

    const footerText = document.getElementById('footerText');
    const selectedChapter = document.getElementById('selectedChapter');
    const newsTitle = document.getElementById('newsTitle');
    const news1Title = document.getElementById('news1Title');
    const news1Desc = document.getElementById('news1Desc');
    const news1Date = document.getElementById('news1Date');
    const news2Title = document.getElementById('news2Title');
    const news2Desc = document.getElementById('news2Desc');
    const news2Date = document.getElementById('news2Date');
    const contactsTitle = document.getElementById('contactsTitle');
    const contactsDesc = document.getElementById('contactsDesc');
    const themeText = document.getElementById('themeText');
    const selectedIssue = document.getElementById('selectedIssue');

    if (footerText) footerText.innerHTML = l.footer;
    if (selectedChapter) selectedChapter.innerHTML = l.selChap;
    if (newsTitle) newsTitle.innerHTML = l.news;
    if (news1Title) news1Title.innerHTML = l.n1;
    if (news1Desc) news1Desc.innerHTML = l.d1;
    if (news1Date) news1Date.innerHTML = l.d1_date;
    if (news2Title) news2Title.innerHTML = l.n2;
    if (news2Desc) news2Desc.innerHTML = l.d2;
    if (news2Date) news2Date.innerHTML = l.d2_date;
    if (contactsTitle) contactsTitle.innerHTML = l.contacts;
    if (contactsDesc) contactsDesc.innerHTML = l.cDesc;

    const homeItem = document.getElementById('homeMenuItem');
    const newsItem = document.getElementById('newsMenuItem');
    const contactsItem = document.getElementById('contactsMenuItem');

    if (homeItem) homeItem.innerHTML = `<img src="images/icons/Домик.svg" class="menu-icon" alt="🏠"> ${l.home}`;
    if (newsItem) newsItem.innerHTML = `<img src="images/icons/Новости.svg" class="menu-icon" alt="📰"> ${l.newsT}`;
    if (contactsItem) contactsItem.innerHTML = `<img src="images/icons/Контакты.svg" class="menu-icon" alt="📬"> ${l.contactsT}`;

    const isDark = document.body.classList.contains('dark-theme');
    const theme = localStorage.getItem('comic-theme');

    if (themeText) {
        themeText.innerHTML = theme === 'system' ? l.system : (isDark ? l.dark : l.light);
    }

    document.querySelectorAll('.menu-lang-option').forEach(opt => {
        if (opt.dataset.lang === currentLang) opt.classList.add('active');
        else opt.classList.remove('active');
    });

    if (selectedIssue) selectedIssue.innerHTML = issues[currentIssue].name[currentLang];

    renderIssueDropdown();
    renderChapterDropdown();
    updateIconColors();
    applyResponsiveFixes();

    setTimeout(forceLayoutUpdate, 50);
}

function renderIssueDropdown() {
    const d = document.getElementById('issueDropdown');
    if (!d) return;

    d.innerHTML = '';

    for (const id in issues) {
        const opt = document.createElement('div');
        opt.className = 'select-option';

        if (!issues[id].available) opt.classList.add('disabled');

        opt.innerHTML = issues[id].name[currentLang] + (!issues[id].available ? ` (${t[currentLang].soon})` : '');

        if (issues[id].available) {
            opt.onclick = () => {
                if (parseInt(id, 10) !== currentIssue) {
                    currentIssue = parseInt(id, 10);
                    const selectedIssue = document.getElementById('selectedIssue');
                    if (selectedIssue) selectedIssue.innerHTML = issues[id].name[currentLang];

                    loadComic(false);
                    document.getElementById('issueSelector')?.classList.remove('open');
                }
            };
        }

        d.appendChild(opt);
    }
}

function renderChapterDropdown() {
    const d = document.getElementById('chapterDropdown');
    if (!d) return;

    d.innerHTML = '';

    chapters.forEach(ch => {
        const opt = document.createElement('div');
        opt.className = 'select-option';
        opt.innerHTML = ch.name[currentLang];

        opt.onclick = () => {
            if (currentSwiper) currentSwiper.slideTo(ch.s, 400);
            document.getElementById('chapterSelector')?.classList.remove('open');
        };

        d.appendChild(opt);
    });
}

function setTheme(theme) {
    const l = t[currentLang];
    const icon = document.getElementById('themeIconImg');
    const themeText = document.getElementById('themeText');

    if (theme === 'light') {
        document.body.classList.remove('dark-theme');
        localStorage.setItem('comic-theme', 'light');
        if (themeText) themeText.innerHTML = l.light;
        if (icon) icon.src = 'images/icons/Солнце.svg';
    } else if (theme === 'dark') {
        document.body.classList.add('dark-theme');
        localStorage.setItem('comic-theme', 'dark');
        if (themeText) themeText.innerHTML = l.dark;
        if (icon) icon.src = 'images/icons/Луна.svg';
    } else {
        localStorage.setItem('comic-theme', 'system');
        if (themeText) themeText.innerHTML = l.system;

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
    applyResponsiveFixes();
    setTimeout(forceLayoutUpdate, 50);
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
        const icon = document.getElementById('themeIconImg');

        if (dark) {
            document.body.classList.add('dark-theme');
            if (icon) icon.src = 'images/icons/Луна.svg';
        } else {
            document.body.classList.remove('dark-theme');
            if (icon) icon.src = 'images/icons/Солнце.svg';
        }

        updateIconColors();
        setTimeout(forceLayoutUpdate, 50);
    }
});

function setLang(l) {
    currentLang = l;
    localStorage.setItem('comic-lang', l);
    updateLang();
}

function showPage(p) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(p)?.classList.add('active');
    closeMenu();
    applyResponsiveFixes();
    setTimeout(forceLayoutUpdate, 50);
}

function openMenu() {
    document.getElementById('sideMenu')?.classList.add('open');
    document.getElementById('menuOverlay')?.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMenu() {
    document.getElementById('sideMenu')?.classList.remove('open');
    document.getElementById('menuOverlay')?.classList.remove('active');
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

function handleResizeLikeEvent() {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
        const newIsMobile = isMobileDevice();
        const modeChanged = newIsMobile !== isMobile;

        isMobile = newIsMobile;
        totalPages = isMobile ? 32 : 20;

        if (modeChanged) {
            updateChapters();
            updateAllPages();
            renderChapterDropdown();
            loadComic(true);
        } else {
            applyResponsiveFixes();
            forceLayoutUpdate();
        }
    }, 180);
}

window.addEventListener('resize', handleResizeLikeEvent);
window.addEventListener('orientationchange', () => {
    setTimeout(handleResizeLikeEvent, 120);
});
window.addEventListener('load', () => {
    applyResponsiveFixes();
    setTimeout(forceLayoutUpdate, 100);
    setTimeout(forceLayoutUpdate, 500);
    setTimeout(forceLayoutUpdate, 1200);
});
window.addEventListener('pageshow', () => {
    applyResponsiveFixes();
    setTimeout(forceLayoutUpdate, 100);
});

document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        setTimeout(forceLayoutUpdate, 100);
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    detectTheme();
    updateLang();
    applyResponsiveFixes();
    await loadComic(false);
    updateIconColors();

    document.getElementById('burgerBtn')?.addEventListener('click', openMenu);
    document.getElementById('menuCloseBtn')?.addEventListener('click', closeMenu);
    document.getElementById('menuOverlay')?.addEventListener('click', closeMenu);
    document.getElementById('homeMenuItem')?.addEventListener('click', () => showPage('mainPage'));
    document.getElementById('newsMenuItem')?.addEventListener('click', () => showPage('newsPage'));
    document.getElementById('contactsMenuItem')?.addEventListener('click', () => showPage('contactsPage'));
    document.getElementById('homeLogo')?.addEventListener('click', () => showPage('mainPage'));
    document.getElementById('menuThemeItem')?.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleTheme();
    });

    const issueSelector = document.getElementById('issueSelector');
    const chapterSelector = document.getElementById('chapterSelector');

    if (issueSelector) {
        issueSelector.querySelector('.select-btn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            issueSelector.classList.toggle('open');
            chapterSelector?.classList.remove('open');
        });
    }

    if (chapterSelector) {
        chapterSelector.querySelector('.select-btn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            chapterSelector.classList.toggle('open');
            issueSelector?.classList.remove('open');
        });
    }

    document.addEventListener('click', () => {
        issueSelector?.classList.remove('open');
        chapterSelector?.classList.remove('open');
    });

    document.querySelectorAll('.menu-lang-option').forEach(opt => {
        opt.addEventListener('click', (e) => {
            e.stopPropagation();
            setLang(opt.dataset.lang);
            closeMenu();
        });
    });
});