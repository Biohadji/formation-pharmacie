// Global State
let currentLang = 'ar';
let currentPage = 'home';

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Check for saved language
    const savedLang = localStorage.getItem('pharmacy_lang');
    if (savedLang) {
        currentLang = savedLang;
    }
    
    // Check if user is logged in
    const currentUser = getFromStorage('pharmacy_current_user', null);
    if (!currentUser) {
        // Not logged in - show registration page
        showPage('register');
    }
    
    // Add lesson navigation after DOM is loaded
    setTimeout(addLessonNavigation, 100);
});

// Add navigation buttons to all lessons
function addLessonNavigation() {
    const lessons = document.querySelectorAll('.lesson-content');
    
    lessons.forEach((lesson, index) => {
        const lessonId = lesson.id;
        const navDiv = document.createElement('div');
        navDiv.className = 'lesson-nav';
        
        const isFirst = index === 0;
        const isLast = index === lessons.length - 1;
        
        navDiv.innerHTML = `
            <button class="lesson-nav-btn prev" 
                    onclick="navigateLesson('${lessonId}', 'prev')" 
                    ${isFirst ? 'disabled' : ''}>
                <i class="fas fa-chevron-right"></i>
                <span data-i18n="nav_prev"></span>
            </button>
            <button class="lesson-nav-btn next" 
                    onclick="navigateLesson('${lessonId}', 'next')" 
                    ${isLast ? 'disabled' : ''}>
                <span data-i18n="nav_next"></span>
                <i class="fas fa-chevron-left"></i>
            </button>
        `;
        
        lesson.appendChild(navDiv);
    });
    
    // Apply translations to new elements
    if (typeof applyTranslations === 'function') {
        applyTranslations();
    }
}

// Language Selection
function selectLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('pharmacy_lang', lang);

    // Set direction
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;

    // Update current lang display
    document.getElementById('current-lang').textContent = lang.toUpperCase();

    // Apply translations
    applyTranslations();

    // Show main screen
    document.getElementById('lang-screen').classList.remove('active');
    document.getElementById('main-screen').classList.add('active');

    // Load section quizzes
    setTimeout(() => {
        if (typeof loadSectionQuiz === 'function') {
            loadSectionQuiz('seller', 'section1');
            loadSectionQuiz('preparator', 'section2');
        }
    }, 300);
}

// Toggle Language
function toggleLanguage() {
    const newLang = currentLang === 'ar' ? 'fr' : 'ar';
    selectLanguage(newLang);
}

// Apply Translations
function applyTranslations() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang] && translations[currentLang][key]) {
            el.innerHTML = translations[currentLang][key];
        }
    });
}

// Navigation
function showPage(page) {
    // Check if user is logged in for protected pages
    const protectedPages = ['dashboard', 'my-courses', 'assessment', 'certificate'];
    if (protectedPages.includes(page)) {
        const currentUser = getFromStorage(STORAGE_KEYS.CURRENT_USER, null);
        if (!currentUser) {
            showAlert(
                currentLang === 'ar'
                    ? 'يجب التسجيل أولاً للوصول إلى هذه الصفحة'
                    : 'Vous devez vous inscrire d\'abord pour accéder à cette page',
                'warning'
            );
            showPage('registration');
            return;
        }
    }

    currentPage = page;

    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    // Show target page
    const targetPage = document.getElementById(`page-${page}`);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // Close mobile menu
    document.getElementById('mobile-menu').classList.remove('show');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Reset assessment if navigating to assessment page
    if (page === 'assessment') {
        if (typeof closeAssessment === 'function') {
            closeAssessment();
        }
    }

    // Load page-specific data
    if (page === 'dashboard') {
        loadDashboardData();
    } else if (page === 'my-courses') {
        loadMyCourses();
    } else if (page === 'certificate') {
        loadCertificatePage();
    } else if (page === 'admin-dashboard' || page === 'admin-members' || page === 'admin-codes' || page === 'admin-certificates' || page === 'admin-scores') {
        loadAdminData();
    }
}

// Toggle Mobile Menu
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('show');
}

// Toggle Lesson
function toggleLesson(lessonId) {
    const lesson = document.getElementById(lessonId);
    const card = lesson.closest('.lesson-card');

    // Close other open lessons
    document.querySelectorAll('.lesson-card.open').forEach(openCard => {
        if (openCard !== card) {
            openCard.classList.remove('open');
            const openContent = openCard.querySelector('.lesson-content');
            if (openContent) {
                openContent.style.maxHeight = '0';
            }
        }
    });

    // Toggle current lesson
    card.classList.toggle('open');

    if (card.classList.contains('open')) {
        lesson.style.maxHeight = lesson.scrollHeight + 'px';
    } else {
        lesson.style.maxHeight = '0';
    }
}

// Navigate to next/previous lesson
function navigateLesson(currentLessonId, direction) {
    const currentCard = document.getElementById(currentLessonId).closest('.lesson-card');
    const allCards = Array.from(currentCard.parentElement.querySelectorAll('.lesson-card'));
    const currentIndex = allCards.indexOf(currentCard);
    
    let targetIndex;
    if (direction === 'next') {
        targetIndex = currentIndex + 1;
    } else {
        targetIndex = currentIndex - 1;
    }
    
    if (targetIndex >= 0 && targetIndex < allCards.length) {
        const targetCard = allCards[targetIndex];
        const targetContent = targetCard.querySelector('.lesson-content');
        const targetLessonId = targetContent.id;
        
        // Close current lesson
        currentCard.classList.remove('open');
        currentCard.querySelector('.lesson-content').style.maxHeight = '0';
        
        // Open target lesson
        targetCard.classList.add('open');
        targetContent.style.maxHeight = targetContent.scrollHeight + 'px';
        
        // Scroll to target
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
    const menu = document.getElementById('mobile-menu');
    const menuBtn = document.querySelector('.mobile-menu-btn');

    if (menu && !menu.contains(e.target) && !menuBtn.contains(e.target)) {
        menu.classList.remove('show');
    }
});