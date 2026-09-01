// Quiz State
let currentQuizType = 'seller';
let currentQuizLang = 'ar';
let currentQuizQuestions = [];
let currentQuestionIndex = 0;
let selectedAnswers = [];
let quizSubmitted = false;
let currentQuizContext = 'main'; // 'main', 'section1', 'section2', 'assessment'
let currentAssessmentType = '';

// Initialize quizzes
document.addEventListener('DOMContentLoaded', function() {
    // Load section quizzes after a short delay
    setTimeout(() => {
        loadSectionQuiz('seller', 'section1');
        loadSectionQuiz('preparator', 'section2');
    }, 500);
});

// Load Section Quiz
function loadSectionQuiz(type, sectionId) {
    const container = document.getElementById(`${sectionId}-quiz-container`);
    if (!container) return;

    const questions = quizData[type][currentQuizLang] || quizData[type]['ar'];
    const questionsToShow = questions.slice(0, 5); // Show 5 questions per section

    let html = '';
    questionsToShow.forEach((q, index) => {
        html += `
            <div class="quiz-question" id="${sectionId}-q-${index}">
                <h3>
                    <span class="q-num">${index + 1}</span>
                    ${q.question}
                </h3>
                <div class="quiz-options">
                    ${q.options.map((opt, optIndex) => `
                        <div class="quiz-option" onclick="selectSectionOption('${sectionId}', ${index}, ${optIndex})" id="${sectionId}-opt-${index}-${optIndex}">
                            <input type="radio" name="${sectionId}-q${index}" value="${optIndex}">
                            <span class="option-letter">${getOptionLetter(optIndex)}</span>
                            <span>${opt}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="quiz-explanation" id="${sectionId}-expl-${index}" style="display:none; margin-top:15px; padding:12px; border-radius:8px; background:#f0fdfa; border:1px solid #ccfbf1;">
                    <strong>${currentQuizLang === 'ar' ? 'الشرح:' : 'Explication:'}</strong> ${q.explanation}
                </div>
            </div>
        `;
    });

    html += `
        <div class="quiz-submit">
            <button onclick="submitSectionQuiz('${sectionId}', '${type}')" id="${sectionId}-submit-btn">
                ${currentQuizLang === 'ar' ? 'تحقق من إجاباتي' : 'Vérifier mes réponses'}
            </button>
        </div>
    `;

    container.innerHTML = html;
    container.dataset.questions = JSON.stringify(questionsToShow);
}

// Select Section Option
function selectSectionOption(sectionId, qIndex, optIndex) {
    const question = document.getElementById(`${sectionId}-q-${qIndex}`);
    question.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));
    document.getElementById(`${sectionId}-opt-${qIndex}-${optIndex}`).classList.add('selected');
    question.dataset.selected = optIndex;
}

// Submit Section Quiz
function submitSectionQuiz(sectionId, type) {
    const container = document.getElementById(`${sectionId}-quiz-container`);
    const questions = JSON.parse(container.dataset.questions);
    let correctCount = 0;

    questions.forEach((q, index) => {
        const question = document.getElementById(`${sectionId}-q-${index}`);
        const selected = parseInt(question.dataset.selected);

        const isCorrect = selected === q.correct;
        if (isCorrect) correctCount++;

        // Show correct/incorrect
        const options = question.querySelectorAll('.quiz-option');
        options.forEach((opt, optIndex) => {
            opt.style.pointerEvents = 'none';
            if (optIndex === q.correct) {
                opt.classList.add('correct');
            } else if (optIndex === selected && !isCorrect) {
                opt.classList.add('incorrect');
            }
        });

        // Show explanation
        document.getElementById(`${sectionId}-expl-${index}`).style.display = 'block';
    });

    // Save score to localStorage
    const currentUser = getFromStorage(STORAGE_KEYS.CURRENT_USER, null);
    if (currentUser) {
        const scores = getFromStorage(STORAGE_KEYS.SCORES, {});
        if (!scores[currentUser.id]) {
            scores[currentUser.id] = {};
        }
        scores[currentUser.id][sectionId] = {
            correct: correctCount,
            total: questions.length,
            percentage: Math.round((correctCount / questions.length) * 100),
            completedAt: new Date().toISOString()
        };
        saveToStorage(STORAGE_KEYS.SCORES, scores);
        console.log(`Score saved for ${sectionId}:`, scores[currentUser.id][sectionId]);
    }

    // Show result
    showSectionQuizResult(sectionId, correctCount, questions.length);
}

// Show Section Quiz Result
function showSectionQuizResult(sectionId, correct, total) {
    const percentage = Math.round((correct / total) * 100);
    const resultDiv = document.getElementById(`${sectionId}-quiz-result`);

    let resultClass, resultMessage;

    if (percentage >= 80) {
        resultClass = 'excellent';
        resultMessage = currentQuizLang === 'ar' ? 'ممتاز! أحسنت' : 'Excellent ! Bien joué';
    } else if (percentage >= 50) {
        resultClass = 'good';
        resultMessage = currentQuizLang === 'ar' ? 'جيد! يمكنك تحسين نتيجتك' : 'Bien ! Vous pouvez améliorer';
    } else {
        resultClass = 'poor';
        resultMessage = currentQuizLang === 'ar' ? 'تحتاج إلى مراجعة' : 'Vous devez réviser';
    }

    resultDiv.innerHTML = `
        <div class="result-circle ${resultClass}">
            ${percentage}%
            <small>${correct}/${total}</small>
        </div>
        <h2>${resultMessage}</h2>
        <p>${currentQuizLang === 'ar'
            ? `لقد أجبت بشكل صحيح على ${correct} من ${total} سؤال`
            : `Vous avez répondu correctement à ${correct} questions sur ${total}`}</p>
        <button onclick="retakeSectionQuiz('${sectionId}')">
            ${currentQuizLang === 'ar' ? 'إعادة الاختبار' : 'Refaire'}
        </button>
    `;

    resultDiv.classList.remove('hidden');
    resultDiv.scrollIntoView({ behavior: 'smooth' });
}

// Retake Section Quiz
function retakeSectionQuiz(sectionId) {
    const type = sectionId === 'section1' ? 'seller' : 'preparator';
    loadSectionQuiz(type, sectionId);
    document.getElementById(`${sectionId}-quiz-result`).classList.add('hidden');
}

// Start Assessment
function startAssessment(type) {
    currentAssessmentType = type;
    currentQuizContext = 'assessment';

    // Hide assessment cards
    document.querySelector('.assessment-container').classList.add('hidden');
    document.getElementById('assessment-quiz-area').classList.remove('hidden');

    // Update title
    const title = currentQuizLang === 'ar'
        ? (type === 'seller' ? 'تقييم بائع الصيدلية' : 'تقييم محضر صيدلاني')
        : (type === 'seller' ? 'Évaluation Vendeur' : 'Évaluation Préparateur');
    document.getElementById('assessment-current-title').textContent = title;

    // Load questions
    currentQuizQuestions = quizData[type][currentQuizLang] || quizData[type]['ar'];
    selectedAnswers = [];
    quizSubmitted = false;

    renderAssessmentQuiz();
}

// Render Assessment Quiz
function renderAssessmentQuiz() {
    const container = document.getElementById('assessment-quiz-container');
    let html = '';

    currentQuizQuestions.forEach((q, index) => {
        html += `
            <div class="quiz-question" id="aq-${index}">
                <h3>
                    <span class="q-num">${index + 1}</span>
                    ${q.question}
                </h3>
                <div class="quiz-options">
                    ${q.options.map((opt, optIndex) => `
                        <div class="quiz-option" onclick="selectAssessmentOption(${index}, ${optIndex})" id="aq-opt-${index}-${optIndex}">
                            <input type="radio" name="aq${index}" value="${optIndex}">
                            <span class="option-letter">${getOptionLetter(optIndex)}</span>
                            <span>${opt}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="quiz-explanation" id="aq-expl-${index}" style="display:none; margin-top:15px; padding:12px; border-radius:8px; background:#f0fdfa; border:1px solid #ccfbf1;">
                    <strong>${currentQuizLang === 'ar' ? 'الشرح:' : 'Explication:'}</strong> ${q.explanation}
                </div>
            </div>
        `;
    });

    html += `
        <div class="quiz-submit">
            <button onclick="submitAssessment()" id="aq-submit-btn">
                ${currentQuizLang === 'ar' ? 'إجابتي' : 'Soumettre'}
            </button>
        </div>
    `;

    container.innerHTML = html;
}

// Select Assessment Option
function selectAssessmentOption(qIndex, optIndex) {
    if (quizSubmitted) return;

    selectedAnswers[qIndex] = optIndex;

    const question = document.getElementById(`aq-${qIndex}`);
    question.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));
    document.getElementById(`aq-opt-${qIndex}-${optIndex}`).classList.add('selected');
}

// Submit Assessment
function submitAssessment() {
    if (quizSubmitted) return;

    const unanswered = currentQuizQuestions.length - selectedAnswers.filter(a => a !== undefined).length;
    if (unanswered > 0) {
        const msg = currentQuizLang === 'ar'
            ? `لديك ${unanswered} أسئلة لم تتم الإجابة عليها. هل تريد الإرسال؟`
            : `Vous avez ${unanswered} questions sans réponse. Soumettre quand même ?`;
        if (!confirm(msg)) return;
    }

    quizSubmitted = true;

    let correctCount = 0;
    currentQuizQuestions.forEach((q, index) => {
        const selected = selectedAnswers[index];
        const isCorrect = selected === q.correct;

        if (isCorrect) correctCount++;

        const options = document.getElementById(`aq-${index}`).querySelectorAll('.quiz-option');
        options.forEach((opt, optIndex) => {
            opt.style.pointerEvents = 'none';
            if (optIndex === q.correct) {
                opt.classList.add('correct');
            } else if (optIndex === selected && !isCorrect) {
                opt.classList.add('incorrect');
            }
        });

        document.getElementById(`aq-expl-${index}`).style.display = 'block';
    });

    showAssessmentResult(correctCount, currentQuizQuestions.length);
    document.getElementById('aq-submit-btn').disabled = true;

    // Save assessment score to localStorage
    const currentUser = getFromStorage(STORAGE_KEYS.CURRENT_USER, null);
    if (currentUser) {
        const scores = getFromStorage(STORAGE_KEYS.SCORES, {});
        if (!scores[currentUser.id]) {
            scores[currentUser.id] = {};
        }
        scores[currentUser.id]['assessment'] = {
            correct: correctCount,
            total: currentQuizQuestions.length,
            percentage: Math.round((correctCount / currentQuizQuestions.length) * 100),
            type: currentAssessmentType,
            completedAt: new Date().toISOString()
        };
        saveToStorage(STORAGE_KEYS.SCORES, scores);
        console.log('Assessment score saved:', scores[currentUser.id]['assessment']);
    }
}

// Show Assessment Result
function showAssessmentResult(correct, total) {
    const percentage = Math.round((correct / total) * 100);
    const resultDiv = document.getElementById('assessment-quiz-result');

    let resultClass, resultMessage;

    if (percentage >= 80) {
        resultClass = 'excellent';
        resultMessage = currentQuizLang === 'ar'
            ? 'أحسنت! نتيجتك ممتازة - لقد أتممت الدورة بنجاح'
            : 'Excellent ! Votre résultat est remarquable - Vous avez réussi le cours';
    } else if (percentage >= 50) {
        resultClass = 'good';
        resultMessage = currentQuizLang === 'ar'
            ? 'جيد! يمكنك تحسين نتيجتك - راجع الدروس%'
            : 'Bien ! Vous pouvez améliorer - Révisez les leçons';
    } else {
        resultClass = 'poor';
        resultMessage = currentQuizLang === 'ar'
            ? 'تحتاج إلى مراجعة الدروس بشكل أفضل'
            : 'Vous devez réviser les leçons plus attentivement';
    }

    resultDiv.innerHTML = `
        <div class="result-circle ${resultClass}">
            ${percentage}%
            <small>${correct}/${total}</small>
        </div>
        <h2>${resultMessage}</h2>
        <p>${currentQuizLang === 'ar'
            ? `لقد أجبت بشكل صحيح على ${correct} من ${total} سؤال`
            : `Vous avez répondu correctement à ${correct} questions sur ${total}`}</p>
        <div class="result-actions">
            <button onclick="retakeAssessment()">${currentQuizLang === 'ar' ? 'إعادة التقييم' : 'Refaire'}</button>
            <button class="retry-btn" onclick="closeAssessment()">${currentQuizLang === 'ar' ? 'العودة' : 'Retour'}</button>
        </div>
    `;

    resultDiv.classList.remove('hidden');
    resultDiv.scrollIntoView({ behavior: 'smooth' });
}

// Retake Assessment
function retakeAssessment() {
    selectedAnswers = [];
    quizSubmitted = false;
    document.getElementById('assessment-quiz-result').classList.add('hidden');
    document.getElementById('aq-submit-btn').disabled = false;
    renderAssessmentQuiz();
}

// Close Assessment
function closeAssessment() {
    document.querySelector('.assessment-container').classList.remove('hidden');
    document.getElementById('assessment-quiz-area').classList.add('hidden');
    document.getElementById('assessment-quiz-result').classList.add('hidden');
}

// Get Option Letter
function getOptionLetter(index) {
    const letters = ['أ', 'ب', 'ج', 'د'];
    const frLetters = ['A', 'B', 'C', 'D'];
    return currentQuizLang === 'ar' ? letters[index] : frLetters[index];
}