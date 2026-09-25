/* =========================================================
   MINDCARE
   Main Front-End Script
   Design baseline: index(6).html
   Prepared By: Eng Ahmad Ramadan
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* =====================================================
       CONFIG
    ===================================================== */

    const LANGUAGE_KEY = "mindcare_language";

    const state = {
        language: localStorage.getItem(LANGUAGE_KEY) || "ar",
        topics: [],
        providers: [],
        faq: [],
        assessmentStep: 0,
        assessmentAnswers: []
    };

    /* =====================================================
       DOM HELPERS
    ===================================================== */

    const $ = (selector, parent = document) =>
        parent.querySelector(selector);

    const $$ = (selector, parent = document) =>
        Array.from(parent.querySelectorAll(selector));

    const html = document.documentElement;

    /* =====================================================
       LOCAL FALLBACK DATA
       Used if Firebase data is unavailable
    ===================================================== */

    const fallbackTopics = [
        {
            key: "anxiety",
            titleAr: "القلق والتوتر",
            titleEn: "Anxiety & Stress",
            descriptionAr:
                "مساحة لفهم مشاعر القلق والتوتر والتعامل معها بخطوات عملية وداعمة.",
            descriptionEn:
                "A supportive space to understand anxiety and stress and work with them through practical steps.",
            symptoms: [
                "التفكير الزائد",
                "التوتر المستمر",
                "صعوبة الاسترخاء",
                "الخوف أو القلق المتكرر"
            ]
        },
        {
            key: "relationships",
            titleAr: "العلاقات",
            titleEn: "Relationships",
            descriptionAr:
                "مساعدة على فهم أنماط العلاقات، الحدود، التواصل والاحتياجات العاطفية.",
            descriptionEn:
                "Support for understanding relationship patterns, boundaries, communication and emotional needs.",
            symptoms: [
                "مشكلات التواصل",
                "الخلافات المتكررة",
                "صعوبة وضع الحدود",
                "الخوف من فقدان العلاقة"
            ]
        },
        {
            key: "self-esteem",
            titleAr: "الثقة بالنفس",
            titleEn: "Self-Esteem",
            descriptionAr:
                "استكشاف الصورة الذاتية وبناء علاقة أكثر توازنًا مع نفسك.",
            descriptionEn:
                "Explore self-image and develop a healthier relationship with yourself.",
            symptoms: [
                "انتقاد الذات",
                "الشعور بعدم الكفاية",
                "المقارنة بالآخرين",
                "الخوف من الفشل"
            ]
        },
        {
            key: "personal-growth",
            titleAr: "النمو الشخصي",
            titleEn: "Personal Growth",
            descriptionAr:
                "رحلة لفهم نفسك وأهدافك واتخاذ خطوات أكثر وضوحًا في حياتك.",
            descriptionEn:
                "A journey toward understanding yourself, your goals and taking clearer steps in life.",
            symptoms: [
                "الحيرة",
                "قلة الدافعية",
                "صعوبة اتخاذ القرارات",
                "الرغبة في تغيير نمط الحياة"
            ]
        },
        {
            key: "family",
            titleAr: "الدعم الأسري",
            titleEn: "Family Support",
            descriptionAr:
                "مساحة لفهم التحديات الأسرية وتحسين التواصل داخل الأسرة.",
            descriptionEn:
                "Support for understanding family challenges and improving communication within the family.",
            symptoms: [
                "الخلافات الأسرية",
                "صعوبة التواصل",
                "اختلاف وجهات النظر",
                "الضغط الأسري"
            ]
        },
        {
            key: "addiction",
            titleAr: "التعافي من الإدمان",
            titleEn: "Addiction Recovery",
            descriptionAr:
                "دعم نفسي يساعد على فهم السلوكيات الإدمانية وبناء خطوات نحو التعافي.",
            descriptionEn:
                "Psychological support for understanding addictive behaviors and building steps toward recovery.",
            symptoms: [
                "فقدان السيطرة",
                "الرغبة القهرية",
                "محاولات التوقف المتكررة",
                "تأثير السلوك على الحياة اليومية"
            ]
        }
    ];

    const fallbackProviders = [
        {
            nameAr: "فريق MindCare",
            nameEn: "MindCare Team",
            specialtyAr: "الدعم النفسي والنمو الشخصي",
            specialtyEn: "Mental Wellness & Personal Growth",
            bioAr:
                "فريق متخصص يهدف إلى توفير مساحة آمنة ومحترمة لفهم التحديات النفسية والشخصية.",
            bioEn:
                "A supportive team focused on creating a safe and respectful space for personal and emotional challenges."
        }
    ];

    const fallbackFAQ = [
        {
            qAr: "كيف يمكنني حجز جلسة؟",
            qEn: "How can I book a session?",
            aAr:
                "اضغط على أي زر «احجز الآن» ثم اختر المتخصص والتاريخ والوقت المتاح من المواعيد التي قام المسؤول بإضافتها.",
            aEn:
                "Click any “Book a session” button, then choose a specialist, date and available time from the slots created by the administrator."
        },
        {
            qAr: "هل يمكنني اختيار الموعد بنفسي؟",
            qEn: "Can I choose my appointment time?",
            aAr:
                "نعم. ستظهر لك فقط المواعيد المتاحة التي تم إضافتها مسبقًا من إدارة الموقع.",
            aEn:
                "Yes. You will only see available appointment slots previously added by the website administrator."
        },
        {
            qAr: "هل بياناتي خاصة؟",
            qEn: "Is my information private?",
            aAr:
                "نحن نتعامل مع بيانات الحجز باعتبارها معلومات خاصة ونستخدمها فقط لإدارة طلب الحجز والتواصل المتعلق به.",
            aEn:
                "Booking information is treated as private and is used to manage your booking request and related communication."
        },
        {
            qAr: "هل يمكنني إلغاء الحجز؟",
            qEn: "Can I cancel my booking?",
            aAr:
                "يمكن إلغاء الحجز من خلال آلية الإلغاء المتاحة للحجز. إذا لم تظهر لك آلية الإلغاء، تواصل مع إدارة الموقع.",
            aEn:
                "A booking can be cancelled through the available cancellation process. If it is not available, contact the website administration."
        },
        {
            qAr: "هل يمكنني استخدام الموقع باللغة الإنجليزية؟",
            qEn: "Can I use the website in English?",
            aAr:
                "نعم. اضغط على زر اللغة أعلى الصفحة للتبديل بين العربية والإنجليزية.",
            aEn:
                "Yes. Use the language button at the top of the page to switch between Arabic and English."
        }
    ];

    /* =====================================================
       LANGUAGE
    ===================================================== */

    function applyLanguage(lang) {
        state.language = lang === "en" ? "en" : "ar";

        localStorage.setItem(LANGUAGE_KEY, state.language);

        html.lang = state.language;
        html.dir = state.language === "ar" ? "rtl" : "ltr";

        $$("[data-ar][data-en]").forEach(element => {
            const value =
                state.language === "ar"
                    ? element.dataset.ar
                    : element.dataset.en;

            if (value !== undefined) {
                element.textContent = value;
            }
        });

        $$("[data-placeholder-ar][data-placeholder-en]").forEach(element => {
            element.placeholder =
                state.language === "ar"
                    ? element.dataset.placeholderAr
                    : element.dataset.placeholderEn;
        });

        const languageButton = $("#languageSwitch");

        if (languageButton) {
            languageButton.textContent =
                state.language === "ar"
                    ? "EN"
                    : "العربية";

            languageButton.setAttribute(
                "aria-label",
                state.language === "ar"
                    ? "Switch to English"
                    : "التبديل إلى العربية"
            );
        }

        updateDocumentMeta();
        renderDynamicContent();
    }

    function updateDocumentMeta() {
        const titleAr = "MindCare | Mental Wellness";
        const titleEn = "MindCare | Mental Wellness";

        const descriptionAr =
            "مساحة هادئة لفهم الصحة النفسية والوصول إلى الدعم المناسب.";

        const descriptionEn =
            "A calm space to understand mental wellness and find the right support.";

        document.title =
            state.language === "ar"
                ? titleAr
                : titleEn;

        const description = $('meta[name="description"]');

        if (description) {
            description.setAttribute(
                "content",
                state.language === "ar"
                    ? descriptionAr
                    : descriptionEn
            );
        }
    }

    const languageSwitch = $("#languageSwitch");

    if (languageSwitch) {
        languageSwitch.addEventListener("click", () => {
            applyLanguage(
                state.language === "ar"
                    ? "en"
                    : "ar"
            );
        });
    }

    /* =====================================================
       MOBILE MENU
    ===================================================== */

    const menuToggle = $("#menuToggle");
    const mainNav = $("#mainNav");

    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", () => {
            const isOpen =
                mainNav.classList.toggle("open");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );
        });

        $$(".main-nav a", mainNav).forEach(link => {
            link.addEventListener("click", () => {
                mainNav.classList.remove("open");
                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );
            });
        });
    }

    /* =====================================================
       SMOOTH SCROLL
    ===================================================== */

    $$("[data-scroll]").forEach(button => {
        button.addEventListener("click", event => {
            event.preventDefault();

            const targetId =
                button.dataset.scroll;

            if (!targetId) return;

            const target =
                document.getElementById(targetId);

            if (target) {
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });

    /* =====================================================
       BOOKING
    ===================================================== */

    function goToBooking() {
        window.location.href = "booking.html";
    }

    $$('[data-action="booking"]').forEach(button => {
        button.addEventListener("click", event => {
            event.preventDefault();
            goToBooking();
        });
    });

    /* =====================================================
       MODAL
    ===================================================== */

    const modalOverlay = $("#modalOverlay");
    const modalClose = $("#modalClose");
    const modalContent = $("#modalContent");

    function openModal(content) {
        if (!modalOverlay || !modalContent) return;

        modalContent.innerHTML = content;

        modalOverlay.classList.add("active");
        modalOverlay.setAttribute("aria-hidden", "false");

        document.body.classList.add("modal-open");
    }

    function closeModal() {
        if (!modalOverlay) return;

        modalOverlay.classList.remove("active");
        modalOverlay.setAttribute("aria-hidden", "true");

        document.body.classList.remove("modal-open");
    }

    if (modalClose) {
        modalClose.addEventListener(
            "click",
            closeModal
        );
    }

    if (modalOverlay) {
        modalOverlay.addEventListener(
            "click",
            event => {
                if (
                    event.target === modalOverlay
                ) {
                    closeModal();
                }
            }
        );
    }

    document.addEventListener(
        "keydown",
        event => {
            if (event.key === "Escape") {
                closeModal();
            }
        }
    );

    /* =====================================================
       TOPICS
    ===================================================== */

    function renderTopics() {
        const container = $("#topicsGrid");

        if (!container) return;

        const topics =
            state.topics.length
                ? state.topics
                : fallbackTopics;

        container.innerHTML = "";

        topics
            .filter(topic => topic.active !== false)
            .forEach(topic => {
                const title =
                    state.language === "ar"
                        ? topic.titleAr
                        : topic.titleEn;

                const description =
                    state.language === "ar"
                        ? topic.descriptionAr
                        : topic.descriptionEn;

                const article =
                    document.createElement("article");

                article.className =
                    "card topic-card";

                article.innerHTML = `
                    <div class="card-content">
                        <h3>${escapeHTML(title || "")}</h3>

                        <p>
                            ${escapeHTML(description || "")}
                        </p>

                        <button
                            class="text-button"
                            type="button"
                            data-topic-key="${escapeHTML(topic.key || "")}"
                        >
                            ${
                                state.language === "ar"
                                    ? "اعرف المزيد"
                                    : "Learn more"
                            }
                        </button>
                    </div>
                `;

                container.appendChild(article);
            });

        $$("[data-topic-key]", container)
            .forEach(button => {
                button.addEventListener(
                    "click",
                    () => {
                        const topic =
                            topics.find(
                                item =>
                                    item.key ===
                                    button.dataset.topicKey
                            );

                        if (topic) {
                            openTopic(topic);
                        }
                    }
                );
            });
    }

    function openTopic(topic) {
        const title =
            state.language === "ar"
                ? topic.titleAr
                : topic.titleEn;

        const description =
            state.language === "ar"
                ? topic.descriptionAr
                : topic.descriptionEn;

        const symptoms =
            Array.isArray(topic.symptoms)
                ? topic.symptoms
                : [];

        const symptomsTitle =
            state.language === "ar"
                ? "قد تشمل التجربة:"
                : "You may experience:";

        const bookingText =
            state.language === "ar"
                ? "احجز جلسة"
                : "Book a session";

        openModal(`
            <div class="modal-topic">
                <h2>${escapeHTML(title || "")}</h2>

                <p>
                    ${escapeHTML(description || "")}
                </p>

                ${
                    symptoms.length
                        ? `
                            <h3>${symptomsTitle}</h3>
                            <ul>
                                ${symptoms
                                    .map(
                                        item =>
                                            `<li>${escapeHTML(item)}</li>`
                                    )
                                    .join("")}
                            </ul>
                        `
                        : ""
                }

                <button
                    type="button"
                    class="btn btn-primary"
                    data-modal-booking
                >
                    ${bookingText}
                </button>
            </div>
        `);

        const bookingButton =
            $("[data-modal-booking]");

        if (bookingButton) {
            bookingButton.addEventListener(
                "click",
                goToBooking
            );
        }
    }

    /* =====================================================
       SPECIALISTS
    ===================================================== */

    function renderProviders() {
        const container =
            $("#specialistsGrid");

        if (!container) return;

        const providers =
            state.providers.length
                ? state.providers
                : fallbackProviders;

        container.innerHTML = "";

        providers
            .filter(
                provider =>
                    provider.active !== false
            )
            .forEach(provider => {
                const name =
                    state.language === "ar"
                        ? provider.nameAr
                        : provider.nameEn;

                const specialty =
                    state.language === "ar"
                        ? provider.specialtyAr
                        : provider.specialtyEn;

                const bio =
                    state.language === "ar"
                        ? provider.bioAr
                        : provider.bioEn;

                const card =
                    document.createElement("article");

                card.className =
                    "specialist-card";

                card.innerHTML = `
                    <div class="specialist-content">

                        <div class="specialist-avatar">
                            ${getInitials(name)}
                        </div>

                        <h3>
                            ${escapeHTML(name || "")}
                        </h3>

                        <p class="specialty">
                            ${escapeHTML(specialty || "")}
                        </p>

                        ${
                            bio
                                ? `<p>${escapeHTML(bio)}</p>`
                                : ""
                        }

                        <button
                            type="button"
                            class="btn btn-primary"
                            data-action="booking"
                        >
                            ${
                                state.language === "ar"
                                    ? "احجز جلسة"
                                    : "Book a session"
                            }
                        </button>

                    </div>
                `;

                container.appendChild(card);
            });

        $$(
            '[data-action="booking"]',
            container
        ).forEach(button => {
            button.addEventListener(
                "click",
                goToBooking
            );
        });
    }

    function getInitials(name = "") {
        const parts =
            String(name)
                .trim()
                .split(/\s+/)
                .filter(Boolean);

        if (!parts.length) {
            return "M";
        }

        if (state.language === "ar") {
            return parts
                .slice(0, 2)
                .map(word => word.charAt(0))
                .join("");
        }

        return parts
            .slice(0, 2)
            .map(word => word.charAt(0))
            .join("")
            .toUpperCase();
    }

    /* =====================================================
       FAQ
    ===================================================== */

    function renderFAQ() {
        const container = $("#faqList");

        if (!container) return;

        const faq =
            state.faq.length
                ? state.faq
                : fallbackFAQ;

        container.innerHTML = "";

        faq.forEach((item, index) => {
            const question =
                state.language === "ar"
                    ? item.qAr
                    : item.qEn;

            const answer =
                state.language === "ar"
                    ? item.aAr
                    : item.aEn;

            const faqItem =
                document.createElement("div");

            faqItem.className =
                "faq-item";

            faqItem.innerHTML = `
                <button
                    type="button"
                    class="faq-question"
                    aria-expanded="false"
                    aria-controls="faq-answer-${index}"
                >
                    <span>
                        ${escapeHTML(question || "")}
                    </span>

                    <span
                        class="faq-icon"
                        aria-hidden="true"
                    >
                        +
                    </span>
                </button>

                <div
                    id="faq-answer-${index}"
                    class="faq-answer"
                    hidden
                >
                    <p>
                        ${escapeHTML(answer || "")}
                    </p>
                </div>
            `;

            container.appendChild(faqItem);
        });

        $$(".faq-question", container)
            .forEach(button => {
                button.addEventListener(
                    "click",
                    () => {
                        const expanded =
                            button.getAttribute(
                                "aria-expanded"
                            ) === "true";

                        const answer =
                            document.getElementById(
                                button.getAttribute(
                                    "aria-controls"
                                )
                            );

                        button.setAttribute(
                            "aria-expanded",
                            String(!expanded)
                        );

                        if (answer) {
                            answer.hidden =
                                expanded;
                        }

                        const icon =
                            $(".faq-icon", button);

                        if (icon) {
                            icon.textContent =
                                expanded
                                    ? "+"
                                    : "−";
                        }
                    }
                );
            });
    }

    /* =====================================================
       ASSESSMENT
    ===================================================== */

    const assessmentQuestions = {
        ar: [
            {
                question:
                    "خلال الفترة الأخيرة، كيف تصف مستوى التوتر لديك؟",
                options: [
                    "منخفض",
                    "متوسط",
                    "مرتفع",
                    "مرتفع جدًا"
                ]
            },
            {
                question:
                    "هل يؤثر التفكير الزائد على يومك؟",
                options: [
                    "نادراً",
                    "أحيانًا",
                    "غالبًا",
                    "بشكل واضح"
                ]
            },
            {
                question:
                    "كيف تشعر تجاه علاقاتك مع الآخرين؟",
                options: [
                    "مستقرة",
                    "بها بعض التحديات",
                    "تسبب لي ضغطًا",
                    "أشعر بصعوبة كبيرة"
                ]
            },
            {
                question:
                    "كيف ترى علاقتك بنفسك؟",
                options: [
                    "إيجابية",
                    "مقبولة",
                    "أحتاج إلى تحسينها",
                    "أواجه صعوبة واضحة"
                ]
            }
        ],

        en: [
            {
                question:
                    "How would you describe your stress level recently?",
                options: [
                    "Low",
                    "Moderate",
                    "High",
                    "Very high"
                ]
            },
            {
                question:
                    "Does overthinking affect your daily life?",
                options: [
                    "Rarely",
                    "Sometimes",
                    "Often",
                    "Significantly"
                ]
            },
            {
                question:
                    "How do you feel about your relationships?",
                options: [
                    "Stable",
                    "Some challenges",
                    "They cause me stress",
                    "I find them very difficult"
                ]
            },
            {
                question:
                    "How would you describe your relationship with yourself?",
                options: [
                    "Positive",
                    "Acceptable",
                    "I want to improve it",
                    "I struggle with it"
                ]
            }
        ]
    };

    function startAssessment() {
        state.assessmentStep = 0;
        state.assessmentAnswers = [];

        renderAssessmentQuestion();

        if (modalOverlay) {
            modalOverlay.classList.add("active");
            modalOverlay.setAttribute(
                "aria-hidden",
                "false"
            );

            document.body.classList.add(
                "modal-open"
            );
        }
    }

    function renderAssessmentQuestion() {
        const questions =
            assessmentQuestions[state.language];

        const current =
            questions[state.assessmentStep];

        if (!current) {
            showAssessmentResult();
            return;
        }

        const total = questions.length;

        const questionNumber =
            state.assessmentStep + 1;

        openModal(`
            <div class="assessment-modal">

                <div class="assessment-progress">
                    ${
                        state.language === "ar"
                            ? `السؤال ${questionNumber} من ${total}`
                            : `Question ${questionNumber} of ${total}`
                    }
                </div>

                <h2>
                    ${escapeHTML(current.question)}
                </h2>

                <div class="assessment-options">
                    ${current.options
                        .map(
                            (option, index) => `
                                <button
                                    type="button"
                                    class="assessment-option"
                                    data-answer="${index + 1}"
                                >
                                    ${escapeHTML(option)}
                                </button>
                            `
                        )
                        .join("")}
                </div>

            </div>
        `);

        $$(".assessment-option")
            .forEach(button => {
                button.addEventListener(
                    "click",
                    () => {
                        state.assessmentAnswers.push(
                            Number(
                                button.dataset.answer
                            )
                        );

                        state.assessmentStep++;

                        renderAssessmentQuestion();
                    }
                );
            });
    }

    function showAssessmentResult() {
        const score =
            state.assessmentAnswers.reduce(
                (sum, value) =>
                    sum + value,
                0
            );

        const average =
            score /
            state.assessmentAnswers.length;

        let level;

        if (average <= 1.5) {
            level =
                state.language === "ar"
                    ? "يبدو أن مستوى التحديات التي أشرت إليها منخفض نسبيًا."
                    : "Your responses suggest a relatively low level of difficulty.";
        } else if (average <= 2.5) {
            level =
                state.language === "ar"
                    ? "تشير إجاباتك إلى وجود بعض التحديات التي قد يكون من المفيد فهمها بشكل أعمق."
                    : "Your responses suggest some challenges that may be worth exploring further.";
        } else if (average <= 3.5) {
            level =
                state.language === "ar"
                    ? "تشير إجاباتك إلى وجود ضغوط أو تحديات ملحوظة."
                    : "Your responses suggest noticeable stress or challenges.";
        } else {
            level =
                state.language === "ar"
                    ? "تشير إجاباتك إلى وجود تحديات واضحة قد تستفيد من دعم متخصص."
                    : "Your responses suggest significant challenges that may benefit from professional support.";
        }

        const title =
            state.language === "ar"
                ? "نتيجة التقييم المبدئي"
                : "Initial Assessment Result";

        const note =
            state.language === "ar"
                ? "هذا التقييم مبدئي ولا يُعد تشخيصًا طبيًا أو نفسيًا."
                : "This assessment is only an initial screening and is not a medical or psychological diagnosis.";

        const booking =
            state.language === "ar"
                ? "حجز جلسة"
                : "Book a session";

        openModal(`
            <div class="assessment-result">

                <h2>
                    ${title}
                </h2>

                <p>
                    ${escapeHTML(level)}
                </p>

                <small>
                    ${escapeHTML(note)}
                </small>

                <button
                    type="button"
                    class="btn btn-primary"
                    data-assessment-booking
                >
                    ${booking}
                </button>

            </div>
        `);

        const button =
            $("[data-assessment-booking]");

        if (button) {
            button.addEventListener(
                "click",
                goToBooking
            );
        }
    }

    $$('[data-action="assessment"]')
        .forEach(button => {
            button.addEventListener(
                "click",
                event => {
                    event.preventDefault();
                    startAssessment();
                }
            );
        });

    /* =====================================================
       DYNAMIC CONTENT
    ===================================================== */

    function renderDynamicContent() {
        renderTopics();
        renderProviders();
        renderFAQ();
    }

    /* =====================================================
       FIREBASE
       Optional public read
    ===================================================== */

    async function loadFirebaseData() {
        try {
            if (
                !window.MINDCARE_FIREBASE_CONFIG
            ) {
                return;
            }

            const config =
                window.MINDCARE_FIREBASE_CONFIG;

            if (!config.projectId) {
                return;
            }

            const {
                initializeApp
            } = await import(
                "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js"
            );

            const {
                getFirestore,
                collection,
                getDocs,
                query,
                where
            } = await import(
                "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js"
            );

            const app =
                initializeApp(config);

            const db =
                getFirestore(app);

            /* -------------------------------
               Providers
            ------------------------------- */

            try {
                const providerQuery =
                    query(
                        collection(
                            db,
                            "providers"
                        ),
                        where(
                            "active",
                            "==",
                            true
                        )
                    );

                const snapshot =
                    await getDocs(
                        providerQuery
                    );

                const providers =
                    snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));

                if (providers.length) {
                    state.providers =
                        providers;
                }
            } catch (error) {
                console.warn(
                    "MindCare providers unavailable:",
                    error
                );
            }

            /* -------------------------------
               Topics
            ------------------------------- */

            try {
                const topicQuery =
                    query(
                        collection(
                            db,
                            "topics"
                        ),
                        where(
                            "active",
                            "==",
                            true
                        )
                    );

                const snapshot =
                    await getDocs(
                        topicQuery
                    );

                const topics =
                    snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));

                if (topics.length) {
                    state.topics =
                        topics;
                }
            } catch (error) {
                console.warn(
                    "MindCare topics unavailable:",
                    error
                );
            }

            renderDynamicContent();

        } catch (error) {
            console.warn(
                "MindCare Firebase public loading skipped:",
                error
            );
        }
    }

    /* =====================================================
       SECURITY / HTML ESCAPING
    ===================================================== */

    function escapeHTML(value) {
        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    /* =====================================================
       ACCESSIBILITY
    ===================================================== */

    if (modalOverlay) {
        modalOverlay.setAttribute(
            "aria-hidden",
            "true"
        );
    }

    if (menuToggle) {
        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );
    }

    /* =====================================================
       INITIALIZATION
    ===================================================== */

    applyLanguage(state.language);

    loadFirebaseData();

});
