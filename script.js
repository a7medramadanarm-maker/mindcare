/* =========================================================
   MindCare Mental Wellness
   Main JavaScript
   Prepared By: Eng Ahmad Ramadan
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    /* =====================================================
       LANGUAGE SYSTEM
    ===================================================== */

    const languageSwitch =
        document.getElementById("languageSwitch");

    const savedLanguage =
        localStorage.getItem("mindcare-language");

    const defaultLanguage =
        savedLanguage === "en" ? "en" : "ar";


    function applyLanguage(language) {

        const html =
            document.documentElement;

        const elements =
            document.querySelectorAll(
                "[data-ar][data-en]"
            );


        html.lang = language;

        html.dir =
            language === "ar"
                ? "rtl"
                : "ltr";


        elements.forEach((element) => {

            const text =
                element.getAttribute(
                    `data-${language}`
                );


            if (text !== null) {

                element.textContent = text;

            }

        });


        if (languageSwitch) {

            languageSwitch.textContent =
                language === "ar"
                    ? "EN"
                    : "AR";

            languageSwitch.setAttribute(
                "aria-label",
                language === "ar"
                    ? "Switch to English"
                    : "التبديل إلى العربية"
            );

        }


        localStorage.setItem(
            "mindcare-language",
            language
        );

    }


    if (languageSwitch) {

        languageSwitch.addEventListener(
            "click",
            () => {

                const currentLanguage =
                    document.documentElement.lang;

                const newLanguage =
                    currentLanguage === "ar"
                        ? "en"
                        : "ar";

                applyLanguage(newLanguage);

            }
        );

    }


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    const menuToggle =
        document.getElementById("menuToggle");

    const mainNav =
        document.getElementById("mainNav");


    function closeMenu() {

        if (!menuToggle || !mainNav) {
            return;
        }


        menuToggle.classList.remove("active");

        mainNav.classList.remove("open");

        document.body.classList.remove("menu-open");

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

    }


    function openMenu() {

        if (!menuToggle || !mainNav) {
            return;
        }


        menuToggle.classList.add("active");

        mainNav.classList.add("open");

        document.body.classList.add("menu-open");

        menuToggle.setAttribute(
            "aria-expanded",
            "true"
        );

    }


    if (menuToggle && mainNav) {

        menuToggle.addEventListener(
            "click",
            () => {

                const isOpen =
                    mainNav.classList.contains("open");


                if (isOpen) {

                    closeMenu();

                } else {

                    openMenu();

                }

            }
        );


        mainNav
            .querySelectorAll("a")
            .forEach((link) => {

                link.addEventListener(
                    "click",
                    () => {

                        closeMenu();

                    }
                );

            });


        document.addEventListener(
            "click",
            (event) => {

                const clickedInsideMenu =
                    mainNav.contains(event.target);

                const clickedToggle =
                    menuToggle.contains(event.target);


                if (
                    !clickedInsideMenu &&
                    !clickedToggle &&
                    mainNav.classList.contains("open")
                ) {

                    closeMenu();

                }

            }
        );


        document.addEventListener(
            "keydown",
            (event) => {

                if (event.key === "Escape") {

                    closeMenu();

                }

            }
        );

    }


    /* =====================================================
       FAQ ACCORDION
    ===================================================== */

    const faqItems =
        document.querySelectorAll(
            ".faq-item"
        );


    faqItems.forEach((item) => {

        const question =
            item.querySelector(
                ".faq-question"
            );


        if (!question) {
            return;
        }


        question.addEventListener(
            "click",
            () => {

                const isCurrentlyOpen =
                    item.classList.contains("active");


                /* Close every other item */

                faqItems.forEach((otherItem) => {

                    if (otherItem !== item) {

                        otherItem.classList.remove(
                            "active"
                        );


                        const otherButton =
                            otherItem.querySelector(
                                ".faq-question"
                            );


                        if (otherButton) {

                            otherButton.setAttribute(
                                "aria-expanded",
                                "false"
                            );

                        }

                    }

                });


                /* Toggle current item */

                if (isCurrentlyOpen) {

                    item.classList.remove(
                        "active"
                    );

                    question.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                } else {

                    item.classList.add(
                        "active"
                    );

                    question.setAttribute(
                        "aria-expanded",
                        "true"
                    );

                }

            }
        );

    });


    /* =====================================================
       INTERNAL ANCHOR LINKS
    ===================================================== */

    const internalLinks =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    internalLinks.forEach((link) => {

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
                    document.getElementById(
                        "siteHeader"
                    );


                const headerHeight =
                    header
                        ? header.offsetHeight
                        : 0;


                const targetPosition =
                    target.getBoundingClientRect().top
                    +
                    window.scrollY
                    -
                    headerHeight
                    -
                    15;


                window.scrollTo({

                    top: targetPosition,

                    behavior: "smooth"

                });


                closeMenu();

            }
        );

    });


    /* =====================================================
       ACTIVE NAVIGATION
    ===================================================== */

    const sections =
        document.querySelectorAll(
            "main section[id]"
        );


    const navLinks =
        document.querySelectorAll(
            ".nav-link"
        );


    if (
        sections.length &&
        navLinks.length &&
        "IntersectionObserver" in window
    ) {

        const observer =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach(
                        (entry) => {

                            if (
                                !entry.isIntersecting
                            ) {

                                return;

                            }


                            const id =
                                entry.target.id;


                            navLinks.forEach(
                                (link) => {

                                    const href =
                                        link.getAttribute(
                                            "href"
                                        );


                                    link.classList.toggle(
                                        "active",
                                        href === `#${id}`
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
            (section) => {

                observer.observe(section);

            }
        );

    }


    /* =====================================================
       HEADER SHADOW ON SCROLL
    ===================================================== */

    const siteHeader =
        document.getElementById(
            "siteHeader"
        );


    function updateHeader() {

        if (!siteHeader) {
            return;
        }


        if (window.scrollY > 20) {

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
        {
            passive: true
        }
    );


    updateHeader();


    /* =====================================================
       INITIAL LANGUAGE
    ===================================================== */

    applyLanguage(
        defaultLanguage
    );


    /* =====================================================
       FINISH
    ===================================================== */

    console.log(
        "MindCare loaded successfully."
    );

});
