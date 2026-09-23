/* =========================================================
   MindCare - Main JavaScript
   Mental Wellness Platform
   Prepared By: Eng Ahmad Ramadan
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const html = document.documentElement;
    const body = document.body;

    const languageSwitch = document.getElementById("languageSwitch");
    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");

    const siteHeader = document.getElementById("siteHeader");

    /* =====================================================
       LANGUAGE SYSTEM
    ===================================================== */

    const STORAGE_KEY = "mindcare_language";

    let currentLanguage =
        localStorage.getItem(STORAGE_KEY) ||
        html.getAttribute("data-language") ||
        "ar";

    if (currentLanguage !== "ar" && currentLanguage !== "en") {
        currentLanguage = "ar";
    }

    function updateTextContent(element, language) {
        if (!element) return;

        const translation = element.getAttribute(`data-${language}`);

        if (translation !== null) {
            element.textContent = translation;
        }
    }

    function translatePage(language) {
        currentLanguage = language;

        /* HTML language + direction */
        html.setAttribute("lang", language);
        html.setAttribute("dir", language === "ar" ? "rtl" : "ltr");
        html.setAttribute("data-language", language);

        body.classList.toggle("english-mode", language === "en");
        body.classList.toggle("arabic-mode", language === "ar");

        /* Translate all elements containing data-ar/data-en */
        const translatableElements = document.querySelectorAll(
            "[data-ar][data-en]"
        );

        translatableElements.forEach((element) => {
            updateTextContent(element, language);
        });

        /* Language button */
        if (languageSwitch) {
            languageSwitch.setAttribute(
                "aria-label",
                language === "ar"
                    ? "Switch language to English"
                    : "تغيير اللغة إلى العربية"
            );

            languageSwitch.setAttribute(
                "title",
                language === "ar"
                    ? "English"
                    : "العربية"
            );

            const buttonText =
                languageSwitch.querySelector("[data-language-label]");

            if (buttonText) {
                buttonText.textContent =
                    language === "ar" ? "English" : "العربية";
            } else {
                /*
                 * Only replace the text if the button doesn't contain
                 * icons or other important children.
                 */
                const textNode = Array.from(languageSwitch.childNodes)
                    .find(node => node.nodeType === Node.TEXT_NODE);

                if (textNode) {
                    textNode.textContent =
                        language === "ar" ? "English" : "العربية";
                }
            }
        }

        /* Update FAQ details direction */
        document.querySelectorAll(".faq-answer").forEach((answer) => {
            answer.setAttribute("dir", language === "ar" ? "rtl" : "ltr");
        });

        /* Update document title */
        document.title =
            language === "ar"
                ? "MindCare | الصحة النفسية"
                : "MindCare | Mental Wellness";

        localStorage.setItem(STORAGE_KEY, language);
    }

    if (languageSwitch) {
        languageSwitch.addEventListener("click", (event) => {
            event.preventDefault();

            const nextLanguage =
                currentLanguage === "ar" ? "en" : "ar";

            translatePage(nextLanguage);
        });
    }

    /* =====================================================
       MOBILE NAVIGATION
    ===================================================== */

    function closeMobileMenu() {
        if (!mainNav || !menuToggle) return;

        mainNav.classList.remove("open");
        menuToggle.classList.remove("active");

        menuToggle.setAttribute("aria-expanded", "false");
    }

    function toggleMobileMenu() {
        if (!mainNav || !menuToggle) return;

        const isOpen = mainNav.classList.toggle("open");

        menuToggle.classList.toggle("active", isOpen);

        menuToggle.setAttribute(
            "aria-expanded",
            isOpen ? "true" : "false"
        );
    }

    if (menuToggle && mainNav) {
        menuToggle.setAttribute("aria-expanded", "false");

        menuToggle.addEventListener("click", (event) => {
            event.preventDefault();
            toggleMobileMenu();
        });
    }

    /* Close menu after clicking a navigation link */
    document.querySelectorAll(".main-nav .nav-link").forEach((link) => {
        link.addEventListener("click", () => {
            closeMobileMenu();
        });
    });

    /* Close menu when clicking outside */
    document.addEventListener("click", (event) => {
        if (!mainNav || !menuToggle) return;

        const clickedInsideNav =
            mainNav.contains(event.target);

        const clickedMenuButton =
            menuToggle.contains(event.target);

        if (
            mainNav.classList.contains("open") &&
            !clickedInsideNav &&
            !clickedMenuButton
        ) {
            closeMobileMenu();
        }
    });

    /* Close menu with Escape */
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMobileMenu();
        }
    });

    /* =====================================================
       SMOOTH SCROLL
    ===================================================== */

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");

            if (
                !targetId ||
                targetId === "#" ||
                targetId.length < 2
            ) {
                return;
            }

            const target = document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            const headerHeight =
                siteHeader?.offsetHeight || 0;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                headerHeight -
                20;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });

            closeMobileMenu();
        });
    });

    /* =====================================================
       HEADER SCROLL STATE
    ===================================================== */

    function updateHeader() {
        if (!siteHeader) return;

        if (window.scrollY > 30) {
            siteHeader.classList.add("scrolled");
        } else {
            siteHeader.classList.remove("scrolled");
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

    const sections = document.querySelectorAll(
        "main section[id]"
    );

    const navLinks = document.querySelectorAll(
        ".main-nav .nav-link"
    );

    function updateActiveNavigation() {
        if (!sections.length || !navLinks.length) return;

        const scrollPosition =
            window.scrollY +
            (siteHeader?.offsetHeight || 0) +
            120;

        let currentSection = "";

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (
                scrollPosition >= sectionTop &&
                scrollPosition < sectionTop + sectionHeight
            ) {
                currentSection = section.id;
            }
        });

        navLinks.forEach((link) => {
            const href = link.getAttribute("href");

            if (href === `#${currentSection}`) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
    }

    window.addEventListener(
        "scroll",
        updateActiveNavigation,
        { passive: true }
    );

    updateActiveNavigation();

    /* =====================================================
       FAQ
    ===================================================== */

    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach((item) => {
        const details = item.querySelector("details");

        if (!details) return;

        details.addEventListener("toggle", () => {
            if (details.open) {
                faqItems.forEach((otherItem) => {
                    const otherDetails =
                        otherItem.querySelector("details");

                    if (
                        otherDetails &&
                        otherDetails !== details
                    ) {
                        otherDetails.removeAttribute("open");
                    }
                });
            }
        });
    });

    /* =====================================================
       SCROLL REVEAL
    ===================================================== */

    const revealElements = document.querySelectorAll(
        ".value-card, " +
        ".service-card, " +
        ".specialist-card, " +
        ".step-item, " +
        ".faq-item"
    );

    if ("IntersectionObserver" in window) {
        const revealObserver =
            new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach((entry) => {
                        if (!entry.isIntersecting) return;

                        entry.target.classList.add("visible");

                        observer.unobserve(entry.target);
                    });
                },
                {
                    threshold: 0.12,
                    rootMargin: "0px 0px -40px 0px"
                }
            );

        revealElements.forEach((element) => {
            element.classList.add("reveal");

            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach((element) => {
            element.classList.add("visible");
        });
    }

    /* =====================================================
       HERO CARD - SUBTLE PARALLAX
    ===================================================== */

    const heroVisual = document.querySelector(".hero-visual");

    if (heroVisual && window.matchMedia("(pointer: fine)").matches) {
        heroVisual.addEventListener("mousemove", (event) => {
            const rect =
                heroVisual.getBoundingClientRect();

            const x =
                (event.clientX - rect.left) /
                rect.width -
                0.5;

            const y =
                (event.clientY - rect.top) /
                rect.height -
                0.5;

            const card =
                heroVisual.querySelector(".wellness-card");

            if (card) {
                card.style.transform =
                    `translate3d(${x * 8}px, ${y * 8}px, 0)`;
            }
        });

        heroVisual.addEventListener("mouseleave", () => {
            const card =
                heroVisual.querySelector(".wellness-card");

            if (card) {
                card.style.transform = "";
            }
        });
    }

    /* =====================================================
       BOOKING LINKS
    ===================================================== */

    /*
       These links intentionally point to booking.html.
       The actual availability and booking logic will be
       handled by the booking page + Supabase.
    */

    const bookingLinks = document.querySelectorAll(
        'a[href*="booking.html"]'
    );

    bookingLinks.forEach((link) => {
        link.addEventListener("click", () => {
            closeMobileMenu();
        });
    });

    /* =====================================================
       PROVIDER LINKS
    ===================================================== */

    document.querySelectorAll(
        'a[href*="provider="]'
    ).forEach((link) => {
        link.addEventListener("click", () => {
            closeMobileMenu();
        });
    });

    /* =====================================================
       BUTTON PRESS EFFECT
    ===================================================== */

    document.querySelectorAll(
        ".primary-btn, " +
        ".secondary-btn, " +
        ".header-book-btn, " +
        ".card-book-btn, " +
        ".outline-btn, " +
        ".light-btn"
    ).forEach((button) => {
        button.addEventListener("mousedown", () => {
            button.classList.add("pressed");
        });

        button.addEventListener("mouseup", () => {
            button.classList.remove("pressed");
        });

        button.addEventListener("mouseleave", () => {
            button.classList.remove("pressed");
        });
    });

    /* =====================================================
       CURRENT YEAR
    ===================================================== */

    document.querySelectorAll("[data-current-year]")
        .forEach((element) => {
            element.textContent =
                new Date().getFullYear();
        });

    /* =====================================================
       INITIAL LANGUAGE
    ===================================================== */

    translatePage(currentLanguage);

    /* =====================================================
       READY
    ===================================================== */

    document.body.classList.add("js-ready");

});
