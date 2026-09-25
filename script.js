/* =========================================================
   MINDCARE
   Main Application
   Firebase + UI + Booking + Assessment
   Prepared By: Eng Ahmad Ramadan
========================================================= */

(() => {
    "use strict";

    /* =====================================================
       FIREBASE CONFIG
    ===================================================== */

    const FIREBASE_CONFIG =
        window.MINDCARE_FIREBASE_CONFIG || {
            apiKey: "AIzaSyD6E8kmMBKOglip9zACDDYTPEf54FxvBZ4",
            authDomain: "mind-care-e7743.firebaseapp.com",
            projectId: "mind-care-e7743",
            storageBucket: "mind-care-e7743.firebasestorage.app",
            messagingSenderId: "50815788969",
            appId: "1:50815788969:web:0bcf23ec8b0a8b73a286b8",
            measurementId: "G-K4FP94QFPH"
        };

    let firebaseReady = false;
    let db = null;

    /* =====================================================
       FALLBACK DATA
    ===================================================== */

    const TOPICS = {

        anxiety: {
            title: "القلق والتوتر",
            icon: "fa-wind",
            intro:
                "القلق استجابة طبيعية يمكن أن تظهر عند الشعور بالضغط أو عدم اليقين، لكنه قد يصبح مرهقًا عندما يكون مستمرًا أو يؤثر على الحياة اليومية.",
            points: [
                "التفكير الزائد وصعوبة إيقاف الأفكار",
                "الشعور بالتوتر أو عدم الارتياح",
                "صعوبة التركيز",
                "اضطراب النوم",
                "أعراض جسدية مثل تسارع ضربات القلب أو التوتر العضلي"
            ]
        },

        depression: {
            title: "الاكتئاب",
            icon: "fa-cloud",
            intro:
                "الاكتئاب قد يؤثر على المزاج والطاقة والاهتمام بالأشياء اليومية، وتختلف تجربته من شخص لآخر.",
            points: [
                "الحزن أو انخفاض المزاج لفترة مستمرة",
                "فقدان الاهتمام أو المتعة",
                "الإرهاق وانخفاض الطاقة",
                "تغيرات في النوم أو الشهية",
                "صعوبة التركيز أو إنجاز المهام"
            ]
        },

        panic: {
            title: "نوبات الهلع",
            icon: "fa-heart-pulse",
            intro:
                "نوبة الهلع قد تحدث بصورة مفاجئة وتتضمن خوفًا شديدًا وأعراضًا جسدية قوية.",
            points: [
                "خفقان القلب",
                "ضيق النفس",
                "الدوخة أو الشعور بعدم الثبات",
                "التعرق أو الرجفة",
                "الشعور بفقدان السيطرة"
            ]
        },

        ocd: {
            title: "الوسواس القهري",
            icon: "fa-arrows-rotate",
            intro:
                "الوسواس القهري قد يتضمن أفكارًا أو مخاوف متكررة وسلوكيات أو أفعالًا يشعر الشخص بدافع قوي لتكرارها.",
            points: [
                "أفكار أو صور ذهنية متكررة",
                "الحاجة إلى القيام بأفعال معينة لتخفيف القلق",
                "صعوبة تجاهل الأفكار المتكررة",
                "استهلاك وقت كبير في الطقوس أو التفكير",
                "تأثير ذلك على الحياة اليومية"
            ]
        },

        trauma: {
            title: "الصدمات النفسية",
            icon: "fa-feather",
            intro:
                "بعد بعض التجارب المؤلمة قد تظهر تغيرات في المشاعر أو النوم أو الشعور بالأمان.",
            points: [
                "ذكريات مزعجة أو متكررة",
                "تجنب أشياء مرتبطة بالتجربة",
                "زيادة التوتر أو اليقظة",
                "اضطرابات النوم",
                "تغيرات في المشاعر أو العلاقات"
            ]
        },

        sleep: {
            title: "النوم والصحة النفسية",
            icon: "fa-moon",
            intro:
                "النوم والصحة النفسية يؤثر كل منهما في الآخر، وقد يؤثر اضطراب النوم على المزاج والطاقة والتركيز.",
            points: [
                "صعوبة الدخول في النوم",
                "الاستيقاظ المتكرر",
                "النوم لفترات طويلة دون الشعور بالراحة",
                "الإرهاق أثناء اليوم",
                "تأثر التركيز والمزاج"
            ]
        },

        addiction: {
            title: "الإدمان واستخدام المواد",
            icon: "fa-hand-holding-heart",
            intro:
                "يمكن أن يصبح استخدام مادة أو القيام بسلوك معين مشكلة عندما يصعب التحكم فيه ويبدأ في التأثير على الحياة أو العلاقات أو الصحة.",
            points: [
                "صعوبة التحكم في الاستخدام",
                "الاستمرار رغم ظهور أضرار واضحة",
                "التأثير على العمل أو الدراسة",
                "التأثير على العلاقات",
                "محاولات متكررة للتقليل أو التوقف دون نجاح"
            ]
        },

        "self-esteem": {
            title: "الثقة بالنفس وتقدير الذات",
            icon: "fa-heart",
            intro:
                "تقدير الذات يرتبط بالطريقة التي ينظر بها الشخص إلى نفسه وقيمته، وقد يتأثر بالتجارب والمقارنات والعلاقات.",
            points: [
                "النقد المستمر للنفس",
                "المقارنة المستمرة بالآخرين",
                "الخوف الشديد من الخطأ",
                "صعوبة وضع الحدود",
                "ربط القيمة الشخصية بالكمال"
            ]
        },

        relationships: {
            title: "العلاقات العاطفية",
            icon: "fa-heart",
            intro:
                "العلاقات الصحية تحتاج إلى تواصل واضح وحدود واحترام متبادل.",
            points: [
                "صعوبة التعبير عن الاحتياجات",
                "الخلافات المتكررة",
                "الغيرة أو عدم الأمان",
                "صعوبة وضع الحدود",
                "أنماط تواصل غير فعالة"
            ]
        },

        family: {
            title: "العلاقات الأسرية",
            icon: "fa-house",
            intro:
                "العلاقات الأسرية قد تكون مصدر دعم مهم، لكنها قد تتضمن أيضًا ضغوطًا وخلافات تحتاج إلى فهم وتواصل.",
            points: [
                "الخلافات المتكررة",
                "صعوبة التواصل",
                "اختلاف التوقعات",
                "الحدود الشخصية",
                "التعامل مع الضغوط الأسرية"
            ]
        },

        communication: {
            title: "التواصل والحدود",
            icon: "fa-comments",
            intro:
                "التواصل الواضح ووضع الحدود الصحية يساعدان على بناء علاقات أكثر توازنًا.",
            points: [
                "التعبير الواضح عن الاحتياجات",
                "قول لا عند الحاجة",
                "الاستماع للآخر",
                "التعامل مع الخلافات",
                "احترام الحدود المتبادلة"
            ]
        }
    };


    const PROVIDERS = {

        tasbeh: {
            name: "Tasbeh Mohamed",
            specialty: "Clinical Psychology",
            bio:
                "حاصلة على دبلومة في علم النفس الإكلينيكي، وخريجة قسم علم النفس الإكلينيكي بكلية الآداب، مع اهتمام بالصحة النفسية والعلاقات والنمو الشخصي."
        },

        mariam: {
            name: "Mariam Mahmoud",
            specialty: "Clinical Psychology",
            bio:
                "حاصلة على دبلومة في علم النفس الإكلينيكي، وخريجة قسم علم النفس الإكلينيكي بكلية الآداب، مع اهتمام بالمشاعر والعلاقات والتحديات الشخصية."
        }
    };


    /* =====================================================
       DOM HELPERS
    ===================================================== */

    const $ = (selector, parent = document) =>
        parent.querySelector(selector);

    const $$ = (selector, parent = document) =>
        Array.from(parent.querySelectorAll(selector));


    const escapeHTML = (value) => {

        const div = document.createElement("div");

        div.textContent = value ?? "";

        return div.innerHTML;
    };


    /* =====================================================
       MODAL
    ===================================================== */

    function openModal(id) {

        const modal = document.getElementById(id);

        if (!modal) return;

        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");

        document.body.classList.add("modal-open");
    }


    function closeModal(modal) {

        if (!modal) return;

        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");

        if (!$(".modal.open")) {
            document.body.classList.remove("modal-open");
        }
    }


    function closeAllModals() {

        $$(".modal.open").forEach(closeModal);
    }


    /* =====================================================
       TOPICS
    ===================================================== */

    async function openTopic(topicKey) {

        const localTopic = TOPICS[topicKey];

        if (!localTopic) return;

        let topic = localTopic;

        try {

            if (firebaseReady && db) {

                const snapshot = await db
                    .collection("topics")
                    .where("key", "==", topicKey)
                    .limit(1)
                    .get();

                if (!snapshot.empty) {

                    const data = snapshot.docs[0].data();

                    if (data.active !== false) {

                        topic = {
                            title: data.titleAr || localTopic.title,
                            icon: localTopic.icon,
                            intro: data.intro || localTopic.intro,
                            points: Array.isArray(data.symptoms)
                                ? data.symptoms
                                : localTopic.points
                        };

                    }
                }
            }

        } catch (error) {

            console.warn(
                "MindCare: Could not load topic from Firebase.",
                error
            );
        }


        const content = $("#topicModalContent");

        if (!content) return;

        content.innerHTML = `

            <div class="modal-topic-icon">
                <i class="fa-solid ${escapeHTML(topic.icon)}"></i>
            </div>

            <span class="section-kicker">
                معلومات توعوية
            </span>

            <h2>
                ${escapeHTML(topic.title)}
            </h2>

            <div class="modal-content-text">

                <p>
                    ${escapeHTML(topic.intro)}
                </p>

                <ul>
                    ${topic.points.map(point => `
                        <li>${escapeHTML(point)}</li>
                    `).join("")}
                </ul>

                <p style="margin-top:18px;">
                    هذه المعلومات للتثقيف فقط ولا تمثل تشخيصًا طبيًا.
                    إذا كانت الأعراض مستمرة أو تؤثر بشكل واضح على حياتك،
                    يمكن التحدث مع مختص مؤهل.
                </p>

            </div>

        `;

        openModal("topicModal");
    }


    /* =====================================================
       PROVIDERS
    ===================================================== */

    function openProvider(providerKey) {

        const provider = PROVIDERS[providerKey];

        if (!provider) return;

        const content = $("#providerModalContent");

        if (!content) return;

        content.innerHTML = `

            <div class="modal-provider-avatar">
                ${escapeHTML(provider.name.charAt(0))}
            </div>

            <span class="section-kicker">
                ${escapeHTML(provider.specialty)}
            </span>

            <h2>
                ${escapeHTML(provider.name)}
            </h2>

            <div class="modal-content-text">

                <p>
                    ${escapeHTML(provider.bio)}
                </p>

            </div>

            <div style="margin-top:25px;">

                <button
                    class="btn btn-primary full-width"
                    type="button"
                    data-modal-book-provider="${escapeHTML(provider.name)}">

                    احجز موعدًا مع ${escapeHTML(provider.name)}

                    <i class="fa-solid fa-arrow-left"></i>

                </button>

            </div>
        `;

        openModal("providerModal");
    }


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    function initMobileMenu() {

        const toggle = $("#menuToggle");
        const nav = $("#mainNav");

        if (!toggle || !nav) return;

        toggle.addEventListener("click", () => {

            const isOpen = nav.classList.toggle("open");

            toggle.classList.toggle("active", isOpen);

            toggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );
        });


        $$(".nav-link", nav).forEach(link => {

            link.addEventListener("click", () => {

                nav.classList.remove("open");
                toggle.classList.remove("active");
                toggle.setAttribute("aria-expanded", "false");

            });

        });
    }


    /* =====================================================
       NAV ACTIVE STATE
    ===================================================== */

    function initNavigation() {

        const sections = $$("main section[id]");

        const links = $$(".nav-link");

        if (!sections.length) return;

        const observer = new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) return;

                    const id = entry.target.id;

                    links.forEach(link => {

                        link.classList.toggle(
                            "active",
                            link.getAttribute("href") === `#${id}`
                        );

                    });

                });

            },
            {
                threshold: .25
            }
        );

        sections.forEach(section => observer.observe(section));
    }


    /* =====================================================
       LANGUAGE
    ===================================================== */

    const TRANSLATIONS = {

        en: {

            "الرئيسية": "Home",
            "كيف تعمل": "How It Works",
            "الصحة النفسية": "Mental Health",
            "المختصون": "Specialists",
            "الأسئلة الشائعة": "FAQ",

            "ابدأ الحجز": "Start Booking",
            "استكشف المختصين": "Explore Specialists",
            "استكشف الموضوعات": "Explore Topics",

            "افهم ما تمر به": "Understand What You Experience",
            "مختصون": "Specialists",
            "كيف تعمل MindCare": "How MindCare Works",
            "أسئلة شائعة": "Frequently Asked Questions",

            "الدعم بدون أحكام": "Support Without Judgment",
            "علاقتك بنفسك": "Your Relationship With Yourself",
            "العلاقات": "Relationships",

            "تقييم مبدئي": "Initial Assessment",
            "الخصوصية أولًا": "Privacy First",
            "خطوتك القادمة": "Your Next Step"
        }
    };


    function changeLanguage() {

        const current =
            localStorage.getItem("mindcare_language") || "ar";

        const next = current === "ar" ? "en" : "ar";

        localStorage.setItem(
            "mindcare_language",
            next
        );

        applyLanguage(next);
    }


    function applyLanguage(language) {

        const isEnglish = language === "en";

        document.documentElement.lang =
            isEnglish ? "en" : "ar";

        document.documentElement.dir =
            isEnglish ? "ltr" : "rtl";


        const switcher = $("#languageSwitch");

        if (switcher) {
            switcher.textContent =
                isEnglish ? "AR" : "EN";
        }


        if (!isEnglish) {

            $$("[data-ar]").forEach(element => {

                element.textContent =
                    element.dataset.ar;

            });

            return;
        }


        $$("[data-en]").forEach(element => {

            element.textContent =
                element.dataset.en;

        });


        // Translate common static navigation elements
        const englishMap = TRANSLATIONS.en;

        $$("*").forEach(element => {

            if (
                element.children.length === 0 &&
                element.textContent.trim() &&
                englishMap[element.textContent.trim()]
            ) {

                element.textContent =
                    englishMap[element.textContent.trim()];
            }

        });
    }


    /* =====================================================
       FAQ
    ===================================================== */

    function initFAQ() {

        $$(".faq-question").forEach(button => {

            button.addEventListener("click", () => {

                const item =
                    button.closest(".faq-item");

                if (!item) return;

                const wasActive =
                    item.classList.contains("active");

                $$(".faq-item").forEach(other => {

                    other.classList.remove("active");

                });

                if (!wasActive) {
                    item.classList.add("active");
                }

            });

        });
    }


    /* =====================================================
       FIREBASE INITIALIZATION
    ===================================================== */

    async function initFirebase() {

        try {

            if (!FIREBASE_CONFIG?.projectId) {
                console.warn(
                    "MindCare: Firebase configuration is missing."
                );

                return false;
            }


            const appModule =
                await import(
                    "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js"
                );

            const firestoreModule =
                await import(
                    "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js"
                );


            const app =
                appModule.getApps().length
                    ? appModule.getApps()[0]
                    : appModule.initializeApp(FIREBASE_CONFIG);


            db = firestoreModule.getFirestore(app);

            window.MINDCARE_DB = db;

            window.MINDCARE_FIRESTORE =
                firestoreModule;

            firebaseReady = true;

            return true;

        } catch (error) {

            console.error(
                "MindCare Firebase initialization failed:",
                error
            );

            firebaseReady = false;

            return false;
        }
    }


    /* =====================================================
       BOOKING
    ===================================================== */

    const bookingState = {
        selectedProvider: "",
        loadingSlots: false
    };


    function resetBookingForm() {

        const form = $("#bookingForm");

        if (!form) return;

        form.reset();

        const slotSelect = $("#bookingSlot");

        if (slotSelect) {

            slotSelect.disabled = true;

            slotSelect.innerHTML = `
                <option value="">
                    اختر المختص والتاريخ أولًا
                </option>
            `;
        }

        const status = $("#slotStatus");

        if (status) {
            status.textContent = "";
        }

        const success = $("#bookingSuccess");

        if (success) {
            success.classList.remove("show");
            success.innerHTML = "";
        }
    }


    function openBooking(provider = "") {

        bookingState.selectedProvider =
            provider || "";

        const providerSelect =
            $("#bookingProvider");

        if (providerSelect) {

            providerSelect.value =
                provider || "";
        }

        const dateInput = $("#bookingDate");

        if (dateInput) {

            const today =
                new Date().toISOString().split("T")[0];

            dateInput.min = today;
        }

        openModal("bookingModal");

        if (provider) {
            loadAvailableSlots();
        }
    }


    function setBookingMessage(message, type = "success") {

        const box = $("#bookingSuccess");

        if (!box) return;

        box.classList.remove("show");

        if (type === "error") {

            box.className = "error-message";
            box.textContent = message;

        } else {

            box.className = "success-message show";
            box.textContent = message;
        }
    }


    function formatSlotLabel(slot) {

        const date = slot.date || "";
        const time = slot.time || "";

        if (!date && !time) {
            return "موعد متاح";
        }

        return `${date} — ${time}`;
    }


    async function loadAvailableSlots() {

        const providerSelect =
            $("#bookingProvider");

        const dateInput =
            $("#bookingDate");

        const slotSelect =
            $("#bookingSlot");

        const status =
            $("#slotStatus");

        if (
            !providerSelect ||
            !dateInput ||
            !slotSelect
        ) {
            return;
        }


        const provider =
            providerSelect.value.trim();

        const date =
            dateInput.value.trim();


        slotSelect.innerHTML = `
            <option value="">
                جاري تحميل المواعيد...
            </option>
        `;

        slotSelect.disabled = true;

        if (status) {
            status.textContent = "";
        }


        if (!provider || !date) {

            slotSelect.innerHTML = `
                <option value="">
                    اختر المختص والتاريخ أولًا
                </option>
            `;

            return;
        }


        if (!firebaseReady || !db) {

            slotSelect.innerHTML = `
                <option value="">
                    نظام المواعيد غير متصل حاليًا
                </option>
            `;

            if (status) {
                status.textContent =
                    "يرجى المحاولة مرة أخرى بعد قليل.";
            }

            return;
        }


        bookingState.loadingSlots = true;

        try {

            const snapshot =
                await db
                    .collection("slots")
                    .where("provider", "==", provider)
                    .where("date", "==", date)
                    .where("booked", "==", false)
                    .get();


            const slots =
                snapshot.docs
                    .map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }))
                    .sort((a, b) =>
                        String(a.time || "")
                            .localeCompare(String(b.time || ""))
                    );


            slotSelect.innerHTML = "";


            if (!slots.length) {

                slotSelect.innerHTML = `
                    <option value="">
                        لا توجد مواعيد متاحة لهذا اليوم
                    </option>
                `;

                if (status) {
                    status.textContent =
                        "اختر تاريخًا آخر أو جرّب مختصًا آخر.";
                }

                return;
            }


            const defaultOption =
                document.createElement("option");

            defaultOption.value = "";
            defaultOption.textContent =
                "اختر الموعد";

            slotSelect.appendChild(defaultOption);


            slots.forEach(slot => {

                const option =
                    document.createElement("option");

                option.value = slot.id;

                option.textContent =
                    formatSlotLabel(slot);

                option.dataset.date =
                    slot.date || "";

                option.dataset.time =
                    slot.time || "";

                slotSelect.appendChild(option);

            });


            slotSelect.disabled = false;

            if (status) {
                status.textContent =
                    `${slots.length} موعد متاح`;
            }

        } catch (error) {

            console.error(
                "MindCare: Could not load slots.",
                error
            );

            slotSelect.innerHTML = `
                <option value="">
                    تعذر تحميل المواعيد
                </option>
            `;

            if (status) {
                status.textContent =
                    "حدث خطأ أثناء تحميل المواعيد.";
            }

        } finally {

            bookingState.loadingSlots = false;
        }
    }


    async function submitBooking(event) {

        event.preventDefault();

        const form =
            event.currentTarget;

        const submitButton =
            $("#bookingSubmit");

        const name =
            $("#bookingName")?.value.trim();

        const phone =
            $("#bookingPhone")?.value.trim();

        const provider =
            $("#bookingProvider")?.value.trim();

        const date =
            $("#bookingDate")?.value.trim();

        const slotId =
            $("#bookingSlot")?.value.trim();

        const message =
            $("#bookingMessage")?.value.trim();


        if (!name || !phone || !provider || !date || !slotId) {

            setBookingMessage(
                "من فضلك أكمل البيانات المطلوبة واختر موعدًا متاحًا.",
                "error"
            );

            return;
        }


        if (!firebaseReady || !db) {

            setBookingMessage(
                "نظام الحجز غير متصل حاليًا. حاول مرة أخرى بعد قليل.",
                "error"
            );

            return;
        }


        if (submitButton) {

            submitButton.disabled = true;

            submitButton.innerHTML = `
                جاري تأكيد الحجز...
            `;
        }


        try {

            const {
                doc,
                runTransaction,
                serverTimestamp
            } = window.MINDCARE_FIRESTORE;


            const slotRef =
                doc(db, "slots", slotId);

            const bookingRef =
                doc(
                    window.MINDCARE_FIRESTORE
                        .getFirestore(db),
                    "bookings",
                    crypto.randomUUID()
                );


            /*
                Transaction:
                1. Check slot.
                2. Make sure it is still available.
                3. Create booking.
                4. Mark slot as booked.
            */

            await runTransaction(
                db,
                async transaction => {

                    const slotSnapshot =
                        await transaction.get(slotRef);

                    if (!slotSnapshot.exists()) {

                        throw new Error(
                            "SLOT_NOT_FOUND"
                        );
                    }


                    const slotData =
                        slotSnapshot.data();


                    if (slotData.booked === true) {

                        throw new Error(
                            "SLOT_ALREADY_BOOKED"
                        );
                    }


                    if (
                        slotData.provider !== provider ||
                        slotData.date !== date
                    ) {

                        throw new Error(
                            "SLOT_CHANGED"
                        );
                    }


                    transaction.set(
                        bookingRef,
                        {
                            name,
                            phone,
                            message,

                            providerId:
                                slotData.providerId || "",

                            provider,

                            slotId,

                            date:
                                slotData.date,

                            time:
                                slotData.time || "",

                            status: "pending",

                            createdAt:
                                serverTimestamp(),

                            updatedAt:
                                serverTimestamp()
                        }
                    );


                    transaction.update(
                        slotRef,
                        {
                            booked: true,

                            bookingId:
                                bookingRef.id,

                            updatedAt:
                                serverTimestamp()
                        }
                    );

                }
            );


            form.reset();

            const slotSelect =
                $("#bookingSlot");

            if (slotSelect) {

                slotSelect.disabled = true;

                slotSelect.innerHTML = `
                    <option value="">
                        تم حجز الموعد
                    </option>
                `;
            }


            setBookingMessage(
                "تم إرسال طلب الحجز بنجاح. سيتم التعامل مع الطلب من خلال إدارة MindCare.",
                "success"
            );


            if (submitButton) {

                submitButton.innerHTML = `
                    تم إرسال الحجز
                    <i class="fa-solid fa-check"></i>
                `;
            }


        } catch (error) {

            console.error(
                "MindCare booking error:",
                error
            );


            let message =
                "تعذر إتمام الحجز حاليًا. حاول مرة أخرى.";


            if (error.message === "SLOT_ALREADY_BOOKED") {

                message =
                    "هذا الموعد تم حجزه للتو. اختر موعدًا آخر.";

            } else if (error.message === "SLOT_NOT_FOUND") {

                message =
                    "الموعد لم يعد موجودًا. اختر موعدًا آخر.";

            } else if (error.message === "SLOT_CHANGED") {

                message =
                    "تغيرت بيانات الموعد. يرجى اختيار موعد جديد.";
            }


            setBookingMessage(
                message,
                "error"
            );

        } finally {

            if (submitButton) {

                submitButton.disabled = false;

                submitButton.innerHTML = `
                    إرسال طلب الحجز
                    <i class="fa-solid fa-arrow-left"></i>
                `;
            }
        }
    }


    /* =====================================================
       ASSESSMENT
    ===================================================== */

    const ASSESSMENT_QUESTIONS = [

        "خلال الفترة الأخيرة، كم مرة شعرت بالتوتر أو القلق؟",

        "كم مرة فقدت الاهتمام بأشياء كنت تستمتع بها؟",

        "كم مرة واجهت صعوبة في النوم أو شعرت بالإرهاق؟",

        "كم مرة وجدت صعوبة في التركيز أو إنجاز مهامك؟",

        "كم مرة شعرت أن مشاعرك أصبحت تؤثر على حياتك اليومية؟"

    ];


    const ASSESSMENT_OPTIONS = [
        {
            value: 0,
            label: "أبدًا"
        },
        {
            value: 1,
            label: "أحيانًا"
        },
        {
            value: 2,
            label: "كثيرًا"
        },
        {
            value: 3,
            label: "تقريبًا دائمًا"
        }
    ];


    function renderAssessment() {

        const container =
            $("#assessmentQuestions");

        if (!container) return;


        container.innerHTML =
            ASSESSMENT_QUESTIONS
                .map((question, index) => `

                    <div class="assessment-question">

                        <h3>
                            ${index + 1}.
                            ${escapeHTML(question)}
                        </h3>

                        <div class="assessment-options">

                            ${ASSESSMENT_OPTIONS.map(option => `

                                <div class="assessment-option">

                                    <input
                                        type="radio"
                                        id="assessment-${index}-${option.value}"
                                        name="assessment-${index}"
                                        value="${option.value}">

                                    <label
                                        for="assessment-${index}-${option.value}">

                                        ${escapeHTML(option.label)}

                                    </label>

                                </div>

                            `).join("")}

                        </div>

                    </div>

                `)
                .join("");
    }


    function calculateAssessment() {

        let total = 0;

        let answered = 0;


        ASSESSMENT_QUESTIONS.forEach(
            (_, index) => {

                const selected =
                    document.querySelector(
                        `input[name="assessment-${index}"]:checked`
                    );

                if (selected) {

                    answered++;

                    total += Number(
                        selected.value
                    );
                }
            }
        );


        const result =
            $("#assessmentResult");

        if (!result) return;


        if (answered < ASSESSMENT_QUESTIONS.length) {

            result.innerHTML = `
                <div class="error-message">
                    من فضلك أجب عن جميع الأسئلة أولًا.
                </div>
            `;

            return;
        }


        let message;


        if (total <= 4) {

            message =
                "الإجابات تشير إلى مستوى منخفض من الأعراض في هذا التقييم القصير. إذا كان هناك شيء محدد يزعجك، يمكنك التحدث عنه مع شخص تثق به أو مختص.";

        } else if (total <= 9) {

            message =
                "توجد بعض الأعراض التي قد تستحق الانتباه إليها، خصوصًا إذا كانت مستمرة أو تؤثر على حياتك اليومية.";

        } else {

            message =
                "الإجابات تشير إلى وجود أعراض تستحق مناقشتها مع مختص مؤهل، خاصة إذا كانت مستمرة أو تؤثر بشكل واضح على حياتك اليومية.";

        }


        result.innerHTML = `

            <div class="assessment-result-box">

                <strong>
                    النتيجة التثقيفية
                </strong>

                <span>
                    ${escapeHTML(message)}
                </span>

                <p style="margin-top:10px;font-size:10px;">
                    هذا التقييم ليس تشخيصًا طبيًا ولا يحدد وجود أو عدم وجود اضطراب نفسي.
                </p>

            </div>

        `;
    }


    /* =====================================================
       EVENT DELEGATION
    ===================================================== */

    function initGlobalEvents() {

        document.addEventListener("click", event => {

            const bookingButton =
                event.target.closest("[data-open-booking]");

            if (bookingButton) {

                const provider =
                    bookingButton.dataset.selectedProvider || "";

                openBooking(provider);

                return;
            }


            const topicButton =
                event.target.closest("[data-topic]");

            if (topicButton) {

                const topic =
                    topicButton.dataset.topic;

                openTopic(topic);

                return;
            }


            const providerButton =
                event.target.closest("[data-provider]");

            if (providerButton) {

                openProvider(
                    providerButton.dataset.provider
                );

                return;
            }


            const modalProviderButton =
                event.target.closest(
                    "[data-modal-book-provider]"
                );

            if (modalProviderButton) {

                const provider =
                    modalProviderButton.dataset
                        .modalBookProvider;

                closeAllModals();

                setTimeout(
                    () => openBooking(provider),
                    120
                );

                return;
            }


            const closeButton =
                event.target.closest("[data-close-modal]");

            if (closeButton) {

                const modal =
                    closeButton.closest(".modal");

                closeModal(modal);

                return;
            }


            const scrollLink =
                event.target.closest(
                    'a[href^="#"]'
                );

            if (
                scrollLink &&
                scrollLink.getAttribute("href") !== "#"
            ) {

                const targetId =
                    scrollLink.getAttribute("href");

                const target =
                    document.querySelector(targetId);

                if (target) {

                    event.preventDefault();

                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            }

        });


        document.addEventListener("keydown", event => {

            if (event.key === "Escape") {
                closeAllModals();
            }

        });
    }


    /* =====================================================
       BOOKING EVENTS
    ===================================================== */

    function initBookingEvents() {

        const form =
            $("#bookingForm");

        if (form) {

            form.addEventListener(
                "submit",
                submitBooking
            );
        }


        const provider =
            $("#bookingProvider");

        const date =
            $("#bookingDate");


        provider?.addEventListener(
            "change",
            loadAvailableSlots
        );


        date?.addEventListener(
            "change",
            loadAvailableSlots
        );
    }


    /* =====================================================
       ASSESSMENT EVENTS
    ===================================================== */

    function initAssessment() {

        const openButton =
            $("#assessmentButton");

        if (openButton) {

            openButton.addEventListener(
                "click",
                () => {

                    renderAssessment();

                    const result =
                        $("#assessmentResult");

                    if (result) {
                        result.innerHTML = "";
                    }

                    openModal("assessmentModal");
                }
            );
        }


        const calculateButton =
            $("#calculateAssessment");

        if (calculateButton) {

            calculateButton.addEventListener(
                "click",
                calculateAssessment
            );
        }
    }


    /* =====================================================
       INITIALIZATION
    ===================================================== */

    async function init() {

        initMobileMenu();

        initNavigation();

        initFAQ();

        initGlobalEvents();

        initBookingEvents();

        initAssessment();


        const language =
            localStorage.getItem("mindcare_language") || "ar";

        applyLanguage(language);


        const firebase =
            await initFirebase();


        if (firebase) {

            console.log(
                "MindCare: Firebase connected successfully."
            );

        } else {

            console.warn(
                "MindCare: Running without Firebase connection."
            );
        }
    }


    /* =====================================================
       START
    ===================================================== */

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            init
        );

    } else {

        init();

    }

})();
