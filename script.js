/* =========================================================
   MINDCARE
   Interactive JavaScript
========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       MOBILE MENU
    ===================================================== */

    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");

    if (menuToggle && mainNav) {

        menuToggle.addEventListener("click", () => {

            const opened = mainNav.classList.toggle("mobile-open");

            menuToggle.setAttribute(
                "aria-expanded",
                String(opened)
            );

        });

        mainNav.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {
                mainNav.classList.remove("mobile-open");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );
            });

        });

    }


    /* =====================================================
       LANGUAGE SWITCH
    ===================================================== */

    const languageSwitch =
        document.getElementById("languageSwitch");

    let currentLanguage =
        localStorage.getItem("mindcareLanguage") || "ar";

    function applyLanguage(language) {

        currentLanguage = language;

        document.documentElement.lang = language;
        document.documentElement.dir =
            language === "ar" ? "rtl" : "ltr";

        document.querySelectorAll("[data-ar][data-en]")
            .forEach(element => {

                element.textContent =
                    element.getAttribute(
                        language === "ar"
                            ? "data-ar"
                            : "data-en"
                    );

            });

        if (languageSwitch) {
            languageSwitch.textContent =
                language === "ar" ? "EN" : "AR";
        }

        localStorage.setItem(
            "mindcareLanguage",
            language
        );
    }

    if (languageSwitch) {

        languageSwitch.addEventListener("click", () => {

            applyLanguage(
                currentLanguage === "ar"
                    ? "en"
                    : "ar"
            );

        });

    }

    applyLanguage(currentLanguage);


    /* =====================================================
       MODAL SYSTEM
    ===================================================== */

    const modals =
        document.querySelectorAll(".modal");

    function openModal(modal) {

        if (!modal) return;

        modal.classList.add("active");

        document.body.style.overflow = "hidden";

    }

    function closeAllModals() {

        modals.forEach(modal => {
            modal.classList.remove("active");
        });

        document.body.style.overflow = "";

    }

    document.querySelectorAll("[data-close-modal]")
        .forEach(element => {

            element.addEventListener(
                "click",
                closeAllModals
            );

        });

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {
            closeAllModals();
        }

    });


    /* =====================================================
       TOPIC DATA
    ===================================================== */

    const topics = {

        anxiety: {

            title: "القلق والتوتر",

            intro:
                "القلق استجابة طبيعية للخطر أو الضغط، لكنه قد يصبح مشكلة عندما يكون شديدًا أو مستمرًا أو يبدأ في التأثير على الحياة اليومية.",

            symptoms: [
                "القلق أو الخوف المستمر",
                "صعوبة الاسترخاء",
                "التفكير الزائد",
                "التوتر أو الشعور بأنك دائمًا على استعداد لشيء سيئ",
                "صعوبة التركيز",
                "مشكلات النوم",
                "أعراض جسدية مثل سرعة ضربات القلب أو التعرق"
            ],

            effects: [
                "التأثير على الدراسة أو العمل",
                "تجنب مواقف أو أماكن معينة",
                "التأثير على العلاقات",
                "الإرهاق وصعوبة النوم"
            ],

            when:
                "إذا أصبح القلق متكررًا أو شديدًا أو بدأ يؤثر على حياتك اليومية، فقد يكون من المفيد التحدث مع مختص.",

            source:
                "NIMH – Anxiety Disorders",

            link:
                "https://www.nimh.nih.gov/health/topics/anxiety-disorders"

        },


        depression: {

            title: "الاكتئاب",

            intro:
                "الاكتئاب ليس مجرد حزن عابر. يمكن أن يؤثر على المزاج والطاقة والاهتمام بالأشياء والعلاقات والحياة اليومية.",

            symptoms: [
                "مزاج منخفض أو حزن مستمر",
                "فقدان الاهتمام أو المتعة",
                "تغيرات في النوم",
                "تغيرات في الشهية أو الوزن",
                "الإرهاق وانخفاض الطاقة",
                "صعوبة التركيز",
                "الشعور بالذنب أو انعدام القيمة"
            ],

            effects: [
                "صعوبة أداء المهام اليومية",
                "الابتعاد عن الآخرين",
                "انخفاض الأداء الدراسي أو المهني",
                "تأثر العلاقات"
            ],

            when:
                "إذا استمرت الأعراض أو أثرت على قدرتك على ممارسة حياتك، فمن الأفضل التحدث مع مختص.",

            source:
                "NIMH – Mental Health Information",

            link:
                "https://www.nimh.nih.gov/health/topics"

        },


        panic: {

            title: "نوبات الهلع",

            intro:
                "نوبة الهلع هي موجة مفاجئة من الخوف أو الانزعاج الشديد قد تحدث حتى في غياب خطر واضح.",

            symptoms: [
                "خفقان أو سرعة ضربات القلب",
                "التعرق",
                "الرعشة",
                "صعوبة التنفس",
                "الدوخة",
                "ألم أو انزعاج في الصدر",
                "الشعور بفقدان السيطرة",
                "الخوف الشديد من حدوث شيء سيئ"
            ],

            effects: [
                "الخوف من تكرار النوبة",
                "تجنب أماكن أو مواقف معينة",
                "تغيير نمط الحياة بسبب الخوف"
            ],

            when:
                "نوبة هلع واحدة لا تعني بالضرورة وجود اضطراب هلع. تكرار النوبات أو القلق المستمر بشأنها يستحق تقييمًا متخصصًا.",

            source:
                "NIMH – Panic Disorder",

            link:
                "https://www.nimh.nih.gov/health/publications/panic-disorder-when-fear-overwhelms"

        },


        ocd: {

            title: "الوسواس القهري",

            intro:
                "الوسواس القهري قد يتضمن أفكارًا أو دوافع أو صورًا متكررة وغير مرغوبة، وسلوكيات أو أفعالًا متكررة يشعر الشخص بأنه مضطر للقيام بها.",

            symptoms: [
                "أفكار متكررة وغير مرغوبة",
                "الخوف المستمر من التلوث أو الخطأ",
                "الحاجة إلى التحقق المتكرر",
                "سلوكيات قهرية متكررة",
                "الانشغال الشديد بأفكار معينة",
                "استهلاك وقت كبير في الطقوس أو التحقق"
            ],

            effects: [
                "استهلاك وقت طويل",
                "التوتر والضيق",
                "تجنب مواقف معينة",
                "التأثير على الدراسة أو العمل والعلاقات"
            ],

            when:
                "إذا أصبحت الأفكار أو السلوكيات تستغرق وقتًا كبيرًا أو تسبب ضيقًا واضحًا أو تعطل حياتك، فالتقييم المهني مهم.",

            source:
                "NIMH – Obsessive-Compulsive Disorder",

            link:
                "https://www.nimh.nih.gov/health/topics/obsessive-compulsive-disorder-ocd"

        },


        trauma: {

            title: "الصدمات النفسية",

            intro:
                "بعد تجربة مؤلمة أو خطيرة، قد تظهر استجابات نفسية وجسدية مختلفة. وجود بعض هذه الاستجابات بعد حدث صعب لا يعني تلقائيًا وجود اضطراب نفسي.",

            symptoms: [
                "ذكريات مزعجة أو أحلام مرتبطة بالتجربة",
                "تجنب أشياء تذكّر بالحدث",
                "الشعور بالتوتر أو اليقظة الزائدة",
                "صعوبة النوم",
                "صعوبة التركيز",
                "مشاعر الخوف أو الغضب أو الذنب"
            ],

            effects: [
                "تغيرات في العلاقات",
                "تجنب أماكن أو أنشطة",
                "مشكلات النوم",
                "صعوبة التركيز والعمل"
            ],

            when:
                "إذا استمرت الأعراض وأصبحت تؤثر على حياتك اليومية، يمكن لمختص الصحة النفسية مساعدتك في تقييمها.",

            source:
                "NIMH – PTSD",

            link:
                "https://www.nimh.nih.gov/health/publications/post-traumatic-stress-disorder-ptsd"

        },


        sleep: {

            title: "النوم والصحة النفسية",

            intro:
                "النوم والمزاج يؤثر كل منهما في الآخر. اضطراب النوم قد يرتبط بالتوتر والقلق وتغير المزاج، كما يمكن لبعض المشكلات النفسية أن تجعل النوم أكثر صعوبة.",

            symptoms: [
                "صعوبة الدخول في النوم",
                "الاستيقاظ المتكرر",
                "الاستيقاظ مبكرًا",
                "النوم لفترات طويلة بشكل غير معتاد",
                "الشعور بالتعب خلال اليوم",
                "صعوبة التركيز"
            ],

            effects: [
                "انخفاض الطاقة",
                "تغير المزاج",
                "صعوبة التركيز",
                "تراجع الأداء اليومي"
            ],

            when:
                "إذا كانت مشكلات النوم مستمرة أو تؤثر بشكل واضح على حياتك، فمن المفيد مناقشتها مع مختص.",

            source:
                "NIMH – Mental Health Topics",

            link:
                "https://www.nimh.nih.gov/health/topics"

        },


        addiction: {

            title: "الإدمان واستخدام المواد",

            intro:
                "اضطراب استخدام المواد قد يتضمن استمرار استخدام مادة رغم ظهور مشكلات أو أضرار، مع صعوبة في التحكم في الاستخدام.",

            symptoms: [
                "صعوبة تقليل أو إيقاف الاستخدام",
                "استخدام المادة لفترة أو كمية أكبر من المقصود",
                "استمرار الاستخدام رغم المشكلات",
                "تأثر العمل أو الدراسة",
                "تأثر العلاقات",
                "قضاء وقت كبير في الحصول على المادة أو استخدامها"
            ],

            effects: [
                "مشكلات صحية",
                "مشكلات أسرية واجتماعية",
                "مشكلات دراسية أو مهنية",
                "مشكلات مالية أو قانونية في بعض الحالات"
            ],

            when:
                "إذا كان الاستخدام يسبب أضرارًا أو تشعر أنك تفقد السيطرة عليه، فإن طلب التقييم والدعم المتخصص خطوة مهمة.",

            source:
                "NIDA – National Institute on Drug Abuse",

            link:
                "https://nida.nih.gov/research-topics/addiction-science"

        },


        "self-esteem": {

            title: "الثقة بالنفس وتقدير الذات",

            intro:
                "تقدير الذات يتعلق بالطريقة التي يرى بها الشخص نفسه وقيمته. انخفاض تقدير الذات قد يؤثر على القرارات والعلاقات والقدرة على وضع الحدود.",

            symptoms: [
                "النقد المستمر للنفس",
                "المقارنة المستمرة بالآخرين",
                "الخوف من الفشل",
                "صعوبة تقبل المديح",
                "الشعور بعدم الاستحقاق",
                "صعوبة وضع الحدود"
            ],

            effects: [
                "التردد في اتخاذ القرارات",
                "العلاقات غير المتوازنة",
                "تجنب الفرص",
                "زيادة القلق تجاه رأي الآخرين"
            ],

            when:
                "إذا أصبحت نظرتك لنفسك تؤثر على علاقاتك أو قراراتك أو حياتك اليومية، فقد يكون الدعم المتخصص مفيدًا."
        },


        relationships: {

            title: "العلاقات العاطفية",

            intro:
                "العلاقات قد تتأثر بطريقة التواصل والحدود والتوقعات وأنماط التعلق والتعامل مع الخلافات.",

            symptoms: [
                "الخلافات المتكررة",
                "صعوبة التعبير عن الاحتياجات",
                "الغيرة الشديدة",
                "الخوف من الانفصال",
                "صعوبة وضع الحدود",
                "الاعتماد الزائد على الطرف الآخر"
            ],

            effects: [
                "الإرهاق النفسي",
                "سوء الفهم",
                "تكرار نفس الخلافات",
                "ضعف الشعور بالأمان داخل العلاقة"
            ],

            when:
                "عندما تصبح المشكلات متكررة أو تؤثر على الأمان النفسي والعلاقة اليومية، يمكن للدعم المتخصص أن يساعد."
        },


        family: {

            title: "العلاقات الأسرية",

            intro:
                "العلاقات الأسرية قد تواجه ضغوطًا بسبب اختلاف التوقعات أو أساليب التواصل أو الحدود أو الأحداث الحياتية.",

            symptoms: [
                "الخلافات المتكررة",
                "صعوبة التواصل",
                "الشعور بعدم الفهم",
                "الحدود غير الواضحة",
                "الغضب المتكرر"
            ],

            effects: [
                "التوتر المستمر",
                "الابتعاد عن الأسرة",
                "مشكلات في التواصل",
                "تأثر الصحة النفسية"
            ],

            when:
                "عندما تصبح الخلافات مستمرة أو تؤثر على حياة أفراد الأسرة، قد يكون طلب الدعم مناسبًا."
        },


        communication: {

            title: "التواصل والحدود",

            intro:
                "التواصل الصحي لا يعني تجنب الخلافات، بل يعني القدرة على التعبير عن الاحتياجات والمشاعر بطريقة واضحة ومحترمة.",

            symptoms: [
                "صعوبة قول لا",
                "الخوف من إغضاب الآخرين",
                "كتمان المشاعر",
                "الانفجار بعد تراكم المشكلات",
                "عدم وضوح الحدود الشخصية"
            ],

            effects: [
                "الاستنزاف النفسي",
                "سوء الفهم",
                "الشعور بالاستغلال",
                "العلاقات غير المتوازنة"
            ],

            when:
                "إذا كانت صعوبة التواصل أو وضع الحدود تسبب مشكلات متكررة، يمكن أن يساعدك مختص في فهم النمط وتطوير طرق أكثر فاعلية."
        }

    };


    /* =====================================================
       TOPIC MODAL
    ===================================================== */

    const topicModal =
        document.getElementById("topicModal");

    const topicContent =
        document.getElementById("topicModalContent");

    function openTopic(topicKey) {

        const topic = topics[topicKey];

        if (!topic || !topicModal || !topicContent) {
            return;
        }

        const symptomsHTML =
            topic.symptoms
                .map(item => `<li>${item}</li>`)
                .join("");

        const effectsHTML =
            topic.effects
                .map(item => `<li>${item}</li>`)
                .join("");

        const sourceHTML = topic.link
            ? `
                <a
                    class="source-link"
                    href="${topic.link}"
                    target="_blank"
                    rel="noopener noreferrer">
                    قراءة المصدر الموثوق
                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                </a>
              `
            : "";

        topicContent.innerHTML = `

            <span class="section-kicker">
                فهم الموضوع
            </span>

            <h2>${topic.title}</h2>

            <p class="topic-description">
                ${topic.intro}
            </p>

            <div class="topic-section">

                <h3>أعراض أو علامات قد تظهر</h3>

                <ul>
                    ${symptomsHTML}
                </ul>

            </div>

            <div class="topic-section">

                <h3>كيف يمكن أن يؤثر على الحياة؟</h3>

                <ul>
                    ${effectsHTML}
                </ul>

            </div>

            <div class="topic-section">

                <h3>متى قد يكون من المفيد طلب المساعدة؟</h3>

                <p>
                    ${topic.when}
                </p>

            </div>

            <div class="topic-warning">

                هذه المعلومات للتثقيف وليست أداة لتشخيص نفسك.
                التشخيص يحتاج إلى تقييم من مختص مؤهل.

            </div>

            ${
                topic.source
                    ? `<p class="topic-section">
                        <strong>مصدر:</strong> ${topic.source}
                        ${sourceHTML}
                       </p>`
                    : ""
            }

        `;

        openModal(topicModal);

    }

    document.querySelectorAll("[data-topic]")
        .forEach(button => {

            button.addEventListener("click", event => {

                event.preventDefault();

                openTopic(
                    button.getAttribute("data-topic")
                );

            });

        });


    /* =====================================================
       PROVIDER MODALS
    ===================================================== */

    const providers = {

        tasbeh: {

            name: "Tasbeh Mohamed",

            degree:
                "دبلومة في علم النفس الإكلينيكي",

            education:
                "خريجة قسم علم النفس الإكلينيكي بكلية الآداب",

            focus:
                "الضغوط النفسية، العلاقات، تقدير الذات والنمو الشخصي",

            note:
                "المعلومات المهنية المعروضة هنا مبنية على البيانات التي تم توفيرها للمنصة، ويجب تحديثها بالبيانات الرسمية قبل النشر النهائي."

        },

        mariam: {

            name: "Mariam Mahmoud",

            degree:
                "دبلومة في علم النفس الإكلينيكي",

            education:
                "خريجة قسم علم النفس الإكلينيكي بكلية الآداب",

            focus:
                "المشاعر، العلاقات، التحديات الشخصية والنمو",

            note:
                "المعلومات المهنية المعروضة هنا مبنية على البيانات التي تم توفيرها للمنصة، ويجب تحديثها بالبيانات الرسمية قبل النشر النهائي."

        }

    };

    const providerModal =
        document.getElementById("providerModal");

    const providerContent =
        document.getElementById("providerModalContent");

    document.querySelectorAll("[data-provider]")
        .forEach(button => {

            button.addEventListener("click", () => {

                const key =
                    button.getAttribute("data-provider");

                const provider =
                    providers[key];

                if (!provider) return;

                providerContent.innerHTML = `

                    <span class="section-kicker">
                        CLINICAL PSYCHOLOGY
                    </span>

                    <h2>
                        ${provider.name}
                    </h2>

                    <div class="topic-section">

                        <h3>المؤهل</h3>

                        <p>
                            ${provider.degree}
                        </p>

                    </div>

                    <div class="topic-section">

                        <h3>التعليم</h3>

                        <p>
                            ${provider.education}
                        </p>

                    </div>

                    <div class="topic-section">

                        <h3>مجالات الاهتمام</h3>

                        <p>
                            ${provider.focus}
                        </p>

                    </div>

                    <div class="topic-warning">

                        ${provider.note}

                    </div>

                    <button
                        class="btn btn-primary full-width"
                        type="button"
                        data-open-booking
                        data-selected-provider="${provider.name}">

                        احجز موعدًا مع ${provider.name}

                    </button>

                `;

                openModal(providerModal);

                const bookingButton =
                    providerContent.querySelector(
                        "[data-open-booking]"
                    );

                if (bookingButton) {

                    bookingButton.addEventListener(
                        "click",
                        () => {

                            closeAllModals();

                            openBooking(
                                provider.name
                            );

                        }
                    );

                }

            });

        });


    /* =====================================================
       BOOKING
    ===================================================== */

    const bookingModal =
        document.getElementById("bookingModal");

    const bookingForm =
        document.getElementById("bookingForm");

    const bookingSuccess =
        document.getElementById("bookingSuccess");

    const bookingProvider =
        document.getElementById("bookingProvider");

    function openBooking(providerName = "") {

        if (!bookingModal) return;

        if (bookingProvider && providerName) {

            bookingProvider.value =
                providerName;

        }

        if (bookingSuccess) {
            bookingSuccess.textContent = "";
        }

        openModal(bookingModal);

    }

    document.querySelectorAll("[data-open-booking]")
        .forEach(button => {

            button.addEventListener("click", () => {

                openBooking(
                    button.getAttribute(
                        "data-selected-provider"
                    ) || ""
                );

            });

        });


    /* =====================================================
       BOOKING SUBMIT
    ===================================================== */

    if (bookingForm) {

        bookingForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                const formData =
                    new FormData(bookingForm);

                const name =
                    formData.get("name");

                const phone =
                    formData.get("phone");

                const provider =
                    formData.get("provider");

                const date =
                    formData.get("date");

                const message =
                    formData.get("message");

                if (!name || !phone) {

                    bookingSuccess.textContent =
                        "من فضلك اكتب الاسم ورقم الهاتف.";

                    return;
                }

                /*
                   WhatsApp number from the current
                   MindCare project.
                */

                const whatsapp =
                    "201003089153";

                const text =

                    `طلب حجز جديد من MindCare%0A%0A` +

                    `الاسم: ${encodeURIComponent(name)}%0A` +

                    `الهاتف: ${encodeURIComponent(phone)}%0A` +

                    `المختص: ${encodeURIComponent(provider || "لم يتم الاختيار")}%0A` +

                    `التاريخ المفضل: ${encodeURIComponent(date || "لم يتم تحديده")}%0A` +

                    `ملاحظة: ${encodeURIComponent(message || "لا توجد")}`;

                bookingSuccess.innerHTML = `
                    تم تجهيز طلب الحجز.
                    سيتم فتح WhatsApp لإرسال البيانات.
                `;

                setTimeout(() => {

                    window.open(
                        `https://wa.me/${whatsapp}?text=${text}`,
                        "_blank"
                    );

                }, 500);

            }
        );

    }


    /* =====================================================
       FAQ
    ===================================================== */

    document.querySelectorAll(".faq-question")
        .forEach(question => {

            question.addEventListener("click", () => {

                const item =
                    question.closest(".faq-item");

                if (!item) return;

                const currentlyOpen =
                    item.classList.contains("open");

                document.querySelectorAll(".faq-item")
                    .forEach(other => {

                        other.classList.remove("open");

                    });

                if (!currentlyOpen) {

                    item.classList.add("open");

                }

            });

        });


    /* =====================================================
       INITIAL ASSESSMENT
    ===================================================== */

    const assessmentModal =
        document.getElementById("assessmentModal");

    const assessmentQuestions =
        document.getElementById(
            "assessmentQuestions"
        );

    const calculateAssessment =
        document.getElementById(
            "calculateAssessment"
        );

    const assessmentResult =
        document.getElementById(
            "assessmentResult"
        );

    const assessmentButton =
        document.getElementById(
            "assessmentButton"
        );

    const questions = [

        "هل شعرت خلال الفترة الأخيرة بالحزن أو انخفاض المزاج؟",

        "هل فقدت الاهتمام أو المتعة في أشياء كنت تستمتع بها؟",

        "هل شعرت بقلق أو توتر يصعب التحكم فيه؟",

        "هل أثرت مشاعرك على نومك أو تركيزك؟",

        "هل أثرت هذه المشاعر على العمل أو الدراسة أو العلاقات؟"

    ];

    const answers = [
        "أبدًا",
        "أحيانًا",
        "كثيرًا",
        "معظم الوقت"
    ];

    function buildAssessment() {

        if (!assessmentQuestions) return;

        assessmentQuestions.innerHTML =
            questions.map(
                (question, index) => `

                    <div class="assessment-question">

                        <p>
                            ${index + 1}. ${question}
                        </p>

                        <div class="assessment-options">

                            ${answers.map(
                                (answer, value) => `

                                    <label>

                                        <input
                                            type="radio"
                                            name="assessment-${index}"
                                            value="${value}"
                                            ${value === 0
                                                ? "checked"
                                                : ""}>

                                        ${answer}

                                    </label>

                                `
                            ).join("")}

                        </div>

                    </div>

                `
            ).join("");

    }

    if (assessmentButton) {

        assessmentButton.addEventListener(
            "click",
            () => {

                buildAssessment();

                if (assessmentResult) {
                    assessmentResult.innerHTML = "";
                }

                openModal(assessmentModal);

            }
        );

    }


    if (calculateAssessment) {

        calculateAssessment.addEventListener(
            "click",
            () => {

                let total = 0;

                questions.forEach(
                    (_, index) => {

                        const selected =
                            document.querySelector(
                                `input[name="assessment-${index}"]:checked`
                            );

                        if (selected) {
                            total +=
                                Number(selected.value);
                        }

                    }
                );

                let result = "";

                if (total <= 4) {

                    result =
                        "الإجابات لا تشير إلى مستوى مرتفع في هذا التقييم المبدئي. لكن هذا التقييم لا يستبعد وجود مشكلة نفسية.";

                } else if (total <= 9) {

                    result =
                        "قد تكون هناك بعض الأعراض أو التأثيرات التي تستحق الانتباه إليها. إذا كانت مستمرة أو تؤثر على حياتك، فالتحدث مع مختص قد يكون مفيدًا.";

                } else {

                    result =
                        "الإجابات تشير إلى وجود أعراض أو تأثيرات ملحوظة. من المفيد التفكير في التحدث مع مختص للحصول على تقييم مناسب.";

                }

                assessmentResult.innerHTML = `

                    <div class="assessment-result">

                        <strong>
                            النتيجة المبدئية
                        </strong>

                        <p>
                            ${result}
                        </p>

                        <small>
                            هذا التقييم ليس تشخيصًا ولا يغني
                            عن التقييم المهني.
                        </small>

                    </div>

                `;

            }
        );

    }


    /* =====================================================
       ACTIVE NAV
    ===================================================== */

    const sections =
        document.querySelectorAll(
            "main section[id]"
        );

    const navLinks =
        document.querySelectorAll(
            ".nav-link"
        );

    if ("IntersectionObserver" in window) {

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        navLinks.forEach(link => {

                            link.classList.remove(
                                "active"
                            );

                            if (
                                link.getAttribute("href") ===
                                `#${entry.target.id}`
                            ) {

                                link.classList.add(
                                    "active"
                                );

                            }

                        });

                    });

                },
                {
                    threshold: 0.25
                }
            );

        sections.forEach(section => {
            observer.observe(section);
        });

    }


});
