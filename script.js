/* =========================================================
   MindCare
   Main JavaScript
   Compatible with current index.html
   Prepared By: Eng Ahmad Ramadan
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const html = document.documentElement;
    const body = document.body;

    const languageSwitch =
        document.getElementById("languageSwitch");

    const menuToggle =
        document.getElementById("menuToggle");

    const mainNav =
        document.getElementById("mainNav");

    const currentYear =
        document.getElementById("currentYear");

    /* =====================================================
       LANGUAGE
    ===================================================== */

    const LANGUAGE_KEY = "mindcare_language";

    let currentLanguage =
        localStorage.getItem(LANGUAGE_KEY) || "ar";

    if (
        currentLanguage !== "ar" &&
        currentLanguage !== "en"
    ) {
        currentLanguage = "ar";
    }


    /* =====================================================
       TRANSLATION DATA
    ===================================================== */

    const translations = {

        ar: {

            /* ---------------- HEADER ---------------- */

            ".nav-link[href='#home']":
                "الرئيسية",

            ".nav-link[href='#how-it-works']":
                "كيف تعمل",

            ".nav-link[href='#services']":
                "الخدمات",

            ".nav-link[href='#specialists']":
                "المختصون",

            ".nav-link[href='#faq']":
                "الأسئلة",

            ".header-book-btn":
                "احجز جلستك",

            /* ---------------- HERO ---------------- */

            ".hero-badge span:last-child":
                "Mental Wellness Platform",

            ".hero-content h1":
                "مساحة آمنة",

            ".hero-content h1 span":
                "للاهتمام بعقلك.",

            ".hero-description":
                "MindCare تساعدك على الوصول إلى المختص المناسب لك، وفهم احتياجاتك، وحجز جلستك بسهولة في تجربة رقمية بسيطة وهادئة.",

            ".hero-actions .primary-btn":
                "احجز جلستك",

            ".hero-actions .secondary-btn":
                "كيف تعمل MindCare؟",

            ".trust-item:nth-child(1) span":
                "خصوصية واهتمام",

            ".trust-item:nth-child(2) span":
                "حجز إلكتروني",

            ".trust-item:nth-child(3) span":
                "مختصون",

            ".small-label":
                "YOUR WELLBEING",

            ".wellness-card-top h3":
                "Your mind matters.",

            ".wellness-message strong":
                "خذ وقتك.",

            ".wellness-message p":
                "الاهتمام بنفسك يبدأ بخطوة صغيرة.",

            ".calendar-header strong":
                "مواعيد متاحة",

            ".calendar-header span":
                "THIS WEEK",

            ".card-book-btn":
                "اختر موعدك",

            ".specialist-floating-card span":
                "SPECIALIST",

            ".specialist-floating-card strong":
                "Tasbeh Mohamed",

            ".privacy-floating-card span":
                "YOUR SPACE",

            ".privacy-floating-card strong":
                "خصوصيتك مهمة",

            /* ---------------- VALUE ---------------- */

            "#value .section-kicker":
                "WHY MINDCARE",

            ".value-heading h2":
                "لأن الاهتمام بعقلك يستحق مساحة واضحة.",

            ".value-description p":
                "صممنا MindCare لتجعل الوصول إلى خدمات الدعم النفسي أكثر بساطة ووضوحًا، بدايةً من اختيار المختص وحتى حجز الموعد.",

            ".value-description .text-link":
                "تعرف على طريقة العمل",

            ".value-card:nth-child(1) h3":
                "اختيار واضح",

            ".value-card:nth-child(1) p":
                "تعرف على المختصين المتاحين واختر الشخص المناسب لاحتياجك.",

            ".value-card:nth-child(2) h3":
                "مواعيد متاحة",

            ".value-card:nth-child(2) p":
                "اعرض المواعيد المتاحة واختر اليوم والوقت المناسبين لك.",

            ".value-card:nth-child(3) h3":
                "مساحة خاصة",

            ".value-card:nth-child(3) p":
                "تجربة مصممة لتقليل التعقيد والحفاظ على وضوح رحلة الحجز.",

            ".value-card:nth-child(4) h3":
                "تجربة بسيطة",

            ".value-card:nth-child(4) p":
                "يمكنك استخدام المنصة بسهولة من الهاتف أو الكمبيوتر.",

            /* ---------------- SERVICES ---------------- */

            "#services .section-kicker":
                "SERVICES",

            "#services .section-heading h2":
                "دعم يناسب احتياجاتك.",

            "#services .section-heading p":
                "كل تجربة مختلفة. لذلك يمكنك استكشاف مجموعة من المساحات التي قد تتناسب مع احتياجك الحالي.",

            ".service-card:nth-child(1) h3":
                "القلق والضغط النفسي",

            ".service-card:nth-child(1) p":
                "مساحة لفهم التوتر والضغوط اليومية والتعامل مع الأفكار والمشاعر المرتبطة بها.",

            ".service-card:nth-child(2) h3":
                "العلاقات",

            ".service-card:nth-child(2) p":
                "فهم أنماط العلاقات والتواصل والحدود والتحديات العاطفية.",

            ".service-card:nth-child(3) h3":
                "تقدير الذات",

            ".service-card:nth-child(3) p":
                "فهم الصورة التي تحملها عن نفسك والعمل على بناء نظرة أكثر توازنًا.",

            ".service-card:nth-child(4) h3":
                "النمو الشخصي",

            ".service-card:nth-child(4) p":
                "مساحة لفهم أهدافك والتحديات التي تواجهها والعمل على خطوات مناسبة لك.",

            ".service-card:nth-child(5) h3":
                "الدعم الأسري",

            ".service-card:nth-child(5) p":
                "التعامل مع التحديات الأسرية وتحسين التواصل وفهم المواقف الصعبة.",

            ".service-card:nth-child(6) h3":
                "الإرشاد الشخصي",

            ".service-card:nth-child(6) p":
                "مساحة لترتيب أفكارك وفهم أهدافك والعمل على خطوات أكثر وضوحًا.",

            ".service-card .service-link":
                "اكتشف المزيد",

            ".services-section .outline-btn":
                "استكشف المختصين",

            /* ---------------- SPECIALISTS ---------------- */

            "#specialists .section-kicker":
                "SPECIALISTS",

            "#specialists .section-heading h2":
                "اختر المساحة المناسبة لك.",

            "#specialists .section-heading p":
                "تعرف على المختصين المتاحين ثم انتقل مباشرة إلى المواعيد الخاصة بكل مختص.",

            ".specialist-card:nth-child(1) .specialist-role":
                "MENTAL WELLNESS",

            ".specialist-card:nth-child(1) h3":
                "Tasbeh Mohamed",

            ".specialist-card:nth-child(1) .specialist-content > p":
                "مساحة مخصصة للاستماع وفهم التحديات والعمل على خطوات مناسبة لاحتياجاتك.",

            ".specialist-card:nth-child(1) .specialist-tags span:nth-child(1)":
                "الدعم الشخصي",

            ".specialist-card:nth-child(1) .specialist-tags span:nth-child(2)":
                "النمو الشخصي",

            ".specialist-card:nth-child(1) .specialist-tags span:nth-child(3)":
                "العلاقات",

            ".specialist-card:nth-child(1) .specialist-link":
                "عرض المواعيد",

            ".specialist-card:nth-child(2) .specialist-role":
                "MENTAL WELLNESS",

            ".specialist-card:nth-child(2) h3":
                "Mariam Mahmoud",

            ".specialist-card:nth-child(2) .specialist-content > p":
                "مساحة تساعدك على ترتيب أفكارك والتعامل مع التحديات الشخصية والعاطفية.",

            ".specialist-card:nth-child(2) .specialist-tags span:nth-child(1)":
                "الدعم الشخصي",

            ".specialist-card:nth-child(2) .specialist-tags span:nth-child(2)":
                "العلاقات",

            ".specialist-card:nth-child(2) .specialist-tags span:nth-child(3)":
                "تقدير الذات",

            ".specialist-card:nth-child(2) .specialist-link":
                "عرض المواعيد",

            ".specialists-section .outline-btn":
                "عرض جميع المختصين",

            ".availability-badge":
                "متاح للحجز",

            /* ---------------- HOW IT WORKS ---------------- */

            "#how-it-works .section-kicker":
                "HOW IT WORKS",

            ".how-header h2":
                "البداية أبسط مما تتخيل.",

            ".how-header p":
                "من اختيار المختص إلى حجز الموعد، صممنا التجربة لتكون واضحة ومباشرة.",

            ".step-item:nth-child(1) h3":
                "اختر المختص",

            ".step-item:nth-child(1) p":
                "استعرض المختصين واختر الشخص الذي يناسب احتياجك.",

            ".step-item:nth-child(2) h3":
                "اختر الموعد",

            ".step-item:nth-child(2) p":
                "شاهد المواعيد المتاحة واختر اليوم والوقت المناسبين لك.",

            ".step-item:nth-child(3) h3":
                "أكمل بيانات الحجز",

            ".step-item:nth-child(3) p":
                "أدخل البيانات المطلوبة لإتمام طلب الحجز.",

            ".step-item:nth-child(4) h3":
                "ابدأ جلستك",

            ".step-item:nth-child(4) p":
                "بعد تأكيد الموعد تكون جاهزًا للخطوة التالية.",

            ".how-cta .primary-btn":
                "احجز جلستك",

            /* ---------------- PRIVACY ---------------- */

            "#privacy .section-kicker":
                "YOUR SPACE",

            ".privacy-content h2":
                "مساحة مصممة للوضوح والراحة.",

            ".privacy-content > p":
                "نركز على جعل رحلة الوصول إلى المختص والحجز أكثر وضوحًا، بدون خطوات معقدة أو تشتيت غير ضروري.",

            ".privacy-points div:nth-child(1) span":
                "تجربة حجز واضحة",

            ".privacy-points div:nth-child(2) span":
                "عرض المواعيد المتاحة",

            ".privacy-points div:nth-child(3) span":
                "تصميم يركز على الخصوصية",

            ".privacy-word":
                "YOUR SPACE • YOUR JOURNEY",

            /* ---------------- FAQ ---------------- */

            "#faq .section-kicker":
                "FAQ",

            ".faq-intro h2":
                "أسئلة قد تكون في بالك.",

            ".faq-intro p":
                "بعض الإجابات الأساسية قبل البدء في حجز جلستك.",

            ".faq-intro .text-link":
                "ابدأ الحجز",

            ".faq-item:nth-child(1) summary span":
                "كيف يمكنني حجز جلسة؟",

            ".faq-item:nth-child(1) .faq-answer p":
                "اضغط على «احجز جلستك»، ثم اختر المختص المناسب، وبعد ذلك ستظهر المواعيد المتاحة لاختيار اليوم والوقت.",

            ".faq-item:nth-child(2) summary span":
                "هل يمكنني اختيار المختص بنفسي؟",

            ".faq-item:nth-child(2) .faq-answer p":
                "نعم. يمكنك استعراض المختصين المتاحين واختيار الشخص الذي تريد حجز موعد معه.",

            ".faq-item:nth-child(3) summary span":
                "كيف أعرف المواعيد المتاحة؟",

            ".faq-item:nth-child(3) .faq-answer p":
                "بعد اختيار المختص، يتم تحميل المواعيد المتاحة من نظام الحجز وعرضها لك مباشرة.",

            ".faq-item:nth-child(4) summary span":
                "ماذا يحدث بعد إرسال الحجز؟",

            ".faq-item:nth-child(4) .faq-answer p":
                "يتم تسجيل طلب الحجز في النظام، ويتم التعامل معه وفق حالة الموعد في المنصة.",

            ".faq-item:nth-child(5) summary span":
                "هل يمكن تغيير الموعد؟",

            ".faq-item:nth-child(5) .faq-answer p":
                "إمكانية تغيير الموعد تعتمد على نظام الحجز وسياسة إدارة المواعيد التي سيتم تحديدها للمنصة.",

            /* ---------------- FINAL CTA ---------------- */

            ".final-cta-box .section-kicker":
                "START YOUR JOURNEY",

            ".final-cta-box h2":
                "خطوة واحدة قد تكون بداية مختلفة.",

            ".final-cta-box p":
                "استعرض المختصين واختر الموعد المناسب لك.",

            ".final-cta-box .light-btn":
                "ابدأ الآن",

            /* ---------------- FOOTER ---------------- */

            ".footer-brand p":
                "منصة تساعدك على الوصول إلى مساحة مناسبة للعناية بصحتك النفسية ورفاهيتك.",

            ".footer-column:nth-child(2) h3":
                "المنصة",

            ".footer-column:nth-child(3) h3":
                "معلومات",

            ".footer-column:nth-child(4) h3":
                "ابدأ"

        },


        /* =================================================
           ENGLISH
        ================================================= */

        en: {

            /* ---------------- HEADER ---------------- */

            ".nav-link[href='#home']":
                "Home",

            ".nav-link[href='#how-it-works']":
                "How It Works",

            ".nav-link[href='#services']":
                "Services",

            ".nav-link[href='#specialists']":
                "Specialists",

            ".nav-link[href='#faq']":
                "FAQ",

            ".header-book-btn":
                "Book a Session",

            /* ---------------- HERO ---------------- */

            ".hero-badge span:last-child":
                "Mental Wellness Platform",

            ".hero-content h1":
                "A safe space",

            ".hero-content h1 span":
                "to care for your mind.",

            ".hero-description":
                "MindCare helps you find the right specialist, understand your needs, and book your session through a simple and calm digital experience.",

            ".hero-actions .primary-btn":
                "Book a Session",

            ".hero-actions .secondary-btn":
                "How does MindCare work?",

            ".trust-item:nth-child(1) span":
                "Privacy & Care",

            ".trust-item:nth-child(2) span":
                "Online Booking",

            ".trust-item:nth-child(3) span":
                "Specialists",

            ".small-label":
                "YOUR WELLBEING",

            ".wellness-card-top h3":
                "Your mind matters.",

            ".wellness-message strong":
                "Take your time.",

            ".wellness-message p":
                "Caring for yourself starts with one small step.",

            ".calendar-header strong":
                "Available Sessions",

            ".calendar-header span":
                "THIS WEEK",

            ".card-book-btn":
                "Choose Your Time",

            ".specialist-floating-card span":
                "SPECIALIST",

            ".specialist-floating-card strong":
                "Tasbeh Mohamed",

            ".privacy-floating-card span":
                "YOUR SPACE",

            ".privacy-floating-card strong":
                "Your privacy matters",

            /* ---------------- VALUE ---------------- */

            "#value .section-kicker":
                "WHY MINDCARE",

            ".value-heading h2":
                "Because caring for your mind deserves a clear space.",

            ".value-description p":
                "MindCare is designed to make accessing mental wellness support simpler and clearer, from choosing a specialist to booking your session.",

            ".value-description .text-link":
                "Learn how it works",

            ".value-card:nth-child(1) h3":
                "Clear Choice",

            ".value-card:nth-child(1) p":
                "Explore available specialists and choose the person who fits your needs.",

            ".value-card:nth-child(2) h3":
                "Available Times",

            ".value-card:nth-child(2) p":
                "View available sessions and choose the day and time that works for you.",

            ".value-card:nth-child(3) h3":
                "Private Space",

            ".value-card:nth-child(3) p":
                "A simple experience designed to keep your booking journey clear.",

            ".value-card:nth-child(4) h3":
                "Simple Experience",

            ".value-card:nth-child(4) p":
                "Use the platform easily from your phone or computer.",

            /* ---------------- SERVICES ---------------- */

            "#services .section-kicker":
                "SERVICES",

            "#services .section-heading h2":
                "Support designed around your needs.",

            "#services .section-heading p":
                "Every experience is different. Explore the areas that may fit what you are going through right now.",

            ".service-card:nth-child(1) h3":
                "Anxiety & Stress",

            ".service-card:nth-child(1) p":
                "A space to understand everyday stress, pressure, and the thoughts and feelings connected to them.",

            ".service-card:nth-child(2) h3":
                "Relationships",

            ".service-card:nth-child(2) p":
                "Explore relationship patterns, communication, boundaries, and emotional challenges.",

            ".service-card:nth-child(3) h3":
                "Self-Esteem",

            ".service-card:nth-child(3) p":
                "Understand how you see yourself and work toward a more balanced perspective.",

            ".service-card:nth-child(4) h3":
                "Personal Growth",

            ".service-card:nth-child(4) p":
                "A space to understand your goals and challenges and work toward meaningful next steps.",

            ".service-card:nth-child(5) h3":
                "Family Support",

            ".service-card:nth-child(5) p":
                "Work through family challenges, communication, and difficult situations.",

            ".service-card:nth-child(6) h3":
                "Personal Guidance",

            ".service-card:nth-child(6) p":
                "A space to organize your thoughts, understand your goals, and find clearer next steps.",

            ".service-card .service-link":
                "Explore More",

            ".services-section .outline-btn":
                "Explore Specialists",

            /* ---------------- SPECIALISTS ---------------- */

            "#specialists .section-kicker":
                "SPECIALISTS",

            "#specialists .section-heading h2":
                "Find the right space for you.",

            "#specialists .section-heading p":
                "Meet the specialists available on the platform and move directly to their available sessions.",

            ".specialist-card:nth-child(1) .specialist-role":
                "MENTAL WELLNESS",

            ".specialist-card:nth-child(1) h3":
                "Tasbeh Mohamed",

            ".specialist-card:nth-child(1) .specialist-content > p":
                "A dedicated space to listen, understand your challenges, and work toward steps that fit your needs.",

            ".specialist-card:nth-child(1) .specialist-tags span:nth-child(1)":
                "Personal Support",

            ".specialist-card:nth-child(1) .specialist-tags span:nth-child(2)":
                "Personal Growth",

            ".specialist-card:nth-child(1) .specialist-tags span:nth-child(3)":
                "Relationships",

            ".specialist-card:nth-child(1) .specialist-link":
                "View Availability",

            ".specialist-card:nth-child(2) .specialist-role":
                "MENTAL WELLNESS",

            ".specialist-card:nth-child(2) h3":
                "Mariam Mahmoud",

            ".specialist-card:nth-child(2) .specialist-content > p":
                "A space to organize your thoughts and work through personal and emotional challenges.",

            ".specialist-card:nth-child(2) .specialist-tags span:nth-child(1)":
                "Personal Support",

            ".specialist-card:nth-child(2) .specialist-tags span:nth-child(2)":
                "Relationships",

            ".specialist-card:nth-child(2) .specialist-tags span:nth-child(3)":
                "Self-Esteem",

            ".specialist-card:nth-child(2) .specialist-link":
                "View Availability",

            ".specialists-section .outline-btn":
                "View All Specialists",

            ".availability-badge":
                "Available for Booking",

            /* ---------------- HOW IT WORKS ---------------- */

            "#how-it-works .section-kicker":
                "HOW IT WORKS",

            ".how-header h2":
                "Getting started is simpler than you think.",

            ".how-header p":
                "From choosing a specialist to booking your session, the experience is designed to be clear and straightforward.",

            ".step-item:nth-child(1) h3":
                "Choose a Specialist",

            ".step-item:nth-child(1) p":
                "Explore the specialists and choose the person who fits your needs.",

            ".step-item:nth-child(2) h3":
                "Choose a Time",

            ".step-item:nth-child(2) p":
                "View available sessions and choose the day and time that works for you.",

            ".step-item:nth-child(3) h3":
                "Complete Your Details",

            ".step-item:nth-child(3) p":
                "Enter the required information to complete your booking request.",

            ".step-item:nth-child(4) h3":
                "Start Your Session",

            ".step-item:nth-child(4) p":
                "Once your session is confirmed, you are ready for the next step.",

            ".how-cta .primary-btn":
                "Book a Session",

            /* ---------------- PRIVACY ---------------- */

            "#privacy .section-kicker":
                "YOUR SPACE",

            ".privacy-content h2":
                "A space designed for clarity and comfort.",

            ".privacy-content > p":
                "We focus on making your journey to a specialist and your booking experience clearer, without unnecessary complexity or distraction.",

            ".privacy-points div:nth-child(1) span":
                "Clear booking experience",

            ".privacy-points div:nth-child(2) span":
                "Available session times",

            ".privacy-points div:nth-child(3) span":
                "Privacy-focused design",

            ".privacy-word":
                "YOUR SPACE • YOUR JOURNEY",

            /* ---------------- FAQ ---------------- */

            "#faq .section-kicker":
                "FAQ",

            ".faq-intro h2":
                "Questions you may have.",

            ".faq-intro p":
                "Some essential answers before you begin booking your session.",

            ".faq-intro .text-link":
                "Start Booking",

            ".faq-item:nth-child(1) summary span":
                "How can I book a session?",

            ".faq-item:nth-child(1) .faq-answer p":
                "Click “Book a Session”, choose the right specialist, and then select an available day and time.",

            ".faq-item:nth-child(2) summary span":
                "Can I choose the specialist myself?",

            ".faq-item:nth-child(2) .faq-answer p":
                "Yes. You can explore the available specialists and choose the person you would like to book with.",

            ".faq-item:nth-child(3) summary span":
                "How do I know which times are available?",

            ".faq-item:nth-child(3) .faq-answer p":
                "After choosing a specialist, the available sessions are loaded from the booking system and displayed to you.",

            ".faq-item:nth-child(4) summary span":
                "What happens after I submit a booking?",

            ".faq-item:nth-child(4) .faq-answer p":
                "Your booking request is recorded in the system and handled according to the session status on the platform.",

            ".faq-item:nth-child(5) summary span":
                "Can I change my appointment?",

            ".faq-item:nth-child(5) .faq-answer p":
                "Appointment changes depend on the booking system and the scheduling policy established for the platform.",

            /* ---------------- FINAL CTA ---------------- */

            ".final-cta-box .section-kicker":
                "START YOUR JOURNEY",

            ".final-cta-box h2":
                "One step can be a different beginning.",

            ".final-cta-box p":
                "Explore the specialists and choose a time that works for you.",

            ".final-cta-box .light-btn":
                "Get Started",

            /* ---------------- FOOTER ---------------- */

            ".footer-brand p":
                "A platform designed to help you find a suitable space for your mental wellness and personal wellbeing.",

            ".footer-column:nth-child(2) h3":
                "Platform",

            ".footer-column:nth-child(3) h3":
                "Information",

            ".footer-column:nth-child(4) h3":
                "Get Started"

        }

    };


    /* =====================================================
       APPLY TRANSLATION
    ===================================================== */

    function setElementText(selector, text) {

        const elements =
            document.querySelectorAll(selector);

        elements.forEach((element) => {

            /*
             * For normal elements, textContent is safe.
             * We separately handle buttons/links containing
             * icons below.
             */

            const icon =
                element.querySelector(":scope > i");

            if (icon) {

                element.textContent = "";

                element.appendChild(
                    document.createTextNode(text + " ")
                );

                element.appendChild(icon);

            } else {

                element.textContent = text;

            }

        });
    }


    function applyLanguage(language) {

        if (!translations[language]) {
            return;
        }

        currentLanguage = language;

        /* HTML language */
        html.setAttribute("lang", language);

        /* RTL / LTR */
        html.setAttribute(
            "dir",
            language === "ar" ? "rtl" : "ltr"
        );

        /* Data attribute */
        html.setAttribute(
            "data-language",
            language
        );

        /* Body classes */
        body.classList.toggle(
            "arabic-mode",
            language === "ar"
        );

        body.classList.toggle(
            "english-mode",
            language === "en"
        );


        /* Apply translations */

        Object.entries(
            translations[language]
        ).forEach(([selector, text]) => {

            setElementText(
                selector,
                text
            );

        });


        /* =================================================
           LANGUAGE BUTTON
        ================================================= */

        if (languageSwitch) {

            const icon =
                languageSwitch.querySelector("i");

            languageSwitch.innerHTML = "";

            if (icon) {
                languageSwitch.appendChild(icon);
            }

            const languageText =
                document.createTextNode(
                    language === "ar"
                        ? "EN"
                        : "AR"
                );

            languageSwitch.appendChild(
                languageText
            );


            languageSwitch.setAttribute(
                "aria-label",
                language === "ar"
                    ? "Switch to English"
                    : "التبديل إلى العربية"
            );

        }


        /* =================================================
           CALENDAR
        ================================================= */

        const calendarDays =
            document.querySelectorAll(
                ".calendar-days > div"
            );

        const englishDays =
            ["SUN", "MON", "TUE", "WED"];

        const arabicDays =
            ["أحد", "إثن", "ثلا", "أرب"];

        calendarDays.forEach(
            (day, index) => {

                const small =
                    day.querySelector("small");

                if (!small) return;

                small.textContent =
                    language === "ar"
                        ? arabicDays[index]
                        : englishDays[index];

            }
        );


        /* =================================================
           AVAILABLE BADGES
        ================================================= */

        document
            .querySelectorAll(".availability-badge")
            .forEach((badge) => {

                const dot =
                    badge.querySelector("span");

                badge.textContent =
                    language === "ar"
                        ? "متاح للحجز"
                        : "Available for Booking";

                if (dot) {
                    badge.prepend(dot);
                }

            });


        /* =================================================
           DOCUMENT TITLE
        ================================================= */

        document.title =
            language === "ar"
                ? "MindCare | الصحة النفسية"
                : "MindCare | Mental Wellness";


        /* =================================================
           SAVE LANGUAGE
        ================================================= */

        localStorage.setItem(
            LANGUAGE_KEY,
            language
        );

    }


    /* =====================================================
       LANGUAGE BUTTON EVENT
    ===================================================== */

    if (languageSwitch) {

        languageSwitch.addEventListener(
            "click",
            () => {

                const nextLanguage =
                    currentLanguage === "ar"
                        ? "en"
                        : "ar";

                applyLanguage(
                    nextLanguage
                );

            }
        );

    }


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    function closeMenu() {

        if (!mainNav || !menuToggle) {
            return;
        }

        mainNav.classList.remove("open");

        menuToggle.classList.remove("active");

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

    }


    function toggleMenu() {

        if (!mainNav || !menuToggle) {
            return;
        }

        const isOpen =
            mainNav.classList.toggle("open");

        menuToggle.classList.toggle(
            "active",
            isOpen
        );

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

    }


    if (menuToggle) {

        menuToggle.addEventListener(
            "click",
            toggleMenu
        );

    }


    /* Close menu after clicking nav */

    document
        .querySelectorAll(".main-nav .nav-link")
        .forEach((link) => {

            link.addEventListener(
                "click",
                closeMenu
            );

        });


    /* Close menu when clicking outside */

    document.addEventListener(
        "click",
        (event) => {

            if (!mainNav || !menuToggle) {
                return;
            }

            const clickedInsideNav =
                mainNav.contains(event.target);

            const clickedMenu =
                menuToggle.contains(event.target);

            if (
                mainNav.classList.contains("open") &&
                !clickedInsideNav &&
                !clickedMenu
            ) {
                closeMenu();
            }

        }
    );


    /* =====================================================
       ESCAPE KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Escape") {
                closeMenu();
            }

        }
    );


    /* =====================================================
       SMOOTH SCROLL
    ===================================================== */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach((link) => {

            link.addEventListener(
                "click",
                (event) => {

                    const targetId =
                        link.getAttribute("href");

                    if (
                        !targetId ||
                        targetId === "#"
                    ) {
                        return;
                    }

                    const target =
                        document.querySelector(
                            targetId
                        );

                    if (!target) {
                        return;
                    }

                    event.preventDefault();

                    const header =
                        document.querySelector(
                            ".site-header"
                        );

                    const headerHeight =
                        header
                            ? header.offsetHeight
                            : 0;

                    const position =
                        target.getBoundingClientRect()
                            .top +
                        window.scrollY -
                        headerHeight -
                        20;

                    window.scrollTo({
                        top: position,
                        behavior: "smooth"
                    });

                    closeMenu();

                }
            );

        });


    /* =====================================================
       HEADER SCROLL
    ===================================================== */

    const siteHeader =
        document.querySelector(".site-header");


    function updateHeader() {

        if (!siteHeader) {
            return;
        }

        if (window.scrollY > 30) {

            siteHeader.classList.add(
                "scrolled"
            );

        } else {

            siteHeader.classList.remove(
                "scrolled"
            );

        }

    }


    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );

    updateHeader();


    /* =====================================================
       ACTIVE NAVIGATION
    ===================================================== */

    const sections =
        document.querySelectorAll(
            "main section[id]"
        );

    const navLinks =
        document.querySelectorAll(
            ".main-nav .nav-link"
        );


    function updateActiveNav() {

        if (!sections.length) {
            return;
        }

        const headerHeight =
            siteHeader
                ? siteHeader.offsetHeight
                : 0;

        const scrollPosition =
            window.scrollY +
            headerHeight +
            120;

        let currentSection = "home";


        sections.forEach((section) => {

            if (
                scrollPosition >=
                section.offsetTop
            ) {

                currentSection =
                    section.id;

            }

        });


        navLinks.forEach((link) => {

            const href =
                link.getAttribute("href");

            if (
                href ===
                `#${currentSection}`
            ) {

                link.classList.add(
                    "active"
                );

            } else {

                link.classList.remove(
                    "active"
                );

            }

        });

    }


    window.addEventListener(
        "scroll",
        updateActiveNav,
        { passive: true }
    );

    updateActiveNav();


    /* =====================================================
       FAQ
    ===================================================== */

    const faqItems =
        document.querySelectorAll(
            ".faq-item"
        );


    faqItems.forEach((item) => {

        const details =
            item;

        details.addEventListener(
            "toggle",
            () => {

                if (!details.open) {
                    return;
                }

                faqItems.forEach(
                    (otherItem) => {

                        if (
                            otherItem !==
                            details
                        ) {

                            otherItem.removeAttribute(
                                "open"
                            );

                        }

                    }
                );

            }
        );

    });


    /* =====================================================
       SCROLL REVEAL
    ===================================================== */

    const revealElements =
        document.querySelectorAll(
            ".value-card, " +
            ".service-card, " +
            ".specialist-card, " +
            ".step-item, " +
            ".faq-item"
        );


    if (
        "IntersectionObserver"
        in window
    ) {

        const observer =
            new IntersectionObserver(
                (entries, observerInstance) => {

                    entries.forEach(
                        (entry) => {

                            if (
                                !entry.isIntersecting
                            ) {
                                return;
                            }

                            entry.target.classList.add(
                                "visible"
                            );

                            observerInstance.unobserve(
                                entry.target
                            );

                        }
                    );

                },
                {
                    threshold: 0.12,
                    rootMargin:
                        "0px 0px -40px 0px"
                }
            );


        revealElements.forEach(
            (element) => {

                element.classList.add(
                    "reveal"
                );

                observer.observe(
                    element
                );

            }
        );

    } else {

        revealElements.forEach(
            (element) => {

                element.classList.add(
                    "visible"
                );

            }
        );

    }


    /* =====================================================
       HERO VISUAL PARALLAX
    ===================================================== */

    const heroVisual =
        document.querySelector(
            ".hero-visual"
        );


    if (
        heroVisual &&
        window.matchMedia(
            "(pointer: fine)"
        ).matches
    ) {

        const wellnessCard =
            heroVisual.querySelector(
                ".wellness-card"
            );


        heroVisual.addEventListener(
            "mousemove",
            (event) => {

                if (!wellnessCard) {
                    return;
                }

                const rect =
                    heroVisual.getBoundingClientRect();

                const x =
                    (event.clientX -
                        rect.left) /
                        rect.width -
                    0.5;

                const y =
                    (event.clientY -
                        rect.top) /
                        rect.height -
                    0.5;

                wellnessCard.style.transform =
                    `translate3d(${x * 8}px, ${y * 8}px, 0)`;

            }
        );


        heroVisual.addEventListener(
            "mouseleave",
            () => {

                if (!wellnessCard) {
                    return;
                }

                wellnessCard.style.transform =
                    "";

            }
        );

    }


    /* =====================================================
       BUTTON PRESS EFFECT
    ===================================================== */

    document
        .querySelectorAll(
            ".primary-btn, " +
            ".secondary-btn, " +
            ".header-book-btn, " +
            ".card-book-btn, " +
            ".outline-btn, " +
            ".light-btn"
        )
        .forEach((button) => {

            button.addEventListener(
                "mousedown",
                () => {
                    button.classList.add(
                        "pressed"
                    );
                }
            );

            button.addEventListener(
                "mouseup",
                () => {
                    button.classList.remove(
                        "pressed"
                    );
                }
            );

            button.addEventListener(
                "mouseleave",
                () => {
                    button.classList.remove(
                        "pressed"
                    );
                }
            );

        });


    /* =====================================================
       CURRENT YEAR
    ===================================================== */

    if (currentYear) {

        currentYear.textContent =
            new Date().getFullYear();

    }


    /* =====================================================
       INITIALIZE LANGUAGE
    ===================================================== */

    applyLanguage(
        currentLanguage
    );


    /* =====================================================
       PAGE READY
    ===================================================== */

    body.classList.add(
        "js-ready"
    );

});
