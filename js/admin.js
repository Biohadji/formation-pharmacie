// Admin Dashboard Functions

// Helper function to copy text to clipboard
function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(() => {
            fallbackCopy(text);
        });
    } else {
        fallbackCopy(text);
    }
}

function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand('copy');
    } catch (err) {
        console.error('Copy failed:', err);
    }
    document.body.removeChild(textArea);
}

// EmailJS Configuration
const EMAILJS_CONFIG = {
    serviceId: 'service_2ci0tcc',
    templateId: 'template_hl4o3u8',
    publicKey: 'rPo_Tki8RELkiT3iK'
};

// Initialize EmailJS
function initEmailJS() {
    if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY') {
        emailjs.init({
            publicKey: EMAILJS_CONFIG.publicKey
        });
        console.log('EmailJS initialized successfully');
    } else {
        console.log('EmailJS not loaded or not configured');
    }
}

// Send activation code email
function sendActivationEmail(userEmail, userName, activationCode) {
    return new Promise((resolve, reject) => {
        console.log('EmailJS available:', typeof emailjs !== 'undefined');
        console.log('Config:', EMAILJS_CONFIG);
        
        if (typeof emailjs === 'undefined') {
            console.error('EmailJS library not loaded!');
            reject(new Error('EmailJS not loaded'));
            return;
        }

        const templateParams = {
            to_name: userName,
            to_email: userEmail,
            activation_code: activationCode,
            pharmacy_name: 'صيدلية عبد العزيز',
            message: currentLang === 'ar' 
                ? 'تم تفعيل حسابك في أكاديمية صيدلية عبد العزيز. كود التفعيل الخاص بك هو:'
                : 'Votre compte a été activé. Votre code d\'activation est :'
        };

        console.log('Sending email with params:', templateParams);
        console.log('Service ID:', EMAILJS_CONFIG.serviceId);
        console.log('Template ID:', EMAILJS_CONFIG.templateId);

        emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, templateParams)
            .then((response) => {
                console.log('SUCCESS! Status:', response.status, 'Text:', response.text);
                resolve(response);
            })
            .catch((error) => {
                console.error('FAILED! Error:', error);
                console.error('Error status:', error.status);
                console.error('Error text:', error.text);
                reject(error);
            });
    });
}

// Load Admin Data
function loadAdminData() {
    loadAdminStats();
    loadMembersTable();
    loadCodesTable();
    loadCertificatesTable();
    loadScoresTable();
    populateMemberSelects();
}

// Load Admin Statistics
function loadAdminStats() {
    const users = getFromStorage(STORAGE_KEYS.USERS, []);
    const certificates = getFromStorage(STORAGE_KEYS.CERTIFICATES, []);

    const members = users.filter(u => u.role === 'member');
    const activeMembers = members.filter(u => u.status === 'active');
    const pendingMembers = members.filter(u => u.status === 'pending');
    const certified = certificates.length;

    document.getElementById('admin-total-members').textContent = members.length;
    document.getElementById('admin-active-members').textContent = activeMembers.length;
    document.getElementById('admin-pending-members').textContent = pendingMembers.length;
    document.getElementById('admin-certified').textContent = certified;
}

// Load Members Table
function loadMembersTable() {
    const users = getFromStorage(STORAGE_KEYS.USERS, []);
    const members = users.filter(u => u.role === 'member');
    const tbody = document.getElementById('members-tbody');

    tbody.innerHTML = members.map(member => `
        <tr>
            <td>${member.firstname} ${member.lastname}</td>
            <td>${member.email}</td>
            <td>${member.phone}</td>
            <td><span class="status-badge status-${member.status}">${getStatusText(member.status)}</span></td>
            <td class="actions-cell">
                ${member.status === 'pending' ? `
                    <button onclick="approveMember('${member.id}')" class="action-btn approve-btn" title="${currentLang === 'ar' ? 'موافقة' : 'Approuver'}">
                        <i class="fas fa-check"></i>
                    </button>
                    <button onclick="rejectMember('${member.id}')" class="action-btn reject-btn" title="${currentLang === 'ar' ? 'رفض' : 'Rejeter'}">
                        <i class="fas fa-times"></i>
                    </button>
                ` : `
                    <button onclick="viewMemberDetails('${member.id}')" class="action-btn view-btn" title="${currentLang === 'ar' ? 'عرض' : 'Voir'}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button onclick="deleteMember('${member.id}')" class="action-btn delete-btn" title="${currentLang === 'ar' ? 'حذف' : 'Supprimer'}">
                        <i class="fas fa-trash"></i>
                    </button>
                `}
            </td>
        </tr>
    `).join('');
}

// Approve Member
function approveMember(memberId) {
    let users = getFromStorage(STORAGE_KEYS.USERS, []);
    const memberIndex = users.findIndex(u => u.id === memberId);

    if (memberIndex !== -1) {
        users[memberIndex].status = 'active';
        const code = generateActivationCode();
        users[memberIndex].activationCode = code;
        saveToStorage(STORAGE_KEYS.USERS, users);

        // Save activation code
        let codes = getFromStorage(STORAGE_KEYS.ACTIVATION_CODES, []);
        codes.push({
            id: 'code-' + Date.now(),
            userId: memberId,
            code: code,
            course: 'all',
            used: false,
            createdAt: new Date().toISOString()
        });
        saveToStorage(STORAGE_KEYS.ACTIVATION_CODES, codes);

        // Send activation code via Email
        const member = users[memberIndex];
        const userName = member.firstname + ' ' + member.lastname;
        
        // Initialize EmailJS
        initEmailJS();
        
        // Send email with activation code
        sendActivationEmail(member.email, userName, code)
            .then(() => {
                showAlert(
                    currentLang === 'ar'
                        ? `تم الموافقة على العضو. كود: ${code}\nتم إرسال الكود عبر البريد الإلكتروني إلى: ${member.email}`
                        : `Membre approuvé. Code: ${code}\nCode envoyé par email à: ${member.email}`,
                    'success'
                );
            })
            .catch((error) => {
                console.error('Email error:', error);
                // Fallback to WhatsApp
                let formattedPhone = member.phone.replace(/\D/g, '');
                if (formattedPhone.startsWith('0')) {
                    formattedPhone = '213' + formattedPhone.substring(1);
                } else if (!formattedPhone.startsWith('213')) {
                    formattedPhone = '213' + formattedPhone;
                }
                
                const whatsappMessage = `مرحباً ${userName}\n\nتم تفعيل حسابك في أكاديمية صيدلية عبد العزيز\nكود التفعيل: ${code}\n\nالبريد: ${member.email}\nشكراً لك`;
                const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(whatsappMessage)}`;
                
                copyToClipboard(whatsappMessage);
                window.open(whatsappUrl, '_blank');
                
                showAlert(
                    currentLang === 'ar'
                        ? `تم الموافقة على العضو. كود: ${code}\nفشل الإيميل - تم فتح واتساب`
                        : `Membre approuvé. Code: ${code}\nÉchec email - WhatsApp ouvert`,
                    'warning'
                );
            });

        loadAdminData();
    }
}

// Reject Member
function rejectMember(memberId) {
    if (!confirm(currentLang === 'ar' ? 'هل أنت متأكد من رفض هذا العضو؟' : 'Êtes-vous sûr de rejeter ce membre ?')) return;

    let users = getFromStorage(STORAGE_KEYS.USERS, []);
    const memberIndex = users.findIndex(u => u.id === memberId);

    if (memberIndex !== -1) {
        users[memberIndex].status = 'rejected';
        saveToStorage(STORAGE_KEYS.USERS, users);

        showAlert(
            currentLang === 'ar' ? 'تم رفض العضو' : 'Membre rejeté',
            'success'
        );

        loadAdminData();
    }
}

// Delete Member
function deleteMember(memberId) {
    if (!confirm(currentLang === 'ar' ? 'هل أنت متأكد من حذف هذا العضو؟' : 'Êtes-vous sûr de supprimer ce membre ?')) return;

    let users = getFromStorage(STORAGE_KEYS.USERS, []);
    users = users.filter(u => u.id !== memberId);
    saveToStorage(STORAGE_KEYS.USERS, users);

    showAlert(
        currentLang === 'ar' ? 'تم حذف العضو' : 'Membre supprimé',
        'success'
    );

    loadAdminData();
}

// View Member Details
function viewMemberDetails(memberId) {
    const users = getFromStorage(STORAGE_KEYS.USERS, []);
    const member = users.find(u => u.id === memberId);
    const scores = getFromStorage(STORAGE_KEYS.SCORES, {});
    const memberScores = scores[memberId] || {};

    alert(`
${currentLang === 'ar' ? 'الاسم:' : 'Nom:'} ${member.firstname} ${member.lastname}
${currentLang === 'ar' ? 'البريد:' : 'Email:'} ${member.email}
${currentLang === 'ar' ? 'الهاتف:' : 'Tél:'} ${member.phone}
${currentLang === 'ar' ? 'الحالة:' : 'Statut:'} ${getStatusText(member.status)}
${currentLang === 'ar' ? 'كود التفعيل:' : 'Code:'} ${member.activationCode || 'N/A'}
${currentLang === 'ar' ? 'تاريخ التسجيل:' : 'Inscrit le:'} ${new Date(member.createdAt).toLocaleDateString()}
${currentLang === 'ar' ? 'درجة بائع:' : 'Score Vendeur:'} ${memberScores.seller || 0}%
${currentLang === 'ar' ? 'درجة تحضير:' : 'Score Préparateur:'} ${memberScores.preparator || 0}%
    `);
}

// Search Members
function searchMembers() {
    const searchTerm = document.getElementById('member-search').value.toLowerCase();
    const users = getFromStorage(STORAGE_KEYS.USERS, []);
    const members = users.filter(u => u.role === 'member');
    const tbody = document.getElementById('members-tbody');

    const filtered = members.filter(m =>
        m.firstname.toLowerCase().includes(searchTerm) ||
        m.lastname.toLowerCase().includes(searchTerm) ||
        m.email.toLowerCase().includes(searchTerm) ||
        m.phone.includes(searchTerm)
    );

    tbody.innerHTML = filtered.map(member => `
        <tr>
            <td>${member.firstname} ${member.lastname}</td>
            <td>${member.email}</td>
            <td>${member.phone}</td>
            <td><span class="status-badge status-${member.status}">${getStatusText(member.status)}</span></td>
            <td class="actions-cell">
                ${member.status === 'pending' ? `
                    <button onclick="approveMember('${member.id}')" class="action-btn approve-btn">
                        <i class="fas fa-check"></i>
                    </button>
                    <button onclick="rejectMember('${member.id}')" class="action-btn reject-btn">
                        <i class="fas fa-times"></i>
                    </button>
                ` : `
                    <button onclick="viewMemberDetails('${member.id}')" class="action-btn view-btn">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button onclick="deleteMember('${member.id}')" class="action-btn delete-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                `}
            </td>
        </tr>
    `).join('');
}

// Populate Member Selects
function populateMemberSelects() {
    const users = getFromStorage(STORAGE_KEYS.USERS, []);
    const members = users.filter(u => u.role === 'member' && u.status === 'active');

    const options = members.map(m => `<option value="${m.id}">${m.firstname} ${m.lastname}</option>`).join('');

    const codeSelect = document.getElementById('code-member-select');
    const certSelect = document.getElementById('cert-member-select');

    if (codeSelect) codeSelect.innerHTML = `<option value="">${currentLang === 'ar' ? 'اختر عضو...' : 'Sélectionner...'}</option>` + options;
    if (certSelect) certSelect.innerHTML = `<option value="">${currentLang === 'ar' ? 'اختر عضو...' : 'Sélectionner...'}</option>` + options;
}

// Generate Activation Code (Admin)
function generateActivationCodeAdmin() {
    const memberId = document.getElementById('code-member-select').value;
    const course = document.getElementById('code-course-select').value;

    if (!memberId) {
        showAlert(currentLang === 'ar' ? 'اختر عضو أولاً' : 'Sélectionnez un membre', 'error');
        return;
    }

    const code = generateActivationCode();

    let codes = getFromStorage(STORAGE_KEYS.ACTIVATION_CODES, []);
    codes.push({
        id: 'code-' + Date.now(),
        userId: memberId,
        code: code,
        course: course,
        used: false,
        createdAt: new Date().toISOString()
    });
    saveToStorage(STORAGE_KEYS.ACTIVATION_CODES, codes);

    showAlert(
        currentLang === 'ar' ? `تم إنشاء كود التفعيل: ${code}` : `Code généré: ${code}`,
        'success'
    );

    loadCodesTable();
}

// Load Codes Table
function loadCodesTable() {
    const codes = getFromStorage(STORAGE_KEYS.ACTIVATION_CODES, []);
    const users = getFromStorage(STORAGE_KEYS.USERS, []);
    const tbody = document.getElementById('codes-tbody');

    tbody.innerHTML = codes.map(code => {
        const user = users.find(u => u.id === code.userId);
        return `
            <tr>
                <td>${user ? user.firstname + ' ' + user.lastname : 'N/A'}</td>
                <td class="code-cell">${code.code}</td>
                <td>${getCourseName(code.course)}</td>
                <td><span class="status-badge status-${code.used ? 'active' : 'pending'}">${code.used ? (currentLang === 'ar' ? 'مستخدم' : 'Utilisé') : (currentLang === 'ar' ? 'غير مستخدم' : 'Non utilisé')}</span></td>
                <td class="actions-cell">
                    <button onclick="copyCode('${code.code}')" class="action-btn view-btn" title="Copy">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button onclick="deleteCode('${code.id}')" class="action-btn delete-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Get Course Name
function getCourseName(course) {
    const names = {
        all: currentLang === 'ar' ? 'الكل' : 'Tous',
        seller: currentLang === 'ar' ? 'بائع الصيدلية' : 'Vendeur',
        preparator: currentLang === 'ar' ? 'التحضير الصيدلاني' : 'Préparateur'
    };
    return names[course] || course;
}

// Copy Code
function copyCode(code) {
    navigator.clipboard.writeText(code).then(() => {
        showAlert(currentLang === 'ar' ? 'تم نسخ الكود' : 'Code copié', 'success');
    });
}

// Delete Code
function deleteCode(codeId) {
    if (!confirm(currentLang === 'ar' ? 'هل أنت متأكد؟' : 'Êtes-vous sûr ?')) return;

    let codes = getFromStorage(STORAGE_KEYS.ACTIVATION_CODES, []);
    codes = codes.filter(c => c.id !== codeId);
    saveToStorage(STORAGE_KEYS.ACTIVATION_CODES, codes);

    loadCodesTable();
}

// Issue Certificate
function issueCertificate() {
    const memberId = document.getElementById('cert-member-select').value;
    const course = document.getElementById('cert-course-select').value;

    if (!memberId) {
        showAlert(currentLang === 'ar' ? 'اختر عضو أولاً' : 'Sélectionnez un membre', 'error');
        return;
    }

    const scores = getFromStorage(STORAGE_KEYS.SCORES, {});
    const memberScores = scores[memberId] || {};
    const score = memberScores[course] || 0;

    if (score < 50) {
        showAlert(
            currentLang === 'ar' ? 'درجة العضو أقل من 50%. لا يمكن إصدار الشهادة.' : 'Score inférieur à 50%. Certificat non éligible.',
            'error'
        );
        return;
    }

    let certificates = getFromStorage(STORAGE_KEYS.CERTIFICATES, []);
    const existingCert = certificates.find(c => c.userId === memberId && c.course === course);

    if (existingCert) {
        showAlert(
            currentLang === 'ar' ? 'العضو يمتلك شهادة بالفعل لهذا الدورة' : 'Le membre a déjà un certificat pour ce cours',
            'warning'
        );
        return;
    }

    certificates.push({
        id: 'cert-' + Date.now(),
        userId: memberId,
        course: course,
        score: score,
        issuedAt: new Date().toISOString(),
        issuedBy: 'admin'
    });
    saveToStorage(STORAGE_KEYS.CERTIFICATES, certificates);

    showAlert(
        currentLang === 'ar' ? 'تم إصدار الشهادة بنجاح' : 'Certificat émis avec succès',
        'success'
    );

    loadCertificatesTable();
}

// Load Certificates Table
function loadCertificatesTable() {
    const certificates = getFromStorage(STORAGE_KEYS.CERTIFICATES, []);
    const users = getFromStorage(STORAGE_KEYS.USERS, []);
    const tbody = document.getElementById('certificates-tbody');

    tbody.innerHTML = certificates.map(cert => {
        const user = users.find(u => u.id === cert.userId);
        return `
            <tr>
                <td>${user ? user.firstname + ' ' + user.lastname : 'N/A'}</td>
                <td>${getCourseName(cert.course)}</td>
                <td><strong>${cert.score}%</strong></td>
                <td>${new Date(cert.issuedAt).toLocaleDateString()}</td>
                <td class="actions-cell">
                    <button onclick="deleteCertificate('${cert.id}')" class="action-btn delete-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Delete Certificate
function deleteCertificate(certId) {
    if (!confirm(currentLang === 'ar' ? 'هل أنت متأكد؟' : 'Êtes-vous sûr ?')) return;

    let certificates = getFromStorage(STORAGE_KEYS.CERTIFICATES, []);
    certificates = certificates.filter(c => c.id !== certId);
    saveToStorage(STORAGE_KEYS.CERTIFICATES, certificates);

    loadCertificatesTable();
}

// Load Scores Table
function loadScoresTable() {
    const users = getFromStorage(STORAGE_KEYS.USERS, []);
    const scores = getFromStorage(STORAGE_KEYS.SCORES, []);
    const members = users.filter(u => u.role === 'member');
    const tbody = document.getElementById('scores-tbody');

    tbody.innerHTML = members.map(member => {
        const memberScores = scores[member.id] || {};
        const sellerScore = memberScores.seller || 0;
        const prepScore = memberScores.preparator || 0;
        const bestScore = Math.max(sellerScore, prepScore);
        const passed = bestScore >= 50;

        return `
            <tr>
                <td>${member.firstname} ${member.lastname}</td>
                <td>${sellerScore}%</td>
                <td>${prepScore}%</td>
                <td><strong>${bestScore}%</strong></td>
                <td><span class="status-badge status-${passed ? 'active' : 'pending'}">${passed ? (currentLang === 'ar' ? 'ناجح' : 'Réussi') : (currentLang === 'ar' ? 'يحتاج تحسين' : 'À améliorer')}</span></td>
            </tr>
        `;
    }).join('');
}