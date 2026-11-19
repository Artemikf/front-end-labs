"use strict";

// ============================================================================
// ЗАГАЛЬНІ ФУНКЦІЇ ТА МЕТОДИ DOM (Manual_to_Lab_4.pdf)
// ============================================================================

// Допоміжна функція зміни освітленості RGB-кольору (для вимоги п. 5 Варіанту 8)
function adjustRgbBrightness(rgbString, percentDelta) {
    const match = rgbString.match(/\d+/g);
    if (!match || match.length < 3) return rgbString;

    const factor = 1 + percentDelta / 100;
    const r = Math.min(255, Math.max(0, Math.round(Number(match[0]) * factor)));
    const g = Math.min(255, Math.max(0, Math.round(Number(match[1]) * factor)));
    const b = Math.min(255, Math.max(0, Math.round(Number(match[2]) * factor)));
    return `rgb(${r}, ${g}, ${b})`;
}

// ============================================================================
// 1. ГОЛОВНА СТОРІНКА (index.html)
// ============================================================================

// Пункт 1 (Варіант 8): Самодрукований текст нижче назви на тому ж фоні,
// зеленим кольором, товщина гліфу (font-weight) у 1.5 рази більша, ніж текст назви.
function initTypewriterBanner() {
    const brandTitle = document.getElementById("brand-title"); // пошук за getElementById()
    const typewriterEl = document.getElementById("typewriter-info");
    if (!brandTitle || !typewriterEl) return;

    const titleComputedStyle = window.getComputedStyle(brandTitle);
    const titleWeight = parseInt(titleComputedStyle.fontWeight, 10) || 600;
    const targetWeight = Math.min(900, Math.round(titleWeight * 1.5));

    typewriterEl.style.color = "green";
    typewriterEl.style.fontWeight = String(targetWeight);

    const promoText = "Вітаємо з прийдешніми святами! Графік роботи онлайн-консультацій: Пн–Нд з 08:00 до 22:00 без вихідних.";
    let charIndex = 0;

    function typeNextChar() {
        if (charIndex < promoText.length) {
            typewriterEl.textContent += promoText.charAt(charIndex);
            charIndex++;
            setTimeout(typeNextChar, 45);
        }
    }

    typewriterEl.textContent = "";
    typeNextChar();
}

// Пункт 5 (Варіант 8): У період з 6 год до 21 год колір фону всіх елементів
// світліший на 30% за колір в інший час (21:00 - 06:00).
function applyTimeOfDayBackground() {
    const isHomePage = document.body.classList.contains("home-page");
    if (!isHomePage) return;

    const currentHour = new Date().getHours();
    const isDayTime = currentHour >= 6 && currentHour < 21;

    // Використовуємо getElementsByTagName() для обходу всіх елементів сторінки
    const allElements = document.getElementsByTagName("*");

    for (let i = 0; i < allElements.length; i++) {
        const el = allElements[i];
        const bg = window.getComputedStyle(el).backgroundColor;
        if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
            // Базовий нічний фон темніший, вдень (06:00 - 21:00) робимо його на 30% світлішим
            if (isDayTime) {
                el.style.backgroundColor = adjustRgbBrightness(bg, 30);
            } else {
                el.style.backgroundColor = adjustRgbBrightness(bg, -23);
            }
        }
    }
}

// Демонстрація маніпуляцій DOM (appendChild, replaceChild, setAttribute) на Головній сторінці
function initDomManipulationDemo() {
    const noticeContainer = document.getElementById("dynamic-dom-status");
    if (!noticeContainer) return;

    // 1. Створення та додавання через appendChild()
    const statusBadge = document.createElement("span");
    statusBadge.textContent = "Статус системи: завантаження...";
    statusBadge.setAttribute("data-state", "loading"); // setAttribute()
    noticeContainer.appendChild(statusBadge);

    // 2. Заміна елемента через replaceChild() після короткої затримки
    setTimeout(() => {
        const readyBadge = document.createElement("span");
        readyBadge.textContent = "Статус системи: онлайн-консультанти на зв'язку";
        readyBadge.setAttribute("data-state", "ready");
        if (statusBadge.parentNode === noticeContainer) {
            noticeContainer.replaceChild(readyBadge, statusBadge);
        }
    }, 1500);
}

// ============================================================================
// 2. СТОРІНКА «ПОСЛУГИ» (services.html)
// ============================================================================

// Пункт 2 (Варіант 8): Карусель зображень послуг по центру під блоком назви
// та логотипу; висота елементів каруселі не більше 20% від висоти вікна (20vh).
function initServicesCarousel() {
    const carouselImg = document.getElementById("carousel-image");
    const carouselCaption = document.getElementById("carousel-caption");
    const prevBtn = document.getElementById("carousel-prev");
    const nextBtn = document.getElementById("carousel-next");

    if (!carouselImg || !prevBtn || !nextBtn) return;

    const slides = [
        { src: "images/service_therapist.jpg", title: "Первинна онлайн-консультація лікаря-терапевта" },
        { src: "images/service_psychologist.jpg", title: "Індивідуальна консультація клінічного психолога" },
        { src: "images/service_diagnostics.jpg", title: "Розшифровка лабораторних аналізів та УЗД/МРТ" },
        { src: "images/service_pediatrician.jpg", title: "Онлайн-консультація лікаря-педіатра" },
        { src: "images/service_nutritionist.jpg", title: "Консультація лікаря-дієтолога та нутриціолога" }
    ];

    let currentIndex = 0;

    function renderSlide(idx) {
        carouselImg.setAttribute("src", slides[idx].src);
        carouselImg.setAttribute("alt", slides[idx].title);
        if (carouselCaption) {
            carouselCaption.textContent = `${idx + 1} / ${slides.length}: ${slides[idx].title}`;
        }
    }

    // Обробка подій через addEventListener()
    prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        renderSlide(currentIndex);
    });

    nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % slides.length;
        renderSlide(currentIndex);
    });

    // Автоматичне гортання кожні 4 секунди
    setInterval(() => {
        currentIndex = (currentIndex + 1) % slides.length;
        renderSlide(currentIndex);
    }, 4000);

    renderSlide(currentIndex);
}

// Пункт 3 (Варіант 8): Фокусування на будь-якому лоті сторінки «Послуги» протягом 40 сек
// відкриває модальне вікно (поверх сторінки, з її блокуванням) із питанням на
// перевірку відповідності потреби користувача та полем вводу відповіді.
function initServiceFocusModal() {
    // Використовуємо getElementsByClassName() для пошуку карток послуг
    const cards = document.getElementsByClassName("service-card");
    const modalOverlay = document.getElementById("diagnostic-modal-overlay");
    const modalQuestion = document.getElementById("modal-question-text");
    const modalInput = document.getElementById("modal-answer-input");
    const modalFeedback = document.getElementById("modal-feedback-text");
    const modalCheckBtn = document.getElementById("modal-check-btn");
    const modalCloseBtn = document.getElementById("modal-close-btn");

    if (!cards.length || !modalOverlay) return;

    const serviceQuestions = {
        "1": {
            question: "Послуга «Терапевт»: Які основні скарги вас турбують (температура, тиск, біль) та як давно вони з'явилися?",
            keywords: ["температур", "тиск", "біль", "кашел", "слабк", "дн", "тиж", "горл"]
        },
        "2": {
            question: "Послуга «Клінічний психолог»: Як часто ви відчуваєте тривогу, порушення сну або емоційне виснаження?",
            keywords: ["щодня", "часто", "сон", "тривог", "стрес", "постійно", "рідко", "тиж"]
        },
        "3": {
            question: "Послуга «Розшифровка аналізів»: Який саме вид дослідження вам потрібно розшифрувати (кров, гормони, УЗД, МРТ)?",
            keywords: ["кров", "гормон", "узд", "мрт", "аналіз", "біохім", "загальн"]
        },
        "4": {
            question: "Послуга «Педіатр»: Вкажіть вік дитини та основні симптоми або питання щодо вакцинації/харчування:",
            keywords: ["рок", "міс", "температур", "вакцин", "харчуван", "кашел", "дити"]
        },
        "5": {
            question: "Послуга «Дієтолог»: Яка ваша головна мета консультації (корекція ваги, лікувальний раціон, підбір харчування)?",
            keywords: ["ваг", "раціон", "харчуван", "дієт", "здоров", "обмін", "схуд"]
        }
    };

    let focusTimerId = null;
    let activeServiceKey = "1";

    function openDiagnosticModal(serviceKey) {
        activeServiceKey = serviceKey;
        const item = serviceQuestions[serviceKey] || serviceQuestions["1"];
        modalQuestion.textContent = item.question;
        modalInput.value = "";
        modalFeedback.textContent = "";
        modalOverlay.style.display = "flex";
        document.body.style.overflow = "hidden"; // Блокування прокручування сторінки
        modalInput.focus();
    }

    function closeDiagnosticModal() {
        modalOverlay.style.display = "none";
        document.body.style.overflow = "";
    }

    function startFocusCountdown(serviceKey) {
        clearTimeout(focusTimerId);
        // Точно 40 секунд (40 000 мс) за вимогою Варіанту 8
        focusTimerId = setTimeout(() => {
            openDiagnosticModal(serviceKey);
        }, 40000);
    }

    function cancelFocusCountdown() {
        clearTimeout(focusTimerId);
    }

    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const key = card.getAttribute("data-service-id") || String(i + 1);

        // Підтримуємо як клавіатурний фокус (focusin/focusout), так і наведення/утримання уваги на лоті
        card.addEventListener("focusin", () => startFocusCountdown(key));
        card.addEventListener("focusout", cancelFocusCountdown);
        card.addEventListener("mouseenter", () => startFocusCountdown(key));
        card.addEventListener("mouseleave", cancelFocusCountdown);
    }

    modalCheckBtn.addEventListener("click", () => {
        const userAnswer = modalInput.value.trim().toLowerCase();
        if (userAnswer.length < 3) {
            modalFeedback.style.color = "crimson";
            modalFeedback.textContent = "Будь ласка, введіть розгорнуту відповідь (мінімум 3 символи).";
            return;
        }

        const item = serviceQuestions[activeServiceKey] || serviceQuestions["1"];
        const isRelevant = item.keywords.some(kw => userAnswer.includes(kw));

        if (isRelevant) {
            modalFeedback.style.color = "green";
            modalFeedback.textContent = "Дякуємо! Ваші симптоми/потреби повністю відповідають профілю обраної послуги. Можете оформити запис.";
        } else {
            modalFeedback.style.color = "#b7791f";
            modalFeedback.textContent = "Відповідь зафіксовано. Лікар уточнить деталі під час консультації або порекомендує суміжного спеціаліста.";
        }
    });

    modalCloseBtn.addEventListener("click", closeDiagnosticModal);

    // HTML-подія onkeydown для закриття модального вікна клавішею Escape
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modalOverlay.style.display === "flex") {
            closeDiagnosticModal();
        }
    });
}

// ============================================================================
// 3. СТОРІНКА «ЗВОРОТНІЙ ЗВ'ЯЗОК» (feedback.html)
// ============================================================================

// Пункт 4 (Варіант 8): При наведенні курсора миші на поле «Детально» воно змінює
// колір фону, з'являється рамка та тінь від неї, а праворуч нього з'являється
// текст-підказка (tooltip) «Вдячні за Ваш час! Конкретизуйте мету звернення, будь ласка».
function initDetailsTooltip() {
    // Використовуємо querySelectorAll() та getElementsByName() для демонстрації методів пошуку
    const detailsList = document.getElementsByName("details");
    const detailsField = detailsList.length > 0 ? detailsList[0] : document.getElementById("details");
    const tooltipBox = document.getElementById("details-tooltip");

    if (!detailsField || !tooltipBox) return;

    // Спосіб 2 обробки подій (Manual_to_Lab_4.pdf): властивість об'єкта DOM (onmouseover / onmouseout)
    detailsField.onmouseover = function () {
        detailsField.style.backgroundColor = "#eef7ff";
        detailsField.style.border = "2px solid #0b4f6c";
        detailsField.style.boxShadow = "0 4px 12px rgba(11, 79, 108, 0.25)";
        tooltipBox.textContent = "Вдячні за Ваш час! Конкретизуйте мету звернення, будь ласка";
        tooltipBox.style.display = "inline-block";
    };

    detailsField.onmouseout = function () {
        detailsField.style.backgroundColor = "";
        detailsField.style.border = "";
        detailsField.style.boxShadow = "";
        tooltipBox.style.display = "none";
    };
}

// Функції для демонстрації атрибута onПодія у HTML (onclick, onchange)
function handlePurposeChange(selectElement) {
    const hint = document.querySelectorAll(".purpose-hint")[0]; // querySelectorAll()
    if (hint) {
        hint.textContent = `Обрана мета звернення: «${selectElement.options[selectElement.selectedIndex].text}»`;
    }
}

function handleQuickHelpClick() {
    alert("Підказка: заповніть усі обов'язкові поля форми та натисніть «Надіслати інформацію».");
}

// ============================================================================
// ІНІЦІАЛІЗАЦІЯ ПІСЛЯ ЗАВАНТАЖЕННЯ ДОКУМЕНТА (подія onload / DOMContentLoaded)
// ============================================================================
window.onload = function () {
    initTypewriterBanner();
    applyTimeOfDayBackground();
    initDomManipulationDemo();
    initServicesCarousel();
    initServiceFocusModal();
    initDetailsTooltip();
};