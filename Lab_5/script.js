"use strict";

// ============================================================================
// ЗАГАЛЬНІ ФУНКЦІЇ ТА МЕТОДИ DOM (Лаб 4 + Лаб 5)
// ============================================================================

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

function initTypewriterBanner() {
    const brandTitle = document.getElementById("brand-title");
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

function applyTimeOfDayBackground() {
    const isHomePage = document.body.classList.contains("home-page");
    if (!isHomePage) return;

    const currentHour = new Date().getHours();
    const isDayTime = currentHour >= 6 && currentHour < 21;
    const allElements = document.getElementsByTagName("*");

    for (let i = 0; i < allElements.length; i++) {
        const el = allElements[i];
        const bg = window.getComputedStyle(el).backgroundColor;
        if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
            if (isDayTime) {
                el.style.backgroundColor = adjustRgbBrightness(bg, 30);
            } else {
                el.style.backgroundColor = adjustRgbBrightness(bg, -23);
            }
        }
    }
}

function initDomManipulationDemo() {
    const noticeContainer = document.getElementById("dynamic-dom-status");
    if (!noticeContainer) return;

    const statusBadge = document.createElement("span");
    statusBadge.textContent = "Статус системи: завантаження...";
    statusBadge.setAttribute("data-state", "loading");
    noticeContainer.appendChild(statusBadge);

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

    prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        renderSlide(currentIndex);
    });

    nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % slides.length;
        renderSlide(currentIndex);
    });

    setInterval(() => {
        currentIndex = (currentIndex + 1) % slides.length;
        renderSlide(currentIndex);
    }, 4000);

    renderSlide(currentIndex);
}

function initServiceFocusModal() {
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
        document.body.style.overflow = "hidden";
        modalInput.focus();
    }

    function closeDiagnosticModal() {
        modalOverlay.style.display = "none";
        document.body.style.overflow = "";
    }

    function startFocusCountdown(serviceKey) {
        clearTimeout(focusTimerId);
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

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modalOverlay.style.display === "flex") {
            closeDiagnosticModal();
        }
    });
}

// ============================================================================
// 3. СТОРІНКА «ЗВОРОТНІЙ ЗВ'ЯЗОК» (feedback.html)
// ============================================================================

function initDetailsTooltip() {
    const detailsList = document.getElementsByName("details");
    const detailsField = detailsList.length > 0 ? detailsList[0] : document.getElementById("details");
    const tooltipBox = document.getElementById("details-tooltip");

    if (!detailsField || !tooltipBox) return;

    detailsField.onmouseover = function () {
        detailsField.style.backgroundColor = "#eef7ff";
        detailsField.style.border = "0.125rem solid #0b4f6c";
        detailsField.style.boxShadow = "0 0.25rem 0.75rem rgba(11, 79, 108, 0.25)";
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

function handlePurposeChange(selectElement) {
    const hint = document.querySelectorAll(".purpose-hint")[0];
    if (hint) {
        hint.textContent = `Обрана мета звернення: «${selectElement.options[selectElement.selectedIndex].text}»`;
    }
}

function handleQuickHelpClick() {
    alert("Підказка: заповніть усі обов'язкові поля форми та натисніть «Надіслати інформацію».");
}

// ============================================================================
// 4. ЛАБОРАТОРНА РОБОТА № 5: ЗАМІР МЕТРИК ЕФЕКТИВНОСТІ (Performance API)
// ============================================================================

function measureFrontendMetrics(jsStartTime) {
    const jsExecutionMs = Number((performance.now() - jsStartTime).toFixed(2));
    const navEntries = performance.getEntriesByType("navigation");
    const nav = navEntries.length > 0 ? navEntries[0] : null;
    const paintEntries = performance.getEntriesByType("paint");
    const fcpEntry = paintEntries.find(e => e.name === "first-contentful-paint");

    const metrics = {
        page: document.title,
        domInteractiveMs: nav ? Number(nav.domInteractive.toFixed(2)) : "N/A",
        pageLoadTimeMs: nav ? Number(nav.loadEventEnd.toFixed(2)) : "N/A",
        firstContentfulPaintMs: fcpEntry ? Number(fcpEntry.startTime.toFixed(2)) : "N/A",
        jsExecutionTimeMs: jsExecutionMs,
        domNodesCount: document.getElementsByTagName("*").length,
        jsHeapUsedMB: performance.memory
            ? Number((performance.memory.usedJSHeapSize / (1024 * 1024)).toFixed(2))
            : "N/A (тільки Chromium)"
    };

    console.group("Метрики ефективності фронтенду (Лаб 5)");
    console.table(metrics);
    console.groupEnd();
}

window.onload = function () {
    const jsStart = performance.now();

    initTypewriterBanner();
    applyTimeOfDayBackground();
    initDomManipulationDemo();
    initServicesCarousel();
    initServiceFocusModal();
    initDetailsTooltip();

    setTimeout(() => measureFrontendMetrics(jsStart), 100);
};