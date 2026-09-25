/* =========================================================
   MINDCARE
   Main Website JavaScript
   Arabic / English
   Firebase Booking Flow
   WhatsApp Removed Completely
========================================================= */

"use strict";


/* =========================================================
   GLOBAL LANGUAGE
========================================================= */

let currentLanguage =
    localStorage.getItem("mindcare_language") || "ar";


/* =========================================================
   TRANSLATIONS
   For text in index.html that currently has no
   data-ar / data-en attributes.
========================================================= */

const translations = {

    ar: {

        /* Header */
        menu: "القائمة",
        language: "EN",

        /* Hero */
        mentalWellness: "الصحة النفسية",

        /* Addiction */
        addictionSigns1: "صعوبة التحكم في الاستخدام",
        addictionSigns2: "الاستمرار رغم الأضرار",
        addictionSigns3: "تأثيره على العلاقات أو العمل أو الدراسة",

        /* Steps */
        explore: "استكشف",
        exploreText:
            "اقرأ عن الموضوعات والأعراض والمصادر.",

        chooseSpecialist: "اختر المختص",
        chooseSpecialistText:
            "راجع الملف والمؤهلات قبل الحجز.",

        chooseAppointment: "اختر موعدك",
        chooseAppointmentText:
            "ابدأ طلب الحجز وأدخل الموعد المفضل.",

        start: "ابدأ",
        startText:
            "ابدأ بالتقييم المبدئي أو الحجز.",

        /* Assessment */
        startAssessment: "ابدأ التقييم",

        /* Final CTA */
        yourNextStep: "خطوتك التالية",
        startWhenReady: "ابدأ عندما تكون مستعدًا.",
        noNeedToKnow:
            "لا تحتاج إلى معرفة كل الإجابات قبل طلب الدعم.",

        /* Footer */
        links: "روابط",
        specialists: "المختصون",
        booking: "الحجز",
        assessment: "التقييم المبدئي",
        faq: "الأسئلة الشائعة",

        topics: "الموضوعات",
        anxiety: "القلق",
        depression: "الاكتئاب",
        addiction: "الإدمان",
        selfEsteem: "الثقة بالنفس",

        /* Footer */
        copyright:
            "© 2026 MindCare. جميع الحقوق محفوظة.",

        prepared:
            "Prepared By: Eng Ahmad Ramadan"

    },


    en: {

        /* Header */
        menu: "Menu",
        language: "AR",

        /* Hero */
        mentalWellness: "Mental Wellness",

        /* Addiction */
        addictionSigns1:
            "Difficulty controlling substance use",

        addictionSigns2:
            "Continuing despite harmful effects",

        addictionSigns3:
            "Impact on relationships, work, or study",

        /* Steps */
        explore: "Explore",
        exploreText:
            "Read about topics, signs, and helpful resources.",

        chooseSpecialist: "Choose a Specialist",
        chooseSpecialistText:
            "Review the profile and qualifications before booking.",

        chooseAppointment: "Choose Your Appointment",
        chooseAppointmentText:
            "Start your booking request and select a suitable time.",

        start: "Get Started",
        startText:
            "Begin with the initial self-check or book a session.",

        /* Assessment */
        startAssessment: "Start Assessment",

        /* Final CTA */
        yourNextStep: "Your Next Step",
        startWhenReady:
            "Start when you are ready.",

        noNeedToKnow:
            "You do not need all the answers before asking for support.",

        /* Footer */
        links: "Links",
        specialists: "Specialists",
        booking: "Booking",
        assessment: "Initial Assessment",
        faq: "FAQ",

        topics: "Topics",
        anxiety: "Anxiety",
        depression: "Depression",
        addiction: "Addiction",
        selfEsteem: "Self-Esteem",

        /* Footer */
        copyright:
            "© 2026 MindCare. All rights reserved.",

        prepared:
            "Prepared By: Eng Ahmad Ramadan"

    }

};


/* =========================================================
   SET TEXT
========================================================= */

function setText(
    selector,
    text
) {

    const elements =
        document.querySelectorAll(selector);

    elements.forEach(element => {

        element.textContent = text;

    });

}


/* =========================================================
   APPLY LANGUAGE
========================================================= */

function applyLanguage(language) {

    currentLanguage =
        language === "en"
            ? "en"
            : "ar";


    const isEnglish =
        currentLanguage === "en";


    /* -----------------------------------------------------
       HTML direction
    ----------------------------------------------------- */

    document.documentElement.lang =
        currentLanguage;

    document.documentElement.dir =
        isEnglish
            ? "ltr"
            : "rtl";


    document.body.classList.toggle(
        "english",
        isEnglish
    );


    /* -----------------------------------------------------
       Elements with data-ar / data-en
    ----------------------------------------------------- */

    document
        .querySelectorAll(
            "[data-ar][data-en]"
        )
        .forEach(element => {

            const value =
                isEnglish
                    ? element.getAttribute("data-en")
                    : element.getAttribute("data-ar");


            if (
                value !== null &&
                value !== undefined
            ) {

                /*
                    Do not destroy child icons
                    inside buttons/elements.

                    If the element contains nested
                    HTML, update only its text node
                    when possible.
                */

                const children =
                    Array.from(
                        element.children
                    );


                if (children.length > 0) {

                    /*
                        Find direct text nodes.
                    */

                    const textNodes =
                        Array.from(
                            element.childNodes
                        ).filter(
                            node =>
                                node.nodeType ===
                                Node.TEXT_NODE
                        );


                    if (textNodes.length > 0) {

                        textNodes[0].textContent =
                            value;

                    } else {

                        /*
                            For elements such as
                            h1/p/span with no important
                            nested content.
                        */

                        element.textContent =
                            value;

                    }

                } else {

                    element.textContent =
                        value;

                }

            }

        });


    /* -----------------------------------------------------
       Input placeholders
    ----------------------------------------------------- */

    document
        .querySelectorAll(
            "[data-placeholder-ar][data-placeholder-en]"
        )
        .forEach(element => {

            element.placeholder =
                isEnglish
                    ? element.getAttribute(
                        "data-placeholder-en"
                    )
                    : element.getAttribute(
                        "data-placeholder-ar"
                    );

        });


    /* -----------------------------------------------------
       ARIA labels
    ----------------------------------------------------- */

    document
        .querySelectorAll(
            "[data-label-ar][data-label-en]"
        )
        .forEach(element => {

            element.setAttribute(
                "aria-label",

                isEnglish
                    ? element.getAttribute(
                        "data-label-en"
                    )
                    : element.getAttribute(
                        "data-label-ar"
                    )
            );

        });


    /* -----------------------------------------------------
       Language Button
    ----------------------------------------------------- */

    const languageButton =
        document.getElementById(
            "languageSwitch"
        );


    if (languageButton) {

        languageButton.textContent =
            isEnglish
                ? "AR"
                : "EN";

    }


    /* -----------------------------------------------------
       Menu Button
    ----------------------------------------------------- */

    const menuToggle =
        document.getElementById(
            "menuToggle"
        );


    if (menuToggle) {

        menuToggle.setAttribute(
            "aria-label",
            translations[currentLanguage].menu
        );

    }


    /* -----------------------------------------------------
       Page Title
    ----------------------------------------------------- */

    document.title =
        isEnglish
            ? "MindCare | Mental Wellness"
            : "MindCare | الصحة النفسية";


    /* -----------------------------------------------------
       Meta Description
    ----------------------------------------------------- */

    const metaDescription =
        document.querySelector(
            'meta[name="description"]'
        );


    if (metaDescription) {

        metaDescription.setAttribute(
            "content",

            isEnglish

                ? "MindCare provides a calm space to understand mental health and find appropriate support."

                : "MindCare تمنحك مساحة هادئة لفهم الصحة النفسية والوصول إلى الدعم المناسب."

        );

    }


    /* -----------------------------------------------------
       Static Arabic/English text
       Not marked with data attributes
    ----------------------------------------------------- */

    const t =
        translations[currentLanguage];


    /*
        Hero eyebrow
    */

    const eyebrow =
        document.querySelector(
            ".eyebrow"
        );

    if (eyebrow) {

        const textNode =
            Array.from(
                eyebrow.childNodes
            ).find(
                node =>
                    node.nodeType ===
                    Node.TEXT_NODE
            );

        if (textNode) {

            textNode.textContent =
                ` ${t.mentalWellness} `;

        }

    }


    /*
        Addiction list
    */

    const addictionList =
        document.querySelector(
            ".feature ul"
        );


    if (addictionList) {

        const items =
            addictionList.querySelectorAll(
                "li"
            );


        if (items[0]) {
            items[0].textContent =
                t.addictionSigns1;
        }

        if (items[1]) {
            items[1].textContent =
                t.addictionSigns2;
        }

        if (items[2]) {
            items[2].textContent =
                t.addictionSigns3;
        }

    }


    /*
        Steps
    */

    const steps =
        document.querySelectorAll(
            ".steps > button"
        );


    if (steps.length >= 4) {

        /* Step 1 */

        const step1Title =
            steps[0].querySelector("h3");

        const step1Text =
            steps[0].querySelector("p");

        if (step1Title)
            step1Title.textContent =
                t.explore;

        if (step1Text)
            step1Text.textContent =
                t.exploreText;


        /* Step 2 */

        const step2Title =
            steps[1].querySelector("h3");

        const step2Text =
            steps[1].querySelector("p");

        if (step2Title)
            step2Title.textContent =
                t.chooseSpecialist;

        if (step2Text)
            step2Text.textContent =
                t.chooseSpecialistText;


        /* Step 3 */

        const step3Title =
            steps[2].querySelector("h3");

        const step3Text =
            steps[2].querySelector("p");

        if (step3Title)
            step3Title.textContent =
                t.chooseAppointment;

        if (step3Text)
            step3Text.textContent =
                t.chooseAppointmentText;


        /* Step 4 */

        const step4Title =
            steps[3].querySelector("h3");

        const step4Text =
            steps[3].querySelector("p");

        if (step4Title)
            step4Title.textContent =
                t.start;

        if (step4Text)
            step4Text.textContent =
                t.startText;

    }


    /*
        Assessment button
    */

    document
        .querySelectorAll(
            '[data-action="assessment"]'
        )
        .forEach(button => {

            /*
                Only replace buttons without
                data-ar/data-en.
            */

            if (
                !button.hasAttribute("data-ar")
            ) {

                button.textContent =
                    t.startAssessment;

            }

        });


    /*
        Final section kicker
    */

    const finalSection =
        document.querySelector(
            ".final"
        );


    if (finalSection) {

        const kicker =
            finalSection.querySelector(
                ".kicker"
            );

        if (kicker) {

            kicker.textContent =
                t.yourNextStep;

        }

    }


    /*
        Footer headings
    */

    const footer =
        document.querySelector(
            "footer"
        );


    if (footer) {

        const footerHeadings =
            footer.querySelectorAll(
                "h4"
            );


        if (footerHeadings[0]) {

            footerHeadings[0].textContent =
                t.links;

        }


        if (footerHeadings[1]) {

            footerHeadings[1].textContent =
                t.topics;

        }


        const footerButtons =
            footer.querySelectorAll(
                ".footer-grid > div button"
            );


        /*
            First column:
            specialists / booking /
            assessment / faq
        */

        if (footerButtons[0])
            footerButtons[0].textContent =
                t.specialists;

        if (footerButtons[1])
            footerButtons[1].textContent =
                t.booking;

        if (footerButtons[2])
            footerButtons[2].textContent =
                t.assessment;

        if (footerButtons[3])
            footerButtons[3].textContent =
                t.faq;


        /*
            Second column:
            anxiety / depression /
            addiction / self-esteem
        */

        if (footerButtons[4])
            footerButtons[4].textContent =
                t.anxiety;

        if (footerButtons[5])
            footerButtons[5].textContent =
                t.depression;

        if (footerButtons[6])
            footerButtons[6].textContent =
                t.addiction;

        if (footerButtons[7])
            footerButtons[7].textContent =
                t.selfEsteem;

    }


    /*
        Footer bottom
    */

    const footerBottom =
        document.querySelector(
            ".footer-bottom"
        );


    if (footerBottom) {

        const spans =
            footerBottom.querySelectorAll(
                "span"
            );


        if (spans[0]) {

            spans[0].textContent =
                t.copyright;

        }


        if (spans[1]) {

            spans[1].textContent =
                t.prepared;

        }

    }


    /* -----------------------------------------------------
       Save language
    ----------------------------------------------------- */

    localStorage.setItem(
        "mindcare_language",
        currentLanguage
    );


    /* -----------------------------------------------------
       Re-render dynamic content
       if the current page has such functions.
    ----------------------------------------------------- */

    if (
        typeof window.renderTopics ===
        "function"
    ) {

        window.renderTopics();

    }


    if (
        typeof window.renderSpecialists ===
        "function"
    ) {

        window.renderSpecialists();

    }


    if (
        typeof window.renderFAQ ===
        "function"
    ) {

        window.renderFAQ();

    }

}


/* =========================================================
   LANGUAGE SWITCHER
========================================================= */

function initLanguageSwitcher() {

    const button =
        document.getElementById(
            "languageSwitch"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        event => {

            event.preventDefault();


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


/* =========================================================
   MOBILE MENU
========================================================= */

function initMobileMenu() {

    const menuToggle =
        document.getElementById(
            "menuToggle"
        );

    const nav =
        document.getElementById(
            "mainNav"
        );


    if (!menuToggle || !nav) {
        return;
    }


    menuToggle.addEventListener(
        "click",
        () => {

            nav.classList.toggle(
                "open"
            );

            menuToggle.classList.toggle(
                "active"
            );

        }
    );


    nav.querySelectorAll(
        "a"
    ).forEach(link => {

        link.addEventListener(
            "click",
            () => {

                nav.classList.remove(
                    "open"
                );

                menuToggle.classList.remove(
                    "active"
                );

            }
        );

    });

}


/* =========================================================
   SCROLL NAVIGATION
========================================================= */

function initScrollNavigation() {

    document
        .querySelectorAll(
            "[data-scroll]"
        )
        .forEach(element => {

            element.addEventListener(
                "click",
                event => {

                    const targetId =
                        element.getAttribute(
                            "data-scroll"
                        );


                    if (!targetId) {
                        return;
                    }


                    const target =
                        document.getElementById(
                            targetId
                        );


                    if (!target) {
                        return;
                    }


                    event.preventDefault();


                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }
            );

        });

}


/* =========================================================
   BOOKING
   NO WHATSAPP
========================================================= */

function initBooking() {

    document
        .querySelectorAll(
            '[data-action="booking"]'
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    window.location.href =
                        "booking.html";

                }
            );

        });


    /*
        Support old classes too.
    */

    document
        .querySelectorAll(
            ".booking-link, .book-now, .start-booking"
        )
        .forEach(button => {

            if (
                button.hasAttribute(
                    "data-action"
                )
            ) {
                return;
            }


            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    window.location.href =
                        "booking.html";

                }
            );

        });

}


/* =========================================================
   TOPIC MODAL
========================================================= */

function initTopicButtons() {

    document
        .querySelectorAll(
            "[data-topic]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    const topic =
                        button.getAttribute(
                            "data-topic"
                        );


                    if (
                        typeof window.openTopic ===
                        "function"
                    ) {

                        window.openTopic(
                            topic,
                            currentLanguage
                        );

                        return;
                    }


                    openBasicTopicModal(
                        topic
                    );

                }
            );

        });

}


/* =========================================================
   BASIC TOPIC MODAL
========================================================= */

function openBasicTopicModal(topic) {

    const overlay =
        document.getElementById(
            "modalOverlay"
        );

    const content =
        document.getElementById(
            "modalContent"
        );


    if (!overlay || !content) {
        return;
    }


    const topicNames = {

        anxiety: {
            ar: "القلق",
            en: "Anxiety"
        },

        depression: {
            ar: "الاكتئاب",
            en: "Depression"
        },

        addiction: {
            ar: "الإدمان",
            en: "Addiction"
        },

        "self-esteem": {
            ar: "الثقة بالنفس",
            en: "Self-Esteem"
        },

        relationships: {
            ar: "العلاقات العاطفية",
            en: "Romantic Relationships"
        },

        family: {
            ar: "العلاقات الأسرية",
            en: "Family Relationships"
        },

        communication: {
            ar: "التواصل والحدود",
            en: "Communication & Boundaries"
        }

    };


    const name =
        topicNames[topic]
            ? topicNames[topic][currentLanguage]
            : topic;


    const title =
        currentLanguage === "en"
            ? `Learn more about ${name}`
            : `تعرف أكثر على ${name}`;


    const description =
        currentLanguage === "en"

            ? "Educational information can help you understand the topic. It is not a diagnosis. If the issue is affecting your daily life, speaking with a qualified specialist may be helpful."

            : "المعلومات التثقيفية تساعدك على فهم الموضوع بشكل أفضل، لكنها ليست تشخيصًا. إذا كان الأمر يؤثر على حياتك اليومية، فقد يكون من المفيد التحدث مع مختص مؤهل.";


    content.innerHTML = `

        <span class="kicker">
            ${currentLanguage === "en"
                ? "MindCare"
                : "MindCare"}
        </span>

        <h2>
            ${name}
        </h2>

        <p>
            ${description}
        </p>

        <button
            class="btn btn-primary"
            data-modal-booking
        >
            ${
                currentLanguage === "en"
                    ? "Book a Session"
                    : "ابدأ الحجز"
            }
        </button>

    `;


    overlay.classList.add(
        "active"
    );

    overlay.setAttribute(
        "aria-hidden",
        "false"
    );


    const modalBooking =
        content.querySelector(
            "[data-modal-booking]"
        );


    if (modalBooking) {

        modalBooking.addEventListener(
            "click",
            () => {

                window.location.href =
                    "booking.html";

            }
        );

    }

}


/* =========================================================
   MODAL CLOSE
========================================================= */

function initModal() {

    const overlay =
        document.getElementById(
            "modalOverlay"
        );

    const close =
        document.getElementById(
            "modalClose"
        );


    if (!overlay) {
        return;
    }


    if (close) {

        close.addEventListener(
            "click",
            () => {

                closeModal();

            }
        );

    }


    overlay.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                overlay
            ) {

                closeModal();

            }

        }
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Escape"
            ) {

                closeModal();

            }

        }
    );

}


function closeModal() {

    const overlay =
        document.getElementById(
            "modalOverlay"
        );


    if (!overlay) {
        return;
    }


    overlay.classList.remove(
        "active"
    );

    overlay.setAttribute(
        "aria-hidden",
        "true"
    );

}


/* =========================================================
   FAQ
========================================================= */

function initFAQ() {

    /*
        Keep compatibility with FAQ
        generated by other scripts.
    */

    document.addEventListener(
        "click",
        event => {

            const question =
                event.target.closest(
                    ".faq-question, [data-faq-question]"
                );


            if (!question) {
                return;
            }


            const item =
                question.closest(
                    ".faq-item, [data-faq-item]"
                );


            if (!item) {
                return;
            }


            item.classList.toggle(
                "active"
            );

        }
    );

}


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

function initActiveNavigation() {

    const sections =
        document.querySelectorAll(
            "main section[id]"
        );


    const links =
        document.querySelectorAll(
            ".nav-link[data-scroll]"
        );


    if (
        !sections.length ||
        !links.length
    ) {
        return;
    }


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (!entry.isIntersecting) {
                            return;
                        }


                        const id =
                            entry.target.id;


                        links.forEach(
                            link => {

                                link.classList.toggle(
                                    "active",
                                    link.getAttribute(
                                        "data-scroll"
                                    ) === id
                                );

                            }
                        );

                    }
                );

            },
            {
                rootMargin:
                    "-35% 0px -55% 0px"
            }
        );


    sections.forEach(
        section => {

            observer.observe(
                section
            );

        }
    );

}


/* =========================================================
   SCROLL REVEAL
========================================================= */

function initScrollReveal() {

    const elements =
        document.querySelectorAll(
            ".section, .intro, .privacy, .final"
        );


    if (!elements.length) {
        return;
    }


    if (
        !("IntersectionObserver" in window)
    ) {
        return;
    }


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "visible"
                            );

                            observer.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.08
            }
        );


    elements.forEach(
        element => {

            observer.observe(
                element
            );

        }
    );

}


/* =========================================================
   PREVENT OLD WHATSAPP BOOKING
========================================================= */

function removeOldWhatsAppBooking() {

    /*
        Remove any old inline WhatsApp
        booking handlers that may have been
        attached by older versions.

        The new system NEVER creates
        wa.me links.
    */


    document
        .querySelectorAll(
            'a[href*="wa.me"], a[href*="whatsapp.com"]'
        )
        .forEach(link => {

            /*
                Only remove booking-related
                WhatsApp links.

                We don't touch unrelated
                external links.
            */

            const text =
                (
                    link.textContent ||
                    ""
                ).toLowerCase();


            if (
                text.includes("حجز") ||
                text.includes("booking") ||
                text.includes("book")
            ) {

                link.removeAttribute(
                    "href"
                );

                link.setAttribute(
                    "href",
                    "booking.html"
                );

            }

        });

}


/* =========================================================
   FIREBASE DYNAMIC CONTENT COMPATIBILITY
========================================================= */

window.getMindCareLanguage =
    function () {

        return currentLanguage;

    };


window.setMindCareLanguage =
    function (language) {

        applyLanguage(
            language
        );

    };


/*
    Compatibility aliases.
*/

window.switchLanguage =
    window.setMindCareLanguage;

window.setLanguage =
    window.setMindCareLanguage;


/* =========================================================
   INITIALIZE EVERYTHING
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initMobileMenu();

        initScrollNavigation();

        initBooking();

        initLanguageSwitcher();

        initTopicButtons();

        initModal();

        initFAQ();

        initActiveNavigation();

        initScrollReveal();

        removeOldWhatsAppBooking();

        /*
            Apply saved language immediately.
        */

        applyLanguage(
            currentLanguage
        );

    }
);
