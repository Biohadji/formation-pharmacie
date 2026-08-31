// Auth System Configuration
const ADMIN_EMAIL = 'biohadji@gmail.com';
const STORAGE_KEYS = {
    USERS: 'pharmacy_users',
    CURRENT_USER: 'pharmacy_current_user',
    ACTIVATION_CODES: 'pharmacy_activation_codes',
    SCORES: 'pharmacy_scores',
    CERTIFICATES: 'pharmacy_certificates'
};

// Initialize default admin if not exists
function initAdmin() {
    let users = getFromStorage(STORAGE_KEYS.USERS, []);
    
    // Remove any regular user with admin email
    users = users.filter(u => u.email !== ADMIN_EMAIL);
    
    // Add admin account
    const adminAccount = {
        id: 'admin-001',
        firstname: 'عبد العزيز',
        lastname: 'إبراهيم',
        email: ADMIN_EMAIL,
        phone: '0549659691',
        password: 'admin123',
        role: 'admin',
        status: 'active',
        activationCode: null,
        createdAt: new Date().toISOString()
    };
    
    if (!users.find(u => u.email === ADMIN_EMAIL)) {
        users.push(adminAccount);
    }
    saveToStorage(STORAGE_KEYS.USERS, users);
}

// Storage helpers
function getFromStorage(key, defaultValue) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
        return defaultValue;
    }
}

function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// Generate unique ID
function generateId() {
    return 'user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

// Generate activation code
function generateActivationCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 4; j++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        if (i < 2) code += '-';
    }
    return code;
}

// Handle Registration
function handleRegister(event) {
    event.preventDefault();

    const firstname = document.getElementById('reg-firstname').value.trim();
    const lastname = document.getElementById('reg-lastname').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const phone = document.getElementById('reg-phone').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;

    // Prevent registration with admin email
    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        showAlert(currentLang === 'ar' ? 'هذا البريد مخصص للأدمن فقط' : 'Cet email est réservé à l\'administration', 'error');
        return;
    }

    // Validate all fields are filled
    if (!firstname || !lastname || !email || !phone || !password || !confirmPassword) {
        showAlert(currentLang === 'ar' ? 'يرجى ملء جميع الحقول' : 'Veuillez remplir tous les champs', 'error');
        return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showAlert(currentLang === 'ar' ? 'البريد الإلكتروني غير صحيح' : 'Email invalide', 'error');
        return;
    }

    // Validate phone number (Algerian format)
    const phoneRegex = /^(05|06|07)\d{8}$/;
    if (!phoneRegex.test(phone)) {
        showAlert(currentLang === 'ar' ? 'رقم الهاتف غير صحيح (مثال: 0555555555)' : 'Numéro de téléphone invalide (ex: 0555555555)', 'error');
        return;
    }

    // Validate password length
    if (password.length < 6) {
        showAlert(currentLang === 'ar' ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Le mot de passe doit contenir au moins 6 caractères', 'error');
        return;
    }

    // Validate password match
    if (password !== confirmPassword) {
        showAlert(currentLang === 'ar' ? 'كلمتا المرور غير متطابقتين' : 'Les mots de passe ne correspondent pas', 'error');
        return;
    }

    // Check if user exists
    let users = getFromStorage(STORAGE_KEYS.USERS, []);
    if (users.find(u => u.email === email)) {
        showAlert(currentLang === 'ar' ? 'هذا البريد الإلكتروني مسجل مسبقاً' : 'Cet email est déjà inscrit', 'error');
        return;
    }

    // Create new user
    const newUser = {
        id: generateId(),
        firstname,
        lastname,
        email,
        phone,
        password,
        role: 'member',
        status: 'pending',
        activationCode: null,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveToStorage(STORAGE_KEYS.USERS, users);

    // Show success message with payment info
    showRegistrationSuccess();
}

// Show Registration Success Modal
function showRegistrationSuccess() {
    const existingModal = document.querySelector('.registration-modal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.className = 'registration-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeRegistrationModal()"></div>
        <div class="modal-content">
            <div class="modal-icon success">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2>${currentLang === 'ar' ? 'تم التسجيل بنجاح!' : 'Inscription réussie !'}</h2>
            <div class="modal-message">
                <p>${currentLang === 'ar'
                    ? 'تم استلام طلب التسجيل الخاص بك.'
                    : 'Votre demande d\'inscription a été reçue.'}</p>
                <div class="payment-notice">
                    <i class="fas fa-info-circle"></i>
                    <p><strong>${currentLang === 'ar'
                        ? 'سيتم دراسة ملفك وإرسال كود التفعيل الخاص بك بعد دفع الرسوم.'
                        : 'Votre dossier sera examiné et votre code d\'activation vous sera envoyé après le paiement des frais.'}</strong></p>
                </div>
                <p class="thank-you">${currentLang === 'ar' ? 'شكراً لكم' : 'Merci'}</p>
            </div>
            <button class="modal-close-btn" onclick="closeRegistrationModal()">
                <i class="fas fa-times"></i> ${currentLang === 'ar' ? 'إغلاق' : 'Fermer'}
            </button>
        </div>
    `;
    document.body.appendChild(modal);

    // Clear form
    document.getElementById('register-form').reset();
}

// Close Registration Modal
function closeRegistrationModal() {
    const modal = document.querySelector('.registration-modal');
    if (modal) {
        modal.classList.add('closing');
        setTimeout(() => {
            modal.remove();
            showPage('home');
        }, 300);
    }
}

// Handle Login
function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const activationCode = document.getElementById('login-activation-code').value.trim();

    // Check admin login - Admin ONLY needs email
    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        let users = getFromStorage(STORAGE_KEYS.USERS, []);
        users = users.filter(u => u.email !== ADMIN_EMAIL);
        
        const adminAccount = {
            id: 'admin-001',
            firstname: 'عبد العزيز',
            lastname: 'إبراهيم',
            email: ADMIN_EMAIL,
            phone: '0549659691',
            password: 'admin123',
            role: 'admin',
            status: 'active',
            activationCode: null,
            createdAt: new Date().toISOString()
        };
        
        if (!users.find(u => u.email === ADMIN_EMAIL)) {
            users.push(adminAccount);
        }
        saveToStorage(STORAGE_KEYS.USERS, users);
        
        const admin = users.find(u => u.email === ADMIN_EMAIL);
        saveToStorage(STORAGE_KEYS.CURRENT_USER, admin);
        updateUIForLoggedInUser(admin);
        showAlert(currentLang === 'ar' ? 'مرحباً بك في لوحة التحكم' : 'Bienvenue dans le panneau d\'administration', 'success');
        showPage('admin-dashboard');
        loadAdminData();
        return;
    }

    // Check regular user login
    let users = getFromStorage(STORAGE_KEYS.USERS, []);
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        showAlert(currentLang === 'ar' ? 'بريد إلكتروني أو كلمة مرور خاطئة' : 'Email ou mot de passe incorrect', 'error');
        return;
    }

    if (user.status === 'pending') {
        showAlert(
            currentLang === 'ar'
                ? 'حسابك في انتظار موافقة الإدارة. سيتم إرسال كود التفعيل بعد دفع الرسوم.'
                : 'Votre compte est en attente. Le code sera envoyé après paiement.',
            'warning'
        );
        return;
    }

    if (user.status === 'rejected') {
        showAlert(
            currentLang === 'ar'
                ? 'تم رفض طلب التسجيل الخاص بك'
                : 'Votre demande d\'inscription a été rejetée',
            'error'
        );
        return;
    }

    // Check activation code if required
    if (user.activationCode && activationCode !== user.activationCode) {
        showAlert(
            currentLang === 'ar' ? 'كود التفعيل غير صحيح' : 'Code d\'activation incorrect',
            'error'
        );
        return;
    }

    // Login successful
    saveToStorage(STORAGE_KEYS.CURRENT_USER, user);
    updateUIForLoggedInUser(user);
    showAlert(
        currentLang === 'ar' ? `مرحباً ${user.firstname}!` : `Bienvenue ${user.firstname} !`,
        'success'
    );
    showPage('dashboard');
    loadDashboardData();
}

// Handle Activation
function handleActivate(event) {
    event.preventDefault();

    const code = document.getElementById('activate-code').value.trim();
    let users = getFromStorage(STORAGE_KEYS.USERS, []);
    let codes = getFromStorage(STORAGE_KEYS.ACTIVATION_CODES, []);

    const validCode = codes.find(c => c.code === code && !c.used);

    if (!validCode) {
        showAlert(
            currentLang === 'ar' ? 'كود التفعيل غير صحيح أو مستخدم مسبقاً' : 'Code invalide ou déjà utilisé',
            'error'
        );
        return;
    }

    const userIndex = users.findIndex(u => u.id === validCode.userId);
    if (userIndex !== -1) {
        users[userIndex].status = 'active';
        users[userIndex].activationCode = code;
        saveToStorage(STORAGE_KEYS.USERS, users);

        const codeIndex = codes.findIndex(c => c.code === code);
        codes[codeIndex].used = true;
        codes[codeIndex].usedAt = new Date().toISOString();
        saveToStorage(STORAGE_KEYS.ACTIVATION_CODES, codes);

        showAlert(
            currentLang === 'ar' ? 'تم تفعيل حسابك بنجاح!' : 'Compte activé avec succès !',
            'success'
        );

        setTimeout(() => showPage('login'), 2000);
    }
}

// Update UI for logged in user
function updateUIForLoggedInUser(user) {
    document.getElementById('auth-buttons').classList.add('hidden');
    if (document.getElementById('mobile-register-link')) {
        document.getElementById('mobile-register-link').classList.add('hidden');
    }

    if (user.role === 'admin') {
        document.getElementById('admin-menu').classList.remove('hidden');
    } else {
        document.getElementById('user-menu').classList.remove('hidden');
        document.getElementById('user-name-display').textContent = user.firstname + ' ' + user.lastname;
    }

    document.getElementById('mobile-dashboard-link').classList.remove('hidden');
    document.getElementById('mobile-logout-link').classList.remove('hidden');
}

// Update UI for logged out
function updateUIForLoggedOut() {
    document.getElementById('auth-buttons').classList.remove('hidden');
    document.getElementById('user-menu').classList.add('hidden');
    document.getElementById('admin-menu').classList.add('hidden');
    if (document.getElementById('mobile-register-link')) {
        document.getElementById('mobile-register-link').classList.remove('hidden');
    }
    document.getElementById('mobile-dashboard-link').classList.add('hidden');
    document.getElementById('mobile-logout-link').classList.add('hidden');
}

// Logout
function logout() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    updateUIForLoggedOut();
    showPage('home');
    showAlert(
        currentLang === 'ar' ? 'تم تسجيل الخروج بنجاح' : 'Déconnexion réussie',
        'success'
    );
}

// Toggle dropdowns
function toggleUserDropdown() {
    document.getElementById('user-dropdown').classList.toggle('show');
}

function toggleAdminDropdown() {
    document.getElementById('admin-dropdown').classList.toggle('show');
}

// Close dropdowns when clicking outside
document.addEventListener('click', function(e) {
    const userMenu = document.getElementById('user-menu');
    const adminMenu = document.getElementById('admin-menu');
    const userDropdown = document.getElementById('user-dropdown');
    const adminDropdown = document.getElementById('admin-dropdown');

    if (userMenu && !userMenu.contains(e.target)) {
        userDropdown?.classList.remove('show');
    }
    if (adminMenu && !adminMenu.contains(e.target)) {
        adminDropdown?.classList.remove('show');
    }
});

// Load Dashboard Data
function loadDashboardData() {
    const currentUser = getFromStorage(STORAGE_KEYS.CURRENT_USER, null);
    if (!currentUser) return;

    const userInfoDiv = document.getElementById('dash-user-info');
    if (userInfoDiv) {
        userInfoDiv.innerHTML = `
            <div class="info-row"><span>${currentLang === 'ar' ? 'الاسم:' : 'Nom:'}</span> ${currentUser.firstname} ${currentUser.lastname}</div>
            <div class="info-row"><span>${currentLang === 'ar' ? 'البريد:' : 'Email:'}</span> ${currentUser.email}</div>
            <div class="info-row"><span>${currentLang === 'ar' ? 'الهاتف:' : 'Tél:'}</span> ${currentUser.phone}</div>
            <div class="info-row"><span>${currentLang === 'ar' ? 'الحالة:' : 'Statut:'}</span> <span class="status-badge status-${currentUser.status}">${getStatusText(currentUser.status)}</span></div>
        `;
    }

    const codeDiv = document.getElementById('dash-activation-code');
    if (codeDiv) {
        codeDiv.innerHTML = `
            <div class="code-value">${currentUser.activationCode || (currentLang === 'ar' ? 'لم يُصدر بعد' : 'Non assigné')}</div>
        `;
    }

    const scores = getFromStorage(STORAGE_KEYS.SCORES, {});
    const userScores = scores[currentUser.id] || {};
    const sellerScore = userScores.seller || 0;
    const prepScore = userScores.preparator || 0;
    const avgScore = Math.round((sellerScore + prepScore) / 2);

    const coursesCount = document.getElementById('dash-courses-count');
    const completedCount = document.getElementById('dash-completed-count');
    const scoreDisplay = document.getElementById('dash-score');
    
    if (coursesCount) coursesCount.textContent = Object.keys(userScores).length;
    if (completedCount) completedCount.textContent = Object.values(userScores).filter(s => s > 0).length;
    if (scoreDisplay) scoreDisplay.textContent = avgScore + '%';

    const perfDiv = document.getElementById('dash-performance');
    if (perfDiv) {
        perfDiv.innerHTML = `
            <div class="performance-bar">
                <div class="perf-item">
                    <span>${currentLang === 'ar' ? 'بائع الصيدلية' : 'Vendeur'}</span>
                    <div class="bar-container">
                        <div class="bar-fill" style="width: ${sellerScore}%">${sellerScore}%</div>
                    </div>
                </div>
                <div class="perf-item">
                    <span>${currentLang === 'ar' ? 'التحضير الصيدلاني' : 'Préparateur'}</span>
                    <div class="bar-container">
                        <div class="bar-fill preparator-fill" style="width: ${prepScore}%">${prepScore}%</div>
                    </div>
                </div>
            </div>
        `;
    }

    const certificates = getFromStorage(STORAGE_KEYS.CERTIFICATES, []);
    const userCert = certificates.find(c => c.userId === currentUser.id);
    const certStatus = document.getElementById('dash-cert-status');
    if (userCert && certStatus) {
        certStatus.textContent = currentLang === 'ar' ? 'متوفر ✓' : 'Disponible ✓';
        certStatus.style.color = '#22c55e';
    }
}

// Get status text
function getStatusText(status) {
    const texts = {
        pending: currentLang === 'ar' ? 'في الانتظار' : 'En attente',
        active: currentLang === 'ar' ? 'نشط' : 'Actif',
        rejected: currentLang === 'ar' ? 'مرفوض' : 'Rejeté'
    };
    return texts[status] || status;
}

// Show Alert
function showAlert(message, type) {
    const existingAlert = document.querySelector('.alert-message');
    if (existingAlert) existingAlert.remove();

    const alert = document.createElement('div');
    alert.className = `alert-message alert-${type}`;
    alert.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : 'exclamation-triangle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(alert);

    setTimeout(() => alert.classList.add('show'), 10);
    setTimeout(() => {
        alert.classList.remove('show');
        setTimeout(() => alert.remove(), 300);
    }, 4000);
}

// Load My Courses
function loadMyCourses() {
    const currentUser = getFromStorage(STORAGE_KEYS.CURRENT_USER, null);
    if (!currentUser) return;

    const container = document.getElementById('my-courses-list');
    if (!container) return;

    const courses = [
        {
            id: 'seller',
            title: currentLang === 'ar' ? 'بائع في الصيدلية' : 'Vendeur en Pharmacie',
            icon: 'fa-user-tie',
            color: 'var(--primary)'
        },
        {
            id: 'preparator',
            title: currentLang === 'ar' ? 'محضر صيدلاني' : 'Préparateur en Pharmacie',
            icon: 'fa-flask',
            color: 'var(--secondary)'
        }
    ];

    const scores = getFromStorage(STORAGE_KEYS.SCORES, {});
    const userScores = scores[currentUser.id] || {};

    container.innerHTML = courses.map(course => `
        <div class="my-course-card">
            <div class="my-course-icon" style="background: ${course.color}">
                <i class="fas ${course.icon}"></i>
            </div>
            <div class="my-course-info">
                <h3>${course.title}</h3>
                <p>${currentLang === 'ar' ? 'الدرجة:' : 'Score:'} <strong>${userScores[course.id] || 0}%</strong></p>
            </div>
            <button class="my-course-btn" onclick="startAssessment('${course.id}')">
                ${userScores[course.id] ? (currentLang === 'ar' ? 'إعادة التقييم' : 'Refaire') : (currentLang === 'ar' ? 'ابدأ التقييم' : 'Commencer')}
            </button>
        </div>
    `).join('');
}

// Load Certificate Page
function loadCertificatePage() {
    const currentUser = getFromStorage(STORAGE_KEYS.CURRENT_USER, null);
    if (!currentUser) return;

    const certificates = getFromStorage(STORAGE_KEYS.CERTIFICATES, []);
    const userCert = certificates.find(c => c.userId === currentUser.id);
    const container = document.getElementById('certificate-area');
    if (!container) return;

    if (userCert) {
        container.innerHTML = `
            <div class="certificate">
                <div class="certificate-border">
                    <div class="certificate-content">
                        <div class="cert-header">
                            <i class="fas fa-prescription-bottle-medical"></i>
                            <h2>${currentLang === 'ar' ? 'أكاديمية صيدلية عبد العزيز' : 'Académie Pharmacie Abdelaziz'}</h2>
                            <p>${currentLang === 'ar' ? 'للتكوين المستمر' : 'Formation Continue'}</p>
                        </div>
                        <div class="cert-body">
                            <h3>${currentLang === 'ar' ? 'شهادة مشاركة' : 'Certificat de Participation'}</h3>
                            <p class="cert-text">${currentLang === 'ar' ? 'يمنح الشهادة إلى' : 'Ce certificat est décerné à'}</p>
                            <h2 class="cert-name">${currentUser.firstname} ${currentUser.lastname}</h2>
                            <p class="cert-text">${currentLang === 'ar' ? 'نظراً لاجتيازه دورة' : 'Pour avoir réussi le cours de'}</p>
                            <h3 class="cert-course">${userCert.course === 'seller' ? (currentLang === 'ar' ? 'بائع في الصيدلية' : 'Vendeur en Pharmacie') : (currentLang === 'ar' ? 'محضر صيدلاني' : 'Préparateur en Pharmacie')}</h3>
                            <p class="cert-score">${currentLang === 'ar' ? 'بدرجة:' : 'Avec une note de:'} <strong>${userCert.score}%</strong></p>
                            <div class="cert-date">${new Date(userCert.issuedAt).toLocaleDateString(currentLang === 'ar' ? 'ar-DZ' : 'fr-FR')}</div>
                        </div>
                        <div class="cert-footer">
                            <div class="cert-signature">
                                <div class="signature-line"></div>
                                <p>${currentLang === 'ar' ? 'صيدلية عبد العزيز إبراهيم' : 'Pharmacie Abdelaziz Ibrahim'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="certificate-actions">
                <button onclick="printCertificate()" class="print-cert-btn">
                    <i class="fas fa-print"></i> ${currentLang === 'ar' ? 'طباعة الشهادة' : 'Imprimer'}
                </button>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="no-certificate">
                <i class="fas fa-certificate"></i>
                <h3>${currentLang === 'ar' ? 'لم تحصل على شهادة بعد' : 'Pas encore de certificat'}</h3>
                <p>${currentLang === 'ar' ? 'أكمل التقييم بنجاح للحصول على شهادة المشاركة' : 'Réussissez l\'évaluation pour obtenir votre certificat'}</p>
                <button onclick="showPage('assessment')" class="go-assessment-btn">
                    <i class="fas fa-play"></i> ${currentLang === 'ar' ? 'اذهب للتقييم' : 'Aller à l\'évaluation'}
                </button>
            </div>
        `;
    }
}

// Print Certificate
function printCertificate() {
    const certContent = document.querySelector('.certificate');
    if (!certContent) return;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Certificate</title>
            <link rel="stylesheet" href="css/style.css">
            <style>
                body { padding: 20px; }
                .certificate-actions { display: none; }
            </style>
        </head>
        <body>
            ${certContent.outerHTML}
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initAdmin();

    const currentUser = getFromStorage(STORAGE_KEYS.CURRENT_USER, null);
    if (currentUser) {
        const users = getFromStorage(STORAGE_KEYS.USERS, []);
        const userExists = users.find(u => u.id === currentUser.id);
        if (userExists) {
            updateUIForLoggedInUser(userExists);
        } else {
            localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        }
    }
});