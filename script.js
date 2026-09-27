here/* =========================================================
   MINDCARE
   Public Website
   Firebase Firestore Booking System
========================================================= */

import {
    initializeApp
} from
    "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
    getFirestore,
    collection,
    query,
    orderBy,
    onSnapshot,
    addDoc,
    doc,
    runTransaction,
    serverTimestamp
} from
    "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


/* =========================================================
   FIREBASE
========================================================= */

const firebaseConfig =
    window.MINDCARE_FIREBASE_CONFIG;


if (!firebaseConfig) {

    console.error(
        "Firebase configuration was not found."
    );

    showFirebaseError();

    throw new Error(
        "Firebase configuration missing."
    );
}


const app =
    initializeApp(firebaseConfig);

const db =
    getFirestore(app);


/* =========================================================
   DOM
========================================================= */

const header =
    document.getElementById("header");

const menuBtn =
    document.getElementById("menuBtn");

const mainNav =
    document.getElementById("mainNav");

const languageSwitch =
    document.getElementById("languageSwitch");

const bookingForm =
    document.getElementById("bookingForm");

const bookingName =
    document.getElementById("bookingName");

const bookingPhone =
    document.getElementById("bookingPhone");

const bookingProvider =
    document.getElementById("bookingProvider");

const bookingDate =
    document.getElementById("bookingDate");

const bookingTime =
    document.getElementById("bookingTime");

const bookingMessage =
    document.getElementById("bookingMessage");

const bookingSubmit =
    document.getElementById("bookingSubmit");

const bookingFormMessage =
    document.getElementById("bookingMessage");


/* =========================================================
   LOCAL STATE
========================================================= */

let providersCache = [];

let slotsCache = [];

let currentLanguage = "ar";


/* =========================================================
   HELPERS
========================================================= */

function escapeHTML(value = "") {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function todayString() {

    const date =
        new Date();

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function showFormMessage(
    message,
    type = "success"
) {

    if (!bookingFormMessage) return;

    bookingFormMessage.textContent =
        message;

    bookingFormMessage.className =
        `form-message ${type}`;

    bookingFormMessage.style.display =
        "block";
}


function hideFormMessage() {

    if (!bookingFormMessage) return;

    bookingFormMessage.style.display =
        "none";
}


function setButtonLoading(
    loading
) {

    if (!bookingSubmit) return;

    if (loading) {

        bookingSubmit.classList.add(
            "loading"
        );

        bookingSubmit.innerHTML = `
            <span>
                جاري إرسال الطلب...
            </span>

            <i class="fa-solid fa-spinner"></i>
        `;

    } else {

        bookingSubmit.classList.remove(
            "loading"
        );

        bookingSubmit.innerHTML = `
            <span>
                إرسال طلب الحجز
            </span>

            <i class="fa-solid fa-arrow-left"></i>
        `;
    }
}


/* =========================================================
   HEADER SCROLL
========================================================= */

function handleHeaderScroll() {

    if (!header) return;

    if (window.scrollY > 25) {

        header.classList.add(
            "scrolled"
        );

    } else {

        header.classList.remove(
            "scrolled"
        );
    }
}


window.addEventListener(
    "scroll",
    handleHeaderScroll,
    {
        passive: true
    }
);

handleHeaderScroll();


/* =========================================================
   MOBILE MENU
========================================================= */

if (menuBtn && mainNav) {

    menuBtn.addEventListener(
        "click",
        () => {

            mainNav.classList.toggle(
                "open"
            );

            const opened =
                mainNav.classList.contains(
                    "open"
                );

            menuBtn.innerHTML =
                opened
                    ? `<i class="fa-solid fa-xmark"></i>`
                    : `<i class="fa-solid fa-bars"></i>`;
        }
    );


    mainNav
        .querySelectorAll("a")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    mainNav.classList.remove(
                        "open"
                    );

                    menuBtn.innerHTML =
                        `<i class="fa-solid fa-bars"></i>`;
                }
            );

        });
}


/* =========================================================
   ACTIVE NAV
========================================================= */

const sections =
    document.querySelectorAll(
        "main section[id]"
    );

const navLinks =
    document.querySelectorAll(
        ".nav-link"
    );


function updateActiveNav() {

    let current =
        "home";


    sections.forEach(section => {

        const top =
            section.offsetTop - 150;

        const bottom =
            top + section.offsetHeight;


        if (
            window.scrollY >= top &&
            window.scrollY < bottom
        ) {

            current =
                section.id;
        }

    });


    navLinks.forEach(link => {

        const href =
            link.getAttribute("href");

        link.classList.toggle(
            "active",
            href === `#${current}`
        );

    });
}


window.addEventListener(
    "scroll",
    updateActiveNav,
    {
        passive: true
    }
);

updateActiveNav();


/* =========================================================
   LANGUAGE SWITCH
========================================================= */

if (languageSwitch) {

    languageSwitch.addEventListener(
        "click",
        () => {

            /*
                The main version is Arabic.
                This button prepares the UI for the
                bilingual system without breaking
                the booking system.
            */

            if (currentLanguage === "ar") {

                currentLanguage = "en";

                document.documentElement
                    .setAttribute(
                        "lang",
                        "en"
                    );

                document.documentElement
                    .setAttribute(
                        "dir",
                        "ltr"
                    );

                languageSwitch.textContent =
                    "العربية";

                showEnglishNotice();

            } else {

                currentLanguage = "ar";

                document.documentElement
                    .setAttribute(
                        "lang",
                        "ar"
                    );

                document.documentElement
                    .setAttribute(
                        "dir",
                        "rtl"
                    );

                languageSwitch.textContent =
                    "English";
            }

        }
    );
}


function showEnglishNotice() {

    /*
        English translation layer can be added
        later without changing Firebase.
        For now we keep Arabic content stable
        rather than showing mixed languages.
    */

    const title =
        document.querySelector(
            ".hero h1"
        );

    if (title) {

        title.innerHTML =
            `Take a step toward <em>greater</em> peace.`;
    }

    const description =
        document.querySelector(
            ".hero-description"
        );

    if (description) {

        description.textContent =
            "MindCare helps you understand what you are going through, connect with the right specialist, and begin a more thoughtful journey.";
    }
}


/* =========================================================
   PROVIDERS
========================================================= */

function startProvidersListener() {

    const providersQuery =
        query(
            collection(
                db,
                "providers"
            ),
            orderBy(
                "nameAr"
            )
        );


    onSnapshot(
        providersQuery,

        snapshot => {

            providersCache =
                snapshot.docs
                    .map(item => ({
                        id: item.id,
                        ...item.data()
                    }))
                    .filter(
                        provider =>
                            provider.active !== false
                    );


            renderProviders();

            filterDatesForProvider();

        },

        error => {

            console.error(
                "Providers listener error:",
                error
            );


            if (bookingProvider) {

                bookingProvider.innerHTML = `
                    <option value="">
                        تعذر تحميل المتخصصين
                    </option>
                `;
            }
        }
    );
}


function renderProviders() {

    if (!bookingProvider) return;


    bookingProvider.innerHTML = `
        <option value="">
            اختر المتخصص
        </option>
    `;


    if (!providersCache.length) {

        bookingProvider.innerHTML = `
            <option value="">
                لا توجد مواعيد متاحة حاليًا
            </option>
        `;

        return;
    }


    providersCache.forEach(
        provider => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                provider.id;

            option.textContent =
                provider.nameAr ||
                provider.nameEn ||
                "متخصص";

            bookingProvider.appendChild(
                option
            );
        }
    );
}


/* =========================================================
   SLOTS
========================================================= */

function startSlotsListener() {

    const slotsQuery =
        query(
            collection(
                db,
                "slots"
            ),
            orderBy(
                "date"
            )
        );


    onSnapshot(
        slotsQuery,

        snapshot => {

            slotsCache =
                snapshot.docs
                    .map(item => ({
                        id: item.id,
                        ...item.data()
                    }));


            filterDatesForProvider();

        },

        error => {

            console.error(
                "Slots listener error:",
                error
            );

            if (bookingDate) {

                bookingDate.innerHTML = `
                    <option value="">
                        تعذر تحميل المواعيد
                    </option>
                `;
            }
        }
    );
}


/* =========================================================
   PROVIDER CHANGE
========================================================= */

if (bookingProvider) {

    bookingProvider.addEventListener(
        "change",
        () => {

            resetDateAndTime();

            filterDatesForProvider();
        }
    );
}


/* =========================================================
   DATE CHANGE
========================================================= */

if (bookingDate) {

    bookingDate.addEventListener(
        "change",
        () => {

            renderTimes();
        }
    );
}


/* =========================================================
   RESET DATE / TIME
========================================================= */

function resetDateAndTime() {

    if (bookingDate) {

        bookingDate.innerHTML = `
            <option value="">
                اختر اليوم
            </option>
        `;
    }


    if (bookingTime) {

        bookingTime.innerHTML = `
            <option value="">
                اختر اليوم أولًا
            </option>
        `;
    }
}


/* =========================================================
   FILTER DATES
========================================================= */

function filterDatesForProvider() {

    if (!bookingDate) return;


    const providerId =
        bookingProvider?.value;


    if (!providerId) {

        bookingDate.innerHTML = `
            <option value="">
                اختر المتخصص أولًا
            </option>
        `;

        if (bookingTime) {

            bookingTime.innerHTML = `
                <option value="">
                    اختر اليوم أولًا
                </option>
            `;
        }

        return;
    }


    const availableSlots =
        slotsCache.filter(
            slot =>
                slot.providerId === providerId &&
                slot.booked !== true &&
                slot.date &&
                slot.date >= todayString()
        );


    const dates =
        [
            ...new Set(
                availableSlots.map(
                    slot => slot.date
                )
            )
        ].sort();


    bookingDate.innerHTML = `
        <option value="">
            ${
                dates.length
                    ? "اختر اليوم"
                    : "لا توجد مواعيد متاحة"
            }
        </option>
    `;


    dates.forEach(
        date => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                date;

            option.textContent =
                formatDate(
                    date
                );

            bookingDate.appendChild(
                option
            );
        }
    );


    if (bookingTime) {

        bookingTime.innerHTML = `
            <option value="">
                اختر اليوم أولًا
            </option>
        `;
    }
}


/* =========================================================
   RENDER TIMES
========================================================= */

function renderTimes() {

    if (!bookingTime) return;


    const providerId =
        bookingProvider?.value;

    const date =
        bookingDate?.value;


    if (!providerId || !date) {

        bookingTime.innerHTML = `
            <option value="">
                اختر اليوم أولًا
            </option>
        `;

        return;
    }


    const times =
        slotsCache
            .filter(
                slot =>
                    slot.providerId === providerId &&
                    slot.date === date &&
                    slot.booked !== true
            )
            .sort(
                (a, b) =>
                    String(a.time)
                        .localeCompare(
                            String(b.time)
                        )
            );


    bookingTime.innerHTML = `
        <option value="">
            ${
                times.length
                    ? "اختر الوقت"
                    : "لا توجد أوقات متاحة"
            }
        </option>
    `;


    times.forEach(
        slot => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                slot.time;

            option.textContent =
                formatTime(
                    slot.time
                );

            option.dataset.slotId =
                slot.id;

            bookingTime.appendChild(
                option
            );
        }
    );
}


/* =========================================================
   DATE FORMAT
========================================================= */

function formatDate(
    dateString
) {

    try {

        const date =
            new Date(
                `${dateString}T12:00:00`
            );


        return date.toLocaleDateString(
            "ar-EG",
            {
                weekday: "long",
                day: "numeric",
                month: "long"
            }
        );

    } catch {

        return dateString;
    }
}


/* =========================================================
   TIME FORMAT
========================================================= */

function formatTime(
    time
) {

    if (!time) return "";

    const parts =
        String(time).split(":");

    if (parts.length < 2) {
        return time;
    }


    let hour =
        Number(parts[0]);

    const minute =
        parts[1];

    const period =
        hour >= 12
            ? "م"
            : "ص";


    hour =
        hour % 12 || 12;


    return `${hour}:${minute} ${period}`;
}


/* =========================================================
   VALIDATE PHONE
========================================================= */

function validatePhone(
    phone
) {

    const cleaned =
        String(phone)
            .replace(/\s+/g, "")
            .replace(/-/g, "");


    return /^(\+?20|0)?1[0125][0-9]{8}$/
        .test(cleaned);
}


/* =========================================================
   BOOKING SUBMIT
========================================================= */

if (bookingForm) {

    bookingForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            hideFormMessage();


            const name =
                bookingName?.value.trim();

            const phone =
                bookingPhone?.value.trim();

            const providerId =
                bookingProvider?.value;

            const date =
                bookingDate?.value;

            const time =
                bookingTime?.value;

            const message =
                bookingMessage?.value.trim();


            /* ---------------------------------------------
               BASIC VALIDATION
            --------------------------------------------- */

            if (
                !name ||
                !phone ||
                !providerId ||
                !date ||
                !time
            ) {

                showFormMessage(
                    "من فضلك أكمل بيانات الحجز المطلوبة.",
                    "error"
                );

                return;
            }


            if (
                name.length < 2
            ) {

                showFormMessage(
                    "اكتب اسمًا صحيحًا.",
                    "error"
                );

                return;
            }


            if (
                !validatePhone(phone)
            ) {

                showFormMessage(
                    "اكتب رقم هاتف مصري صحيح.",
                    "error"
                );

                return;
            }


            const provider =
                providersCache.find(
                    item =>
                        item.id === providerId
                );


            if (!provider) {

                showFormMessage(
                    "المتخصص المحدد غير متاح.",
                    "error"
                );

                return;
            }


            const selectedSlot =
                slotsCache.find(
                    slot =>
                        slot.providerId === providerId &&
                        slot.date === date &&
                        slot.time === time &&
                        slot.booked !== true
                );


            if (!selectedSlot) {

                showFormMessage(
                    "هذا الموعد لم يعد متاحًا. اختر موعدًا آخر.",
                    "error"
                );

                filterDatesForProvider();

                return;
            }


            /* ---------------------------------------------
               LOADING
            --------------------------------------------- */

            setButtonLoading(true);


            try {

                /*
                    Transaction prevents two clients
                    from successfully booking the same slot.
                */

                await runTransaction(
                    db,
                    async transaction => {

                        const slotRef =
                            doc(
                                db,
                                "slots",
                                selectedSlot.id
                            );


                        const bookingRef =
                            doc(
                                collection(
                                    db,
                                    "bookings"
                                )
                            );


                        const slotSnapshot =
                            await transaction.get(
                                slotRef
                            );


                        if (
                            !slotSnapshot.exists()
                        ) {

                            throw new Error(
                                "SLOT_NOT_FOUND"
                            );
                        }


                        const slotData =
                            slotSnapshot.data();


                        if (
                            slotData.booked === true
                        ) {

                            throw new Error(
                                "SLOT_ALREADY_BOOKED"
                            );
                        }


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


                        transaction.set(
                            bookingRef,
                            {

                                name,

                                phone,

                                providerId,

                                provider:
                                    provider.nameAr ||
                                    provider.nameEn ||
                                    "",

                                date,

                                time,

                                message,

                                slotId:
                                    selectedSlot.id,

                                status:
                                    "pending",

                                createdAt:
                                    serverTimestamp(),

                                updatedAt:
                                    serverTimestamp()
                            }
                        );

                    }
                );


                /* -----------------------------------------
                   SUCCESS
                ----------------------------------------- */

                showFormMessage(
                    "تم إرسال طلب الحجز بنجاح. سيتم مراجعة الطلب وتأكيده.",
                    "success"
                );


                bookingForm.reset();


                resetDateAndTime();


                filterDatesForProvider();


                document
                    .getElementById(
                        "assessment"
                    )
                    ?.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });


            } catch (error) {

                console.error(
                    "Booking error:",
                    error
                );


                let message =
                    "حدث خطأ أثناء إرسال الحجز. حاول مرة أخرى.";


                if (
                    error.message ===
                    "SLOT_ALREADY_BOOKED"
                ) {

                    message =
                        "عذرًا، هذا الموعد تم حجزه للتو. اختر موعدًا آخر.";
                }


                if (
                    error.message ===
                    "SLOT_NOT_FOUND"
                ) {

                    message =
                        "هذا الموعد لم يعد موجودًا.";
                }


                showFormMessage(
                    message,
                    "error"
                );

            } finally {

                setButtonLoading(false);
            }

        }
    );
}


/* =========================================================
   FIREBASE ERROR
========================================================= */

function showFirebaseError() {

    if (!bookingProvider) return;

    bookingProvider.innerHTML = `
        <option value="">
            تعذر الاتصال بالخدمة
        </option>
    `;
}


/* =========================================================
   INITIALIZE
========================================================= */

function init() {

    startProvidersListener();

    startSlotsListener();


    /*
        Prevent choosing a previous date
        if browser date input is ever added.
    */

    document
        .querySelectorAll(
            'input[type="date"]'
        )
        .forEach(
            input => {
                input.min =
                    todayString();
            }
        );


    console.log(
        "MindCare public website initialized."
    );
}


init();
