function init() {
    initActiveNav();
    initMobileMenu();
    initThemeToggle();
    initBackToTop();
    initCurrentYear();
    initAccordion();
    initFilters();
    initModal();
}

document.addEventListener('DOMContentLoaded', init);

function initActiveNav() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-list a');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        
        if (currentPath.endsWith('index.html') || currentPath === '/' || currentPath.endsWith('/')) {
            if (linkPath === 'index.html' || linkPath === '../index.html') {
                link.classList.add('active');
            }
        }
        else if (linkPath && currentPath.includes(linkPath.replace('../', ''))) {
            link.classList.add('active');
        }
    });
}

function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (!menuToggle || !navList) return;
    
    menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        navList.classList.toggle('active');
    });
    
    navList.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navList.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

function initThemeToggle() {
    const themeSwitch = document.querySelector('.theme-switch');
    if (!themeSwitch) return;
    
    const savedTheme = localStorage.getItem('siteTheme');
    if (savedTheme === 'dark') {
        document.body.classList.add('theme-dark');
        themeSwitch.textContent = '☀️';
    }
    
    themeSwitch.addEventListener('click', () => {
        document.body.classList.toggle('theme-dark');
        const isDark = document.body.classList.contains('theme-dark');
        localStorage.setItem('siteTheme', isDark ? 'dark' : 'light');
        themeSwitch.textContent = isDark ? '☀️' : '🌙';
    });
}

function initBackToTop() {
    const backBtn = document.querySelector('.back-to-top');
    if (!backBtn) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backBtn.classList.add('visible');
        } else {
            backBtn.classList.remove('visible');
        }
    });
    
    backBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function initCurrentYear() {
    const yearSpan = document.querySelector('.current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    } else {
        const footer = document.querySelector('.site-footer p');
        if (footer) {
            const year = new Date().getFullYear();
            footer.innerHTML = footer.innerHTML.replace(/\d{4}/, year);
        }
    }
}

function initAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    if (!accordionItems.length) return;
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        if (header) {
            header.addEventListener('click', () => {
                item.classList.toggle('active');
            });
        }
    });
}

function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.character-card');
    
    if (!filterBtns.length || !cards.length) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            
            cards.forEach(card => {
                const category = card.dataset.category;
                if (filter === 'all' || (category && category.includes(filter))) {
                    card.hidden = false;
                } else {
                    card.hidden = true;
                }
            });
        });
    });
}

function initModal() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const closeBtn = document.querySelector('.modal-close');
    const images = document.querySelectorAll('figure img');
    
    if (!modal) return;
    
    images.forEach(img => {
        img.addEventListener('click', () => {
            modal.classList.add('active');
            if (modalImg) modalImg.src = img.src;
        });
    });
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}