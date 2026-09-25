/* =========================================================
   MINDCARE
   Firebase Booking System
   Client Booking Page
   No WhatsApp
========================================================= */

import { initializeApp } from
    "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
    getFirestore,
    collection,
    doc,
    runTransaction,
    serverTimestamp,
    query,
    where,
    onSnapshot
} from
    "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


/* =========================================================
   Firebase
========================================================= */

const firebaseConfig = window.MINDCARE_FIREBASE_CONFIG;

if (!firebaseConfig) {
    throw new Error("Firebase configuration was not loaded.");
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


/* =========================================================
   DOM Elements
========================================================= */

const bookingForm = document.getElementById("bookingForm");

const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const messageInput = document.getElementById("message");

const providerSelect = document.getElementById("provider");
const dateSelect = document.getElementById("date");
const timeSelect = document.getElementById("time");

const submitButton = document.getElementById("submitBooking");
const bookingMessage = document.getElementById("bookingMessage");


/* =========================================================
   State
========================================================= */

let providers = [];
let slots = [];

let unsubscribeProviders = null;
let unsubscribeSlots = null;


/* =========================================================
   Helpers
========================================================= */

function showMessage(message, type = "success") {

    if (!bookingMessage) return;

    bookingMessage.textContent = message;

    bookingMessage.className = "";

    bookingMessage.classList.add(type);

    bookingMessage.style.display = "block";
}


function hideMessage() {

    if (!bookingMessage) return;

    bookingMessage.textContent = "";

    bookingMessage.className = "";

    bookingMessage.style.display = "none";
}


function setLoading(button, loading) {

    if (!button) return;

    button.disabled = loading;

    if (loading) {
        button.dataset.originalText = button.textContent;
        button.textContent = "جاري إرسال طلب الحجز...";
    } else {
        button.textContent =
            button.dataset.originalText || "تأكيد طلب الحجز";
    }
}


function resetSelect(select, text) {

    select.innerHTML = "";

    const option = document.createElement("option");

    option.value = "";
    option.textContent = text;

    select.appendChild(option);
}


/* =========================================================
   Load Providers
========================================================= */

function loadProviders() {

    const providersQuery = query(
        collection(db, "providers"),
        where("active", "==", true)
    );

    unsubscribeProviders = onSnapshot(
        providersQuery,
        snapshot => {

            providers = [];

            snapshot.forEach(docSnap => {

                const data = docSnap.data();

                providers.push({
                    id: docSnap.id,
                    ...data
                });

            });

            providers.sort((a, b) => {

                const nameA =
                    a.nameAr ||
                    a.name ||
                    "";

                const nameB =
                    b.nameAr ||
                    b.name ||
                    "";

                return nameA.localeCompare(
                    nameB,
                    "ar"
                );

            });

            renderProviders();

        },
        error => {

            console.error(
                "Providers error:",
                error
            );

            resetSelect(
                providerSelect,
                "تعذر تحميل المختصين"
            );

            showMessage(
                "حدث خطأ أثناء تحميل المختصين. حاول مرة أخرى.",
                "error"
            );

        }
    );
}


/* =========================================================
   Render Providers
========================================================= */

function renderProviders() {

    resetSelect(
        providerSelect,
        "اختر المختص"
    );

    if (!providers.length) {

        resetSelect(
            providerSelect,
            "لا يوجد مختصون متاحون حاليًا"
        );

        providerSelect.disabled = true;

        resetSelect(
            dateSelect,
            "لا توجد مواعيد متاحة"
        );

        dateSelect.disabled = true;

        resetSelect(
            timeSelect,
            "لا توجد مواعيد متاحة"
        );

        timeSelect.disabled = true;

        return;
    }

    providerSelect.disabled = false;

    providers.forEach(provider => {

        const option =
            document.createElement("option");

        option.value = provider.id;

        option.textContent =
            provider.nameAr ||
            provider.name ||
            "مختص";

        providerSelect.appendChild(option);

    });
}


/* =========================================================
   Load Slots
========================================================= */

function loadSlotsForProvider(providerId) {

    if (unsubscribeSlots) {
        unsubscribeSlots();
        unsubscribeSlots = null;
    }

    slots = [];

    resetSelect(
        dateSelect,
        "جاري تحميل المواعيد..."
    );

    dateSelect.disabled = true;

    resetSelect(
        timeSelect,
        "اختر التاريخ أولًا"
    );

    timeSelect.disabled = true;

    if (!providerId) {

        resetSelect(
            dateSelect,
            "اختر المختص أولًا"
        );

        resetSelect(
            timeSelect,
            "اختر التاريخ أولًا"
        );

        return;
    }


    const slotsQuery = query(
        collection(db, "slots"),
        where("providerId", "==", providerId),
        where("booked", "==", false)
    );


    unsubscribeSlots = onSnapshot(
        slotsQuery,
        snapshot => {

            slots = [];

            snapshot.forEach(docSnap => {

                const data = docSnap.data();

                slots.push({
                    id: docSnap.id,
                    ...data
                });

            });


            slots.sort((a, b) => {

                const dateCompare =
                    String(a.date || "")
                        .localeCompare(
                            String(b.date || "")
                        );

                if (dateCompare !== 0) {
                    return dateCompare;
                }

                return String(a.time || "")
                    .localeCompare(
                        String(b.time || "")
                    );

            });


            renderDates();

        },
        error => {

            console.error(
                "Slots error:",
                error
            );

            resetSelect(
                dateSelect,
                "تعذر تحميل المواعيد"
            );

            resetSelect(
                timeSelect,
                "تعذر تحميل المواعيد"
            );

            showMessage(
                "حدث خطأ أثناء تحميل المواعيد.",
                "error"
            );

        }
    );
}


/* =========================================================
   Render Dates
========================================================= */

function renderDates() {

    resetSelect(
        dateSelect,
        "اختر التاريخ"
    );

    resetSelect(
        timeSelect,
        "اختر التاريخ أولًا"
    );

    dateSelect.disabled = true;
    timeSelect.disabled = true;

    if (!slots.length) {

        resetSelect(
            dateSelect,
            "لا توجد مواعيد متاحة"
        );

        resetSelect(
            timeSelect,
            "لا توجد مواعيد متاحة"
        );

        return;
    }


    const dates = [
        ...new Set(
            slots
                .map(slot => slot.date)
                .filter(Boolean)
        )
    ];


    dates.forEach(date => {

        const option =
            document.createElement("option");

        option.value = date;

        option.textContent =
            formatDate(date);

        dateSelect.appendChild(option);

    });


    dateSelect.disabled = false;
}


/* =========================================================
   Render Times
========================================================= */

function renderTimes(selectedDate) {

    resetSelect(
        timeSelect,
        "اختر الوقت"
    );

    timeSelect.disabled = true;

    if (!selectedDate) {
        return;
    }


    const selectedSlots =
        slots.filter(
            slot =>
                slot.date === selectedDate &&
                slot.booked === false
        );


    if (!selectedSlots.length) {

        resetSelect(
            timeSelect,
            "لا توجد أوقات متاحة"
        );

        return;
    }


    selectedSlots.forEach(slot => {

        const option =
            document.createElement("option");

        option.value = slot.id;

        option.textContent =
            slot.time || "وقت غير محدد";

        timeSelect.appendChild(option);

    });


    timeSelect.disabled = false;
}


/* =========================================================
   Format Date
========================================================= */

function formatDate(dateString) {

    if (!dateString) {
        return "";
    }

    const date =
        new Date(`${dateString}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
        return dateString;
    }

    return new Intl.DateTimeFormat(
        "ar-EG",
        {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    ).format(date);
}


/* =========================================================
   Provider Change
========================================================= */

providerSelect.addEventListener(
    "change",
    () => {

        hideMessage();

        const providerId =
            providerSelect.value;

        loadSlotsForProvider(
            providerId
        );
    }
);


/* =========================================================
   Date Change
========================================================= */

dateSelect.addEventListener(
    "change",
    () => {

        hideMessage();

        renderTimes(
            dateSelect.value
        );
    }
);


/* =========================================================
   Submit Booking
========================================================= */

bookingForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();

        hideMessage();


        const name =
            nameInput.value.trim();

        const phone =
            phoneInput.value.trim();

        const message =
            messageInput.value.trim();

        const providerId =
            providerSelect.value;

        const date =
            dateSelect.value;

        const slotId =
            timeSelect.value;


        /* -------------------------------------------------
           Validation
        ------------------------------------------------- */

        if (!name) {

            showMessage(
                "من فضلك اكتب الاسم بالكامل.",
                "error"
            );

            nameInput.focus();

            return;
        }


        if (!phone) {

            showMessage(
                "من فضلك اكتب رقم الهاتف.",
                "error"
            );

            phoneInput.focus();

            return;
        }


        if (!providerId) {

            showMessage(
                "من فضلك اختر المختص.",
                "error"
            );

            providerSelect.focus();

            return;
        }


        if (!date) {

            showMessage(
                "من فضلك اختر التاريخ.",
                "error"
            );

            dateSelect.focus();

            return;
        }


        if (!slotId) {

            showMessage(
                "من فضلك اختر الوقت.",
                "error"
            );

            timeSelect.focus();

            return;
        }


        const provider =
            providers.find(
                item =>
                    item.id === providerId
            );


        if (!provider) {

            showMessage(
                "المختص المحدد غير متاح حاليًا.",
                "error"
            );

            return;
        }


        const selectedSlot =
            slots.find(
                item =>
                    item.id === slotId
            );


        if (!selectedSlot) {

            showMessage(
                "هذا الموعد لم يعد متاحًا. اختر موعدًا آخر.",
                "error"
            );

            loadSlotsForProvider(
                providerId
            );

            return;
        }


        setLoading(
            submitButton,
            true
        );


        try {

            /* -------------------------------------------------
               Atomic Firestore Transaction
               -------------------------------------------------
               1. Check slot
               2. Make sure it is still available
               3. Create booking
               4. Mark slot as booked

               All operations happen together.
            ------------------------------------------------- */

            await runTransaction(
                db,
                async transaction => {

                    const slotRef =
                        doc(
                            db,
                            "slots",
                            slotId
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


                    if (!slotSnapshot.exists()) {

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


                    if (
                        slotData.providerId !==
                        providerId
                    ) {

                        throw new Error(
                            "PROVIDER_MISMATCH"
                        );
                    }


                    /* Create booking */

                    transaction.set(
                        bookingRef,
                        {
                            name: name,

                            phone: phone,

                            message: message,

                            providerId:
                                providerId,

                            provider:
                                provider.nameAr ||
                                provider.name ||
                                "",

                            slotId:
                                slotId,

                            date:
                                slotData.date,

                            time:
                                slotData.time,

                            status:
                                "pending",

                            createdAt:
                                serverTimestamp(),

                            updatedAt:
                                serverTimestamp()
                        }
                    );


                    /* Lock the slot */

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


            /* -------------------------------------------------
               Success
            ------------------------------------------------- */

            showMessage(
                "تم إرسال طلب الحجز بنجاح. سيتم مراجعة طلبك من الإدارة.",
                "success"
            );


            bookingForm.reset();


            resetSelect(
                providerSelect,
                "اختر المختص"
            );


            providers.forEach(provider => {

                const option =
                    document.createElement("option");

                option.value =
                    provider.id;

                option.textContent =
                    provider.nameAr ||
                    provider.name ||
                    "مختص";

                providerSelect.appendChild(
                    option
                );

            });


            providerSelect.disabled = false;


            resetSelect(
                dateSelect,
                "اختر المختص أولًا"
            );

            dateSelect.disabled = true;


            resetSelect(
                timeSelect,
                "اختر التاريخ أولًا"
            );

            timeSelect.disabled = true;


        } catch (error) {

            console.error(
                "Booking error:",
                error
            );


            if (
                error.message ===
                "SLOT_ALREADY_BOOKED"
            ) {

                showMessage(
                    "عذرًا، هذا الموعد تم حجزه للتو. من فضلك اختر موعدًا آخر.",
                    "error"
                );

            } else if (
                error.message ===
                "SLOT_NOT_FOUND"
            ) {

                showMessage(
                    "هذا الموعد لم يعد موجودًا. اختر موعدًا آخر.",
                    "error"
                );

            } else if (
                error.message ===
                "PROVIDER_MISMATCH"
            ) {

                showMessage(
                    "حدث تعارض في بيانات الموعد. اختر موعدًا آخر.",
                    "error"
                );

            } else {

                showMessage(
                    "حدث خطأ أثناء إرسال الحجز. من فضلك حاول مرة أخرى.",
                    "error"
                );

            }


            loadSlotsForProvider(
                providerId
            );

        } finally {

            setLoading(
                submitButton,
                false
            );

        }

    }
);


/* =========================================================
   Initial State
========================================================= */

if (!bookingForm) {

    console.error(
        "Booking form was not found."
    );

} else {

    loadProviders();

                       }
