/* =========================================================
   MindCare Admin
   Firebase Firestore + Authentication
   Prepared By Eng Ahmad Ramadan
========================================================= */

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    getFirestore,
    collection,
    doc,
    addDoc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    where,
    onSnapshot,
    serverTimestamp,
    writeBatch
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


/* =========================================================
   FIREBASE
========================================================= */

const firebaseConfig = window.MINDCARE_FIREBASE_CONFIG;

if (!firebaseConfig) {
    throw new Error(
        "Firebase configuration not found. Check firebase-config.js"
    );
}

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);


/* =========================================================
   ADMIN UID
========================================================= */

const ADMIN_UID =
    "70WNrO5zubWwSxegfpSPRkCIfhw1";


/* =========================================================
   STATE
========================================================= */

let unsubscribeBookings = null;
let unsubscribeSlots = null;
let unsubscribeTopics = null;
let unsubscribeProviders = null;

let providersCache = [];
let topicsCache = [];
let bookingsCache = [];
let slotsCache = [];

let firstBookingSnapshot = true;


/* =========================================================
   DOM HELPERS
========================================================= */

const $ = id =>
    document.getElementById(id);


function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function showMessage(id, message, type = "note") {

    const element = $(id);

    if (!element) return;

    element.textContent = message;

    element.className =
        type === "error"
            ? "err"
            : type === "success"
                ? "success"
                : "note";
}


function requireAdmin() {

    const user = auth.currentUser;

    if (!user) {
        throw new Error("NOT_AUTHENTICATED");
    }

    if (user.uid !== ADMIN_UID) {
        throw new Error("NOT_ADMIN");
    }

    return user;
}


/* =========================================================
   AUTHENTICATION
========================================================= */

const loginForm =
    $("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            const email =
                $("email")?.value.trim();

            const password =
                $("pass")?.value;


            const errorElement =
                $("loginErr");


            if (!email || !password) {

                if (errorElement) {
                    errorElement.textContent =
                        "أدخل البريد الإلكتروني وكلمة المرور.";
                }

                return;
            }


            try {

                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

            } catch (error) {

                console.error(
                    "Login error:",
                    error
                );

                if (errorElement) {

                    errorElement.textContent =
                        "بيانات الدخول غير صحيحة أو حدث خطأ.";
                }
            }
        }
    );
}


/* =========================================================
   AUTH STATE
========================================================= */

onAuthStateChanged(
    auth,
    user => {

        if (!user) {

            showLogin();

            return;
        }


        if (user.uid !== ADMIN_UID) {

            signOut(auth);

            alert(
                "هذا الحساب ليس حساب الإدارة."
            );

            return;
        }


        showAdmin();

        startRealtimeListeners();

        window.dispatchEvent(
            new CustomEvent(
                "mindcare-admin-ready"
            )
        );
    }
);


/* =========================================================
   LOGIN / APP DISPLAY
========================================================= */

function showLogin() {

    const login =
        $("login");

    const app =
        $("app");

    if (login) {
        login.hidden = false;
    }

    if (app) {
        app.hidden = true;
    }
}


function showAdmin() {

    const login =
        $("login");

    const app =
        $("app");

    if (login) {
        login.hidden = true;
    }

    if (app) {
        app.hidden = false;
    }
}


/* =========================================================
   LOGOUT
========================================================= */

$("logout")?.addEventListener(
    "click",
    async () => {

        try {

            await signOut(auth);

        } catch (error) {

            console.error(
                "Logout error:",
                error
            );
        }
    }
);


/* =========================================================
   REALTIME LISTENERS
========================================================= */

function startRealtimeListeners() {

    listenBookings();

    listenSlots();

    listenTopics();

    listenProviders();
}


/* =========================================================
   BOOKINGS
========================================================= */

function listenBookings() {

    if (unsubscribeBookings) {
        unsubscribeBookings();
    }


    const bookingsQuery =
        query(
            collection(db, "bookings"),
            orderBy(
                "createdAt",
                "desc"
            )
        );


    unsubscribeBookings =
        onSnapshot(
            bookingsQuery,
            snapshot => {

                bookingsCache =
                    snapshot.docs.map(
                        item => ({
                            id: item.id,
                            ...item.data()
                        })
                    );


                renderBookings();

                updateBookingStats();


                if (!firstBookingSnapshot) {

                    snapshot.docChanges()
                        .forEach(change => {

                            if (
                                change.type ===
                                "added"
                            ) {

                                notifyNewBooking({
                                    id:
                                        change.doc.id,
                                    ...change.doc.data()
                                });
                            }
                        });
                }


                firstBookingSnapshot = false;
            },

            error => {

                console.error(
                    "Bookings listener error:",
                    error
                );
            }
        );
}


function renderBookings() {

    const tbody =
        $("bookRows");

    if (!tbody) return;


    if (!bookingsCache.length) {

        tbody.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    class="empty">
                    لا توجد حجوزات حاليًا.
                </td>
            </tr>
        `;

        return;
    }


    tbody.innerHTML =
        bookingsCache.map(
            booking => {

                const status =
                    booking.status ||
                    "pending";


                return `
                    <tr>

                        <td>
                            <strong>
                                ${escapeHTML(
                                    booking.id
                                )}
                            </strong>

                            <br>

                            <small>
                                ${formatDateTime(
                                    booking.createdAt
                                )}
                            </small>
                        </td>

                        <td>
                            ${escapeHTML(
                                booking.name
                            )}
                        </td>

                        <td dir="ltr">
                            ${escapeHTML(
                                booking.phone
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                booking.provider ||
                                "—"
                            )}
                        </td>

                        <td dir="ltr">
                            ${escapeHTML(
                                booking.date ||
                                "—"
                            )}

                            <br>

                            ${escapeHTML(
                                booking.time ||
                                "—"
                            )}
                        </td>

                        <td>

                            <span class="badge ${getStatusClass(
                                status
                            )}">

                                ${getStatusLabel(
                                    status
                                )}

                            </span>

                        </td>

                        <td>

                            <div class="acts">

                                ${
                                    status !==
                                    "confirmed"
                                        ? `
                                            <button
                                                class="btn btn-soft mini"
                                                data-action="confirm-booking"
                                                data-id="${escapeHTML(
                                                    booking.id
                                                )}">
                                                تأكيد
                                            </button>
                                        `
                                        : ""
                                }


                                ${
                                    status !==
                                    "cancelled"
                                        ? `
                                            <button
                                                class="btn btn-outline mini"
                                                data-action="cancel-booking"
                                                data-id="${escapeHTML(
                                                    booking.id
                                                )}">
                                                إلغاء
                                            </button>
                                        `
                                        : ""
                                }


                                <button
                                    class="btn btn-soft mini"
                                    data-action="whatsapp"
                                    data-id="${escapeHTML(
                                        booking.id
                                    )}">
                                    WhatsApp
                                </button>


                                <button
                                    class="btn btn-outline mini"
                                    data-action="delete-booking"
                                    data-id="${escapeHTML(
                                        booking.id
                                    )}">
                                    حذف
                                </button>

                            </div>

                        </td>

                    </tr>
                `;
            }
        ).join("");
}


function updateBookingStats() {

    const total =
        $("bookingCount");

    const pending =
        $("pendingCount");


    if (total) {
        total.textContent =
            bookingsCache.length;
    }


    if (pending) {

        pending.textContent =
            bookingsCache.filter(
                booking =>
                    (
                        booking.status ||
                        "pending"
                    ) === "pending"
            ).length;
    }
}


/* =========================================================
   BOOKING ACTIONS
========================================================= */

async function changeBookingStatus(
    bookingId,
    status
) {

    requireAdmin();


    const bookingRef =
        doc(
            db,
            "bookings",
            bookingId
        );


    const bookingSnapshot =
        await getDoc(
            bookingRef
        );


    if (!bookingSnapshot.exists()) {
        throw new Error(
            "الحجز غير موجود."
        );
    }


    const booking =
        bookingSnapshot.data();


    await updateDoc(
        bookingRef,
        {
            status,
            updatedAt:
                serverTimestamp()
        }
    );


    /*
     * When cancelling a booking,
     * reopen the slot.
     */

    if (
        status === "cancelled" &&
        booking.slotId
    ) {

        const slotRef =
            doc(
                db,
                "slots",
                booking.slotId
            );


        const slotSnapshot =
            await getDoc(slotRef);


        if (
            slotSnapshot.exists()
        ) {

            await updateDoc(
                slotRef,
                {
                    booked: false,
                    bookingId: null,
                    updatedAt:
                        serverTimestamp()
                }
            );
        }
    }
}


async function removeBooking(
    bookingId
) {

    requireAdmin();


    const bookingRef =
        doc(
            db,
            "bookings",
            bookingId
        );


    const bookingSnapshot =
        await getDoc(
            bookingRef
        );


    if (!bookingSnapshot.exists()) {
        return;
    }


    const booking =
        bookingSnapshot.data();


    const batch =
        writeBatch(db);


    batch.delete(
        bookingRef
    );


    if (booking.slotId) {

        const slotRef =
            doc(
                db,
                "slots",
                booking.slotId
            );


        const slotSnapshot =
            await getDoc(slotRef);


        if (
            slotSnapshot.exists()
        ) {

            batch.update(
                slotRef,
                {
                    booked: false,
                    bookingId: null,
                    updatedAt:
                        serverTimestamp()
                }
            );
        }
    }


    await batch.commit();
}


/* =========================================================
   BOOKING BUTTONS
========================================================= */

document.addEventListener(
    "click",
    async event => {

        const button =
            event.target.closest(
                "[data-action]"
            );


        if (!button) return;


        const action =
            button.dataset.action;

        const id =
            button.dataset.id;


        try {

            if (
                action ===
                "confirm-booking"
            ) {

                await changeBookingStatus(
                    id,
                    "confirmed"
                );

                return;
            }


            if (
                action ===
                "cancel-booking"
            ) {

                if (
                    !confirm(
                        "هل تريد إلغاء هذا الحجز؟"
                    )
                ) return;


                await changeBookingStatus(
                    id,
                    "cancelled"
                );

                return;
            }


            if (
                action ===
                "delete-booking"
            ) {

                if (
                    !confirm(
                        "هل تريد حذف الحجز نهائيًا؟"
                    )
                ) return;


                await removeBooking(
                    id
                );

                return;
            }


            if (
                action ===
                "whatsapp"
            ) {

                const booking =
                    bookingsCache.find(
                        item =>
                            item.id === id
                    );


                if (!booking) return;


                openWhatsApp(
                    booking
                );
            }

        } catch (error) {

            console.error(
                "Booking action:",
                error
            );

            alert(
                "حدث خطأ أثناء تنفيذ العملية."
            );
        }
    }
);


/* =========================================================
   WHATSAPP
========================================================= */

function openWhatsApp(
    booking
) {

    let phone =
        String(
            booking.phone || ""
        )
        .replace(
            /[^\d+]/g,
            ""
        );


    if (
        phone.startsWith("+")
    ) {

        phone =
            phone.substring(1);
    }


    if (
        phone.startsWith("00")
    ) {

        phone =
            phone.substring(2);
    }


    if (
        phone.startsWith("01") &&
        phone.length === 11
    ) {

        phone =
            "20" +
            phone.substring(1);
    }


    if (!phone) {

        alert(
            "رقم العميل غير صالح."
        );

        return;
    }


    const message =
`مرحبًا،
معك MindCare.

بخصوص طلب الحجز:

رقم الحجز: ${booking.id}
الاسم: ${booking.name || "—"}
المختص: ${booking.provider || "—"}
التاريخ: ${booking.date || "—"}
الوقت: ${booking.time || "—"}

نتواصل معك بخصوص موعدك.`;


    const url =
        `https://wa.me/${phone}?text=${encodeURIComponent(
            message
        )}`;


    window.open(
        url,
        "_blank",
        "noopener,noreferrer"
    );
}


/* =========================================================
   SLOTS
========================================================= */

function listenSlots() {

    if (unsubscribeSlots) {
        unsubscribeSlots();
    }


    unsubscribeSlots =
        onSnapshot(
            collection(db, "slots"),
            snapshot => {

                slotsCache =
                    snapshot.docs.map(
                        item => ({
                            id: item.id,
                            ...item.data()
                        })
                    );


                slotsCache.sort(
                    (a, b) => {

                        const first =
                            `${a.date || ""} ${a.time || ""}`;

                        const second =
                            `${b.date || ""} ${b.time || ""}`;

                        return first.localeCompare(
                            second
                        );
                    }
                );


                renderSlots();

                updateSlotStats();
            },

            error => {

                console.error(
                    "Slots listener:",
                    error
                );
            }
        );
}


function renderSlots() {

    const tbody =
        $("slotRows");

    if (!tbody) return;


    if (!slotsCache.length) {

        tbody.innerHTML = `
            <tr>
                <td
                    colspan="5"
                    class="empty">
                    لا توجد مواعيد.
                </td>
            </tr>
        `;

        return;
    }


    tbody.innerHTML =
        slotsCache.map(
            slot => {

                const booked =
                    Boolean(
                        slot.booked
                    );


                return `
                    <tr>

                        <td>
                            ${escapeHTML(
                                slot.provider ||
                                "—"
                            )}
                        </td>

                        <td dir="ltr">
                            ${escapeHTML(
                                slot.date ||
                                "—"
                            )}
                        </td>

                        <td dir="ltr">
                            ${escapeHTML(
                                slot.time ||
                                "—"
                            )}
                        </td>

                        <td>

                            <span class="badge">

                                ${
                                    booked
                                        ? "محجوز"
                                        : "متاح"
                                }

                            </span>

                        </td>

                        <td>

                            <button
                                class="btn btn-outline mini"
                                data-action="delete-slot"
                                data-id="${escapeHTML(
                                    slot.id
                                )}">

                                حذف

                            </button>

                        </td>

                    </tr>
                `;
            }
        ).join("");
}


function updateSlotStats() {

    const counter =
        $("slotCount");

    if (!counter) return;


    counter.textContent =
        slotsCache.filter(
            slot =>
                !slot.booked &&
                slot.date >=
                    getTodayString()
        ).length;
}


/* =========================================================
   ADD SLOTS
========================================================= */

$("slotForm")?.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        try {

            requireAdmin();


            const providerSelect =
                $("sProv");

            const date =
                $("sDate")?.value;

            const timesValue =
                $("sTimes")?.value;


            const providerId =
                providerSelect?.value;


            const providerOption =
                providerSelect
                    ?.selectedOptions?.[0];


            const providerName =
                providerOption
                    ?.dataset?.name ||
                providerOption
                    ?.textContent
                    ?.trim() ||
                "";


            if (!providerId) {

                showMessage(
                    "slotMsg",
                    "اختر المختص.",
                    "error"
                );

                return;
            }


            if (!date) {

                showMessage(
                    "slotMsg",
                    "اختر التاريخ.",
                    "error"
                );

                return;
            }


            const times =
                String(
                    timesValue || ""
                )
                .split(",")
                .map(
                    item =>
                        item.trim()
                )
                .filter(Boolean);


            if (!times.length) {

                showMessage(
                    "slotMsg",
                    "أدخل موعدًا واحدًا على الأقل.",
                    "error"
                );

                return;
            }


            let added = 0;


            for (
                const time of times
            ) {

                const duplicate =
                    slotsCache.some(
                        slot =>
                            slot.providerId ===
                                providerId &&
                            slot.date ===
                                date &&
                            slot.time ===
                                time
                    );


                if (duplicate) {
                    continue;
                }


                await addDoc(
                    collection(
                        db,
                        "slots"
                    ),
                    {
                        providerId,
                        provider:
                            providerName,
                        date,
                        time,
                        booked: false,
                        bookingId: null,
                        createdAt:
                            serverTimestamp()
                    }
                );


                added++;
            }


            showMessage(
                "slotMsg",
                `تمت إضافة ${added} موعد بنجاح.`,
                "success"
            );


            event.target.reset();

        } catch (error) {

            console.error(
                "Add slot error:",
                error
            );

            showMessage(
                "slotMsg",
                "حدث خطأ أثناء إضافة الموعد.",
                "error"
            );
        }
    }
);


/* =========================================================
   DELETE SLOT
========================================================= */

async function deleteSlot(
    slotId
) {

    requireAdmin();


    const slot =
        slotsCache.find(
            item =>
                item.id === slotId
        );


    if (!slot) return;


    if (slot.booked) {

        alert(
            "لا يمكن حذف موعد محجوز. قم بإلغاء الحجز أولًا."
        );

        return;
    }


    await deleteDoc(
        doc(
            db,
            "slots",
            slotId
        )
    );
}


/* =========================================================
   TOPICS / SECTIONS
========================================================= */

function listenTopics() {

    if (unsubscribeTopics) {
        unsubscribeTopics();
    }


    unsubscribeTopics =
        onSnapshot(
            collection(
                db,
                "topics"
            ),
            snapshot => {

                topicsCache =
                    snapshot.docs.map(
                        item => ({
                            id: item.id,
                            ...item.data()
                        })
                    );


                topicsCache.sort(
                    sortByCreatedAt
                );


                renderTopics();


                const count =
                    $("topicCount");

                if (count) {
                    count.textContent =
                        topicsCache.length;
                }
            },

            error => {

                console.error(
                    "Topics listener:",
                    error
                );
            }
        );
}


function renderTopics() {

    const container =
        $("topicsList");

    if (!container) return;


    if (!topicsCache.length) {

        container.innerHTML = `
            <p class="empty">
                لا توجد أقسام حاليًا.
            </p>
        `;

        return;
    }


    container.innerHTML =
        topicsCache.map(
            topic => {

                const active =
                    topic.active !== false;


                return `
                    <div
                        class="card"
                        style="
                            padding:16px;
                            margin-bottom:12px;
                        ">

                        <div class="top">

                            <div>

                                <strong>
                                    ${escapeHTML(
                                        topic.titleAr ||
                                        "بدون اسم"
                                    )}
                                </strong>

                                <br>

                                <small dir="ltr">
                                    ${escapeHTML(
                                        topic.titleEn ||
                                        ""
                                    )}
                                </small>

                            </div>


                            <span
                                class="badge">

                                ${
                                    active
                                        ? "فعال"
                                        : "مخفي"
                                }

                            </span>

                        </div>


                        <p class="note">

                            ${escapeHTML(
                                topic.descriptionAr ||
                                topic.intro ||
                                ""
                            )}

                        </p>


                        <div class="acts">

                            <button
                                class="btn btn-soft mini"
                                data-action="toggle-topic"
                                data-id="${escapeHTML(
                                    topic.id
                                )}"
                                data-active="${active}">

                                ${
                                    active
                                        ? "إخفاء"
                                        : "تفعيل"
                                }

                            </button>


                            <button
                                class="btn btn-outline mini"
                                data-action="delete-topic"
                                data-id="${escapeHTML(
                                    topic.id
                                )}">

                                حذف

                            </button>

                        </div>

                    </div>
                `;
            }
        ).join("");
}


/* =========================================================
   ADD TOPIC
========================================================= */

$("topicForm")?.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        try {

            requireAdmin();


            const key =
                $("tKey")
                    ?.value
                    .trim()
                    .toLowerCase()
                    .replace(
                        /\s+/g,
                        "-"
                    );


            const titleAr =
                $("tTitle")
                    ?.value
                    .trim();


            const descriptionAr =
                $("tIntro")
                    ?.value
                    .trim();


            const symptomsValue =
                $("tSymptoms")
                    ?.value
                    .trim();


            const titleEn =
                $("tTitleEn")
                    ?.value
                    .trim() ||
                titleAr;


            const descriptionEn =
                $("tIntroEn")
                    ?.value
                    .trim() ||
                descriptionAr;


            if (
                !key ||
                !titleAr
            ) {

                showMessage(
                    "topicMsg",
                    "أدخل اسم ومعرّف القسم.",
                    "error"
                );

                return;
            }


            const symptoms =
                symptomsValue
                    ? symptomsValue
                        .split(",")
                        .map(
                            item =>
                                item.trim()
                        )
                        .filter(Boolean)
                    : [];


            /*
             * Use key as document ID.
             */

            const topicRef =
                doc(
                    db,
                    "topics",
                    key
                );


            const existing =
                await getDoc(
                    topicRef
                );


            const data = {

                key,

                titleAr,

                titleEn,

                descriptionAr,

                descriptionEn,

                intro:
                    descriptionAr,

                symptoms,

                active:
                    existing.exists()
                        ? existing
                            .data()
                            .active !== false
                        : true,

                updatedAt:
                    serverTimestamp()
            };


            if (existing.exists()) {

                await updateDoc(
                    topicRef,
                    data
                );

            } else {

                await setDoc(
                    topicRef,
                    {
                        ...data,
                        createdAt:
                            serverTimestamp()
                    }
                );
            }


            showMessage(
                "topicMsg",
                "تم حفظ القسم بنجاح.",
                "success"
            );


            event.target.reset();

        } catch (error) {

            console.error(
                "Topic error:",
                error
            );

            showMessage(
                "topicMsg",
                "حدث خطأ أثناء حفظ القسم.",
                "error"
            );
        }
    }
);


/* =========================================================
   PROVIDERS / SPECIALISTS
========================================================= */

function listenProviders() {

    if (unsubscribeProviders) {
        unsubscribeProviders();
    }


    unsubscribeProviders =
        onSnapshot(
            collection(
                db,
                "providers"
            ),
            snapshot => {

                providersCache =
                    snapshot.docs.map(
                        item => ({
                            id: item.id,
                            ...item.data()
                        })
                    );


                providersCache.sort(
                    sortByCreatedAt
                );


                renderProviders();

                fillProviderSelect();
            },

            error => {

                console.error(
                    "Providers listener:",
                    error
                );
            }
        );
}


function renderProviders() {

    const container =
        $("providersList");

    if (!container) return;


    if (!providersCache.length) {

        container.innerHTML = `
            <p class="empty">
                لا يوجد مختصون حاليًا.
            </p>
        `;

        return;
    }


    container.innerHTML =
        providersCache.map(
            provider => {

                const active =
                    provider.active !== false;


                return `
                    <div
                        class="card"
                        style="
                            padding:16px;
                            margin-bottom:12px;
                        ">

                        <div class="top">

                            <div>

                                <strong>
                                    ${escapeHTML(
                                        provider.nameAr ||
                                        "بدون اسم"
                                    )}
                                </strong>

                                <br>

                                <small dir="ltr">
                                    ${escapeHTML(
                                        provider.nameEn ||
                                        ""
                                    )}
                                </small>

                                <br>

                                <small>
                                    ${escapeHTML(
                                        provider.specialtyAr ||
                                        ""
                                    )}
                                </small>

                            </div>


                            <span class="badge">

                                ${
                                    active
                                        ? "فعال"
                                        : "مخفي"
                                }

                            </span>

                        </div>


                        <p class="note">

                            ${escapeHTML(
                                provider.bioAr ||
                                ""
                            )}

                        </p>


                        <div class="acts">

                            <button
                                class="btn btn-soft mini"
                                data-action="toggle-provider"
                                data-id="${escapeHTML(
                                    provider.id
                                )}"
                                data-active="${active}">

                                ${
                                    active
                                        ? "إخفاء"
                                        : "تفعيل"
                                }

                            </button>


                            <button
                                class="btn btn-outline mini"
                                data-action="delete-provider"
                                data-id="${escapeHTML(
                                    provider.id
                                )}">

                                حذف

                            </button>

                        </div>

                    </div>
                `;
            }
        ).join("");
}


function fillProviderSelect() {

    const select =
        $("sProv");

    if (!select) return;


    const activeProviders =
        providersCache.filter(
            provider =>
                provider.active !== false
        );


    if (!activeProviders.length) {

        select.innerHTML = `
            <option value="">
                لا يوجد مختصون فعالون
            </option>
        `;

        return;
    }


    select.innerHTML =
        activeProviders.map(
            provider => {

                const name =
                    provider.nameAr ||
                    provider.nameEn ||
                    "مختص";


                return `
                    <option
                        value="${escapeHTML(
                            provider.id
                        )}"
                        data-name="${escapeHTML(
                            name
                        )}">

                        ${escapeHTML(
                            name
                        )}

                    </option>
                `;
            }
        ).join("");
}


/* =========================================================
   ADD PROVIDER
========================================================= */

$("providerForm")?.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        try {

            requireAdmin();


            const nameAr =
                $("providerName")
                    ?.value
                    .trim();


            const nameEn =
                $("providerNameEn")
                    ?.value
                    .trim() ||
                nameAr;


            const specialtyAr =
                $("providerSpecialtyAr")
                    ?.value
                    .trim() ||
                "";


            const specialtyEn =
                $("providerSpecialtyEn")
                    ?.value
                    .trim() ||
                specialtyAr;


            const bioAr =
                $("providerBioAr")
                    ?.value
                    .trim() ||
                "";


            const bioEn =
                $("providerBioEn")
                    ?.value
                    .trim() ||
                bioAr;


            if (!nameAr) {

                showMessage(
                    "providerMsg",
                    "اكتب اسم المختص.",
                    "error"
                );

                return;
            }


            await addDoc(
                collection(
                    db,
                    "providers"
                ),
                {

                    nameAr,

                    nameEn,

                    specialtyAr,

                    specialtyEn,

                    bioAr,

                    bioEn,

                    active: true,

                    createdAt:
                        serverTimestamp(),

                    updatedAt:
                        serverTimestamp()
                }
            );


            showMessage(
                "providerMsg",
                "تمت إضافة المختص بنجاح.",
                "success"
            );


            event.target.reset();

        } catch (error) {

            console.error(
                "Provider error:",
                error
            );

            showMessage(
                "providerMsg",
                "حدث خطأ أثناء إضافة المختص.",
                "error"
            );
        }
    }
);


/* =========================================================
   TOPIC / PROVIDER ACTIONS
========================================================= */

async function toggleTopic(
    id,
    current
) {

    requireAdmin();


    await updateDoc(
        doc(
            db,
            "topics",
            id
        ),
        {
            active: !current,
            updatedAt:
                serverTimestamp()
        }
    );
}


async function deleteTopic(
    id
) {

    requireAdmin();


    if (
        !confirm(
            "هل تريد حذف هذا القسم نهائيًا؟"
        )
    ) return;


    await deleteDoc(
        doc(
            db,
            "topics",
            id
        )
    );
}


async function toggleProvider(
    id,
    current
) {

    requireAdmin();


    await updateDoc(
        doc(
            db,
            "providers",
            id
        ),
        {
            active: !current,
            updatedAt:
                serverTimestamp()
        }
    );
}


async function deleteProvider(
    id
) {

    requireAdmin();


    /*
     * We recommend disabling a provider
     * instead of deleting them if they
     * already have historical bookings.
     */

    const hasRelatedBooking =
        bookingsCache.some(
            booking =>
                booking.providerId === id
        );


    if (hasRelatedBooking) {

        alert(
            "هذا المختص مرتبط بحجوزات سابقة. استخدم إخفاء بدل الحذف."
        );

        return;
    }


    if (
        !confirm(
            "هل تريد حذف هذا المختص نهائيًا؟"
        )
    ) return;


    await deleteDoc(
        doc(
            db,
            "providers",
            id
        )
    );
}


/* =========================================================
   GLOBAL ACTION HANDLER
========================================================= */

document.addEventListener(
    "click",
    async event => {

        const button =
            event.target.closest(
                "[data-action]"
            );


        if (!button) return;


        const action =
            button.dataset.action;

        const id =
            button.dataset.id;


        try {

            switch (action) {

                case "delete-slot":

                    if (
                        confirm(
                            "هل تريد حذف هذا الموعد؟"
                        )
                    ) {

                        await deleteSlot(id);
                    }

                    break;


                case "toggle-topic":

                    await toggleTopic(
                        id,
                        button.dataset.active ===
                            "true"
                    );

                    break;


                case "delete-topic":

                    await deleteTopic(id);

                    break;


                case "toggle-provider":

                    await toggleProvider(
                        id,
                        button.dataset.active ===
                            "true"
                    );

                    break;


                case "delete-provider":

                    await deleteProvider(id);

                    break;
            }

        } catch (error) {

            console.error(
                "Admin action error:",
                error
            );

            alert(
                "حدث خطأ أثناء تنفيذ العملية."
            );
        }
    }
);


/* =========================================================
   BROWSER NOTIFICATIONS
========================================================= */

const notificationButton =
    $("enableNotifications");


notificationButton?.addEventListener(
    "click",
    async () => {

        if (
            !("Notification" in window)
        ) {

            alert(
                "المتصفح لا يدعم إشعارات النظام."
            );

            return;
        }


        const permission =
            await Notification.requestPermission();


        if (
            permission ===
            "granted"
        ) {

            alert(
                "تم تفعيل إشعارات الحجوزات."
            );

        } else {

            alert(
                "لم يتم السماح بالإشعارات."
            );
        }
    }
);


function notifyNewBooking(
    booking
) {

    const title =
        "🔔 حجز جديد في MindCare";


    const body =
        `${booking.name || "عميل"} - ` +
        `${booking.provider || "مختص"} - ` +
        `${booking.date || ""} ` +
        `${booking.time || ""}`;


    const counter =
        $("notificationBadge");


    if (counter) {

        const current =
            Number(
                counter.textContent || 0
            );

        counter.textContent =
            current + 1;

        counter.hidden = false;
    }


    if (
        "Notification" in window &&
        Notification.permission ===
            "granted"
    ) {

        try {

            new Notification(
                title,
                {
                    body,
                    tag:
                        `mindcare-${booking.id}`
                }
            );

        } catch (error) {

            console.warn(
                "Notification error:",
                error
            );
        }
    }
}


/* =========================================================
   TABS
========================================================= */

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "[data-tab]"
            );


        if (!button) return;


        const tab =
            button.dataset.tab;


        const tabs = [
            "bookings",
            "slots",
            "topics",
            "providers"
        ];


        tabs.forEach(
            name => {

                const section =
                    $(`p-${name}`);


                if (section) {

                    section.hidden =
                        name !== tab;
                }
            }
        );


        document
            .querySelectorAll(
                "[data-tab]"
            )
            .forEach(
                item => {

                    item.classList.remove(
                        "btn-primary"
                    );

                    item.classList.add(
                        "btn-soft"
                    );
                }
            );


        button.classList.remove(
            "btn-soft"
        );

        button.classList.add(
            "btn-primary"
        );
    }
);


/* =========================================================
   UTILITIES
========================================================= */

function formatDateTime(
    timestamp
) {

    if (!timestamp) {
        return "—";
    }


    try {

        return timestamp
            .toDate()
            .toLocaleString(
                "ar-EG",
                {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );

    } catch {

        return "—";
    }
}


function sortByCreatedAt(
    a,
    b
) {

    const first =
        a.createdAt?.seconds ||
        0;

    const second =
        b.createdAt?.seconds ||
        0;

    return second - first;
}


function getStatusLabel(
    status
) {

    const labels = {

        pending:
            "قيد الانتظار",

        confirmed:
            "مؤكد",

        cancelled:
            "ملغي"
    };


    return (
        labels[status] ||
        status ||
        "غير محدد"
    );
}


function getStatusClass(
    status
) {

    if (
        status ===
        "confirmed"
    ) {

        return "confirmed";
    }


    if (
        status ===
        "cancelled"
    ) {

        return "cancelled";
    }


    return "pending";
}


function getTodayString() {

    const now =
        new Date();


    const year =
        now.getFullYear();


    const month =
        String(
            now.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            now.getDate()
        ).padStart(
            2,
            "0"
        );


    return `${year}-${month}-${day}`;
}


/* =========================================================
   INITIAL
========================================================= */

console.log(
    "MindCare Admin Firebase loaded."
);
