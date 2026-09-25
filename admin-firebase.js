/* =========================================================
   MindCare Admin - Firebase Firestore
   Prepared By Eng Ahmad Ramadan

   Responsibilities:
   - Bookings
   - Slots
   - Topics / Sections
   - Providers / Specialists
   - Realtime booking updates
   - Browser notifications
========================================================= */

import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    where,
    onSnapshot,
    serverTimestamp,
    writeBatch
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const {
    db,
    auth
} = window.MC_FIREBASE;

const ADMIN_UID = "70WNrO5zubWwSxegfpSPRkCIfhw1";

let bookingsUnsubscribe = null;
let slotsUnsubscribe = null;
let topicsUnsubscribe = null;
let providersUnsubscribe = null;

let firstBookingSnapshot = true;


/* =========================================================
   HELPERS
========================================================= */

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function getCurrentUser() {
    const user = auth.currentUser;

    if (!user || user.uid !== ADMIN_UID) {
        throw new Error("UNAUTHORIZED");
    }

    return user;
}


function showMessage(elementId, message, type = "note") {
    const el = document.getElementById(elementId);

    if (!el) return;

    el.textContent = message;

    el.className = type === "error"
        ? "err"
        : type === "success"
            ? "success"
            : "note";
}


function formatTimestamp(timestamp) {
    if (!timestamp) return "—";

    try {
        const date = timestamp.toDate();

        return date.toLocaleString("ar-EG", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        });
    } catch {
        return "—";
    }
}


function statusLabel(status) {
    const labels = {
        pending: "قيد الانتظار",
        confirmed: "مؤكد",
        cancelled: "ملغي"
    };

    return labels[status] || status || "غير محدد";
}


function statusClass(status) {
    if (status === "confirmed") return "confirmed";
    if (status === "cancelled") return "cancelled";
    return "pending";
}


function normalizePhone(phone) {
    let value = String(phone || "").replace(/[^\d+]/g, "");

    if (value.startsWith("+")) {
        value = value.substring(1);
    }

    if (value.startsWith("00")) {
        value = value.substring(2);
    }

    if (value.startsWith("01") && value.length === 11) {
        value = "20" + value.substring(1);
    }

    return value;
}


function openWhatsApp(phone, booking) {
    const number = normalizePhone(phone);

    if (!number) {
        alert("رقم هاتف العميل غير صالح.");
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

نحن نتواصل معك بخصوص موعدك.`;

    const url =
        `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

    window.open(
        url,
        "_blank",
        "noopener,noreferrer"
    );
}


/* =========================================================
   REALTIME BOOKINGS
========================================================= */

function listenToBookings() {

    if (bookingsUnsubscribe) {
        bookingsUnsubscribe();
    }

    const bookingsQuery = query(
        collection(db, "bookings"),
        orderBy("createdAt", "desc")
    );

    bookingsUnsubscribe = onSnapshot(
        bookingsQuery,
        snapshot => {

            const bookings = snapshot.docs.map(item => ({
                id: item.id,
                ...item.data()
            }));

            renderBookings(bookings);
            updateStatsFromBookings(bookings);

            if (!firstBookingSnapshot) {

                snapshot.docChanges().forEach(change => {

                    if (change.type === "added") {

                        const booking = {
                            id: change.doc.id,
                            ...change.doc.data()
                        };

                        showBookingNotification(booking);
                    }
                });
            }

            firstBookingSnapshot = false;
        },

        error => {
            console.error("Bookings listener:", error);
        }
    );
}


function renderBookings(bookings) {

    const container =
        document.getElementById("bookRows");

    if (!container) return;

    if (!bookings.length) {

        container.innerHTML = `
            <tr>
                <td colspan="7" class="empty">
                    لا توجد حجوزات حاليًا.
                </td>
            </tr>
        `;

        return;
    }

    container.innerHTML = bookings.map(booking => {

        const status = booking.status || "pending";

        return `
            <tr>

                <td>
                    <strong>${escapeHTML(booking.id)}</strong>
                    <br>
                    <small>
                        ${escapeHTML(
                            formatTimestamp(booking.createdAt)
                        )}
                    </small>
                </td>

                <td>
                    ${escapeHTML(booking.name)}
                </td>

                <td dir="ltr">
                    ${escapeHTML(booking.phone)}
                </td>

                <td>
                    ${escapeHTML(booking.provider)}
                </td>

                <td dir="ltr">
                    ${escapeHTML(booking.date || "—")}
                    <br>
                    ${escapeHTML(booking.time || "—")}
                </td>

                <td>
                    <span class="badge ${statusClass(status)}">
                        ${statusLabel(status)}
                    </span>
                </td>

                <td>

                    <div class="acts">

                        ${
                            status !== "confirmed"
                            ? `
                                <button
                                    class="btn btn-soft mini"
                                    data-booking-action="confirm"
                                    data-id="${escapeHTML(booking.id)}">
                                    تأكيد
                                </button>
                            `
                            : ""
                        }

                        ${
                            status !== "cancelled"
                            ? `
                                <button
                                    class="btn btn-outline mini"
                                    data-booking-action="cancel"
                                    data-id="${escapeHTML(booking.id)}">
                                    إلغاء
                                </button>
                            `
                            : ""
                        }

                        <button
                            class="btn btn-soft mini"
                            data-booking-action="whatsapp"
                            data-id="${escapeHTML(booking.id)}">
                            WhatsApp
                        </button>

                        <button
                            class="btn btn-outline mini"
                            data-booking-action="delete"
                            data-id="${escapeHTML(booking.id)}">
                            حذف
                        </button>

                    </div>

                </td>

            </tr>
        `;
    }).join("");
}


function updateStatsFromBookings(bookings) {

    const bookingCount =
        document.getElementById("bookingCount");

    const pendingCount =
        document.getElementById("pendingCount");

    if (bookingCount) {
        bookingCount.textContent = bookings.length;
    }

    if (pendingCount) {
        pendingCount.textContent =
            bookings.filter(
                item => (item.status || "pending") === "pending"
            ).length;
    }
}


/* =========================================================
   BOOKING ACTIONS
========================================================= */

async function updateBookingStatus(id, status) {

    getCurrentUser();

    const bookingRef =
        doc(db, "bookings", id);

    const bookingSnap =
        await getDoc(bookingRef);

    if (!bookingSnap.exists()) {
        throw new Error("الحجز غير موجود.");
    }

    const booking =
        bookingSnap.data();

    await updateDoc(
        bookingRef,
        {
            status,
            updatedAt: serverTimestamp()
        }
    );

    /*
     * When admin cancels a booking,
     * reopen the related slot.
     */

    if (
        status === "cancelled" &&
        booking.slotId
    ) {

        const slotRef =
            doc(db, "slots", booking.slotId);

        const slotSnap =
            await getDoc(slotRef);

        if (slotSnap.exists()) {

            await updateDoc(
                slotRef,
                {
                    booked: false,
                    bookingId: null,
                    updatedAt: serverTimestamp()
                }
            );
        }
    }
}


async function deleteBooking(id) {

    getCurrentUser();

    const bookingRef =
        doc(db, "bookings", id);

    const bookingSnap =
        await getDoc(bookingRef);

    if (!bookingSnap.exists()) return;

    const booking =
        bookingSnap.data();

    const batch =
        writeBatch(db);

    batch.delete(bookingRef);

    if (booking.slotId) {

        const slotRef =
            doc(db, "slots", booking.slotId);

        const slotSnap =
            await getDoc(slotRef);

        if (slotSnap.exists()) {

            batch.update(
                slotRef,
                {
                    booked: false,
                    bookingId: null,
                    updatedAt: serverTimestamp()
                }
            );
        }
    }

    await batch.commit();
}


document.addEventListener(
    "click",
    async event => {

        const button =
            event.target.closest(
                "[data-booking-action]"
            );

        if (!button) return;

        const action =
            button.dataset.bookingAction;

        const id =
            button.dataset.id;

        try {

            if (action === "confirm") {

                await updateBookingStatus(
                    id,
                    "confirmed"
                );
            }


            if (action === "cancel") {

                if (
                    !confirm(
                        "هل تريد إلغاء هذا الحجز؟"
                    )
                ) return;

                await updateBookingStatus(
                    id,
                    "cancelled"
                );
            }


            if (action === "delete") {

                if (
                    !confirm(
                        "هل تريد حذف الحجز نهائيًا؟"
                    )
                ) return;

                await deleteBooking(id);
            }


            if (action === "whatsapp") {

                const bookingSnap =
                    await getDoc(
                        doc(db, "bookings", id)
                    );

                if (!bookingSnap.exists()) {
                    alert("الحجز غير موجود.");
                    return;
                }

                openWhatsApp(
                    bookingSnap.data().phone,
                    {
                        id,
                        ...bookingSnap.data()
                    }
                );
            }

        } catch (error) {

            console.error(
                "Booking action error:",
                error
            );

            alert(
                "حدث خطأ أثناء تنفيذ العملية."
            );
        }
    }
);


/* =========================================================
   BROWSER NOTIFICATION
========================================================= */

function showBookingNotification(booking) {

    const title =
        "🔔 حجز جديد في MindCare";

    const body =
        `${booking.name || "عميل"} - ` +
        `${booking.provider || "مختص"} - ` +
        `${booking.date || ""} ` +
        `${booking.time || ""}`;

    const notification =
        document.getElementById("notification");

    const notificationTitle =
        document.getElementById("notificationTitle");

    const notificationBody =
        document.getElementById("notificationBody");

    if (
        notification &&
        notificationTitle &&
        notificationBody
    ) {

        notificationTitle.textContent = title;
        notificationBody.textContent = body;

        notification.hidden = false;

        setTimeout(() => {
            notification.hidden = true;
        }, 8000);
    }


    if (
        "Notification" in window &&
        Notification.permission === "granted"
    ) {

        try {

            new Notification(
                title,
                {
                    body,
                    tag: `mindcare-${booking.id}`
                }
            );

        } catch (error) {

            console.warn(
                "Browser notification failed:",
                error
            );
        }
    }
}


/* =========================================================
   REALTIME SLOTS
========================================================= */

function listenToSlots() {

    if (slotsUnsubscribe) {
        slotsUnsubscribe();
    }

    const slotsQuery =
        query(
            collection(db, "slots"),
            orderBy("date", "asc")
        );

    slotsUnsubscribe =
        onSnapshot(
            slotsQuery,
            snapshot => {

                const slots =
                    snapshot.docs.map(item => ({
                        id: item.id,
                        ...item.data()
                    }));

                renderSlots(slots);

                const available =
                    slots.filter(
                        slot => !slot.booked
                    );

                const slotCount =
                    document.getElementById("slotCount");

                if (slotCount) {
                    slotCount.textContent =
                        available.length;
                }
            },

            error => {
                console.error(
                    "Slots listener:",
                    error
                );
            }
        );
}


function renderSlots(slots) {

    const container =
        document.getElementById("slotRows");

    if (!container) return;

    if (!slots.length) {

        container.innerHTML = `
            <tr>
                <td colspan="5" class="empty">
                    لا توجد مواعيد مضافة.
                </td>
            </tr>
        `;

        return;
    }

    slots.sort((a, b) => {

        const first =
            `${a.date || ""} ${a.time || ""}`;

        const second =
            `${b.date || ""} ${b.time || ""}`;

        return first.localeCompare(second);
    });


    container.innerHTML =
        slots.map(slot => {

            const booked =
                Boolean(slot.booked);

            return `
                <tr>

                    <td>
                        ${escapeHTML(
                            slot.provider || "—"
                        )}
                    </td>

                    <td dir="ltr">
                        ${escapeHTML(
                            slot.date || "—"
                        )}
                    </td>

                    <td dir="ltr">
                        ${escapeHTML(
                            slot.time || "—"
                        )}
                    </td>

                    <td>

                        <span class="badge ${
                            booked
                                ? "booked"
                                : "available"
                        }">

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
                            data-slot-delete="${escapeHTML(slot.id)}">

                            حذف

                        </button>

                    </td>

                </tr>
            `;

        }).join("");
}


/* =========================================================
   ADD SLOTS
========================================================= */

async function addSlots(event) {

    event.preventDefault();

    getCurrentUser();

    const providerSelect =
        document.getElementById("sProv");

    const dateInput =
        document.getElementById("sDate");

    const timesInput =
        document.getElementById("sTimes");

    const providerId =
        providerSelect?.value;

    const providerName =
        providerSelect?.selectedOptions?.[0]?.dataset.name ||
        providerSelect?.selectedOptions?.[0]?.textContent ||
        "";

    const date =
        dateInput.value;

    const times =
        timesInput.value
            .split(",")
            .map(time => time.trim())
            .filter(Boolean);


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


    if (!times.length) {

        showMessage(
            "slotMsg",
            "أدخل وقتًا واحدًا على الأقل.",
            "error"
        );

        return;
    }


    try {

        const existingQuery =
            query(
                collection(db, "slots"),
                where(
                    "providerId",
                    "==",
                    providerId
                ),
                where(
                    "date",
                    "==",
                    date
                )
            );

        const existingSnap =
            await getDocs(existingQuery);

        const existingTimes =
            new Set(
                existingSnap.docs.map(
                    item => item.data().time
                )
            );


        let added = 0;

        for (const time of times) {

            if (existingTimes.has(time)) {
                continue;
            }

            await addDoc(
                collection(db, "slots"),
                {
                    providerId,
                    provider: providerName,
                    date,
                    time,
                    booked: false,
                    bookingId: null,
                    createdAt: serverTimestamp()
                }
            );

            added++;
        }


        showMessage(
            "slotMsg",
            `تمت إضافة ${added} موعد/مواعيد بنجاح.`,
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
            "حدث خطأ أثناء إضافة المواعيد.",
            "error"
        );
    }
}


document
    .getElementById("slotForm")
    ?.addEventListener(
        "submit",
        addSlots
    );


document.addEventListener(
    "click",
    async event => {

        const button =
            event.target.closest(
                "[data-slot-delete]"
            );

        if (!button) return;

        const slotId =
            button.dataset.slotDelete;

        if (
            !confirm(
                "هل تريد حذف هذا الموعد؟"
            )
        ) return;

        try {

            getCurrentUser();

            const slotRef =
                doc(db, "slots", slotId);

            const slotSnap =
                await getDoc(slotRef);

            if (!slotSnap.exists()) return;

            const slot =
                slotSnap.data();

            if (slot.booked) {

                alert(
                    "لا يمكن حذف موعد محجوز. قم بإلغاء الحجز أولًا."
                );

                return;
            }

            await deleteDoc(slotRef);

        } catch (error) {

            console.error(
                "Delete slot:",
                error
            );

            alert(
                "حدث خطأ أثناء حذف الموعد."
            );
        }
    }
);


/* =========================================================
   TOPICS / SECTIONS
========================================================= */

function listenToTopics() {

    if (topicsUnsubscribe) {
        topicsUnsubscribe();
    }

    const topicsQuery =
        query(
            collection(db, "topics"),
            orderBy("createdAt", "desc")
        );

    topicsUnsubscribe =
        onSnapshot(
            topicsQuery,
            snapshot => {

                const topics =
                    snapshot.docs.map(item => ({
                        id: item.id,
                        ...item.data()
                    }));

                renderTopics(topics);

                const topicCount =
                    document.getElementById("topicCount");

                if (topicCount) {
                    topicCount.textContent =
                        topics.length;
                }
            },

            error => {

                console.error(
                    "Topics listener:",
                    error
                );

                /*
                 * If old topics don't have createdAt,
                 * retry without orderBy.
                 */

                listenToTopicsFallback();
            }
        );
}


function listenToTopicsFallback() {

    if (topicsUnsubscribe) {
        topicsUnsubscribe();
    }

    topicsUnsubscribe =
        onSnapshot(
            collection(db, "topics"),
            snapshot => {

                const topics =
                    snapshot.docs.map(item => ({
                        id: item.id,
                        ...item.data()
                    }));

                renderTopics(topics);

                const topicCount =
                    document.getElementById("topicCount");

                if (topicCount) {
                    topicCount.textContent =
                        topics.length;
                }
            }
        );
}


function renderTopics(topics) {

    const container =
        document.getElementById("topicsList");

    if (!container) return;

    if (!topics.length) {

        container.innerHTML = `
            <p class="empty">
                لا توجد أقسام حاليًا.
            </p>
        `;

        return;
    }


    container.innerHTML =
        topics.map(topic => {

            const active =
                topic.active !== false;

            return `
                <div class="card"
                    style="
                        padding:15px;
                        margin-bottom:10px;
                    ">

                    <div class="top"
                        style="margin-bottom:10px">

                        <div>

                            <strong>
                                ${escapeHTML(
                                    topic.titleAr ||
                                    topic.title ||
                                    "بدون اسم"
                                )}
                            </strong>

                            <br>

                            <small>
                                ${escapeHTML(
                                    topic.titleEn ||
                                    ""
                                )}
                            </small>

                        </div>

                        <span class="badge ${
                            active
                                ? "confirmed"
                                : "cancelled"
                        }">

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
                            data-topic-toggle="${escapeHTML(topic.id)}"
                            data-active="${active}">

                            ${
                                active
                                    ? "إخفاء"
                                    : "تفعيل"
                            }

                        </button>

                        <button
                            class="btn btn-outline mini"
                            data-topic-delete="${escapeHTML(topic.id)}">

                            حذف

                        </button>

                    </div>

                </div>
            `;

        }).join("");
}


/*
 * Add / Update topic
 *
 * Supports the current HTML IDs:
 * tKey
 * tTitle
 * tIntro
 * tSymptoms
 *
 * Also supports future bilingual fields:
 * tTitleEn
 * tIntroEn
 */

document
    .getElementById("topicForm")
    ?.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            try {

                getCurrentUser();

                const key =
                    document
                        .getElementById("tKey")
                        .value
                        .trim()
                        .toLowerCase()
                        .replace(/\s+/g, "-");


                const titleAr =
                    document
                        .getElementById("tTitle")
                        .value
                        .trim();


                const introAr =
                    document
                        .getElementById("tIntro")
                        .value
                        .trim();


                const symptoms =
                    document
                        .getElementById("tSymptoms")
                        .value
                        .split(",")
                        .map(item => item.trim())
                        .filter(Boolean);


                if (!key || !titleAr) {

                    showMessage(
                        "topicMsg",
                        "أدخل البيانات المطلوبة.",
                        "error"
                    );

                    return;
                }


                const titleEnInput =
                    document.getElementById("tTitleEn");

                const introEnInput =
                    document.getElementById("tIntroEn");


                const titleEn =
                    titleEnInput?.value.trim() ||
                    titleAr;


                const introEn =
                    introEnInput?.value.trim() ||
                    introAr;


                /*
                 * Use the key as document ID.
                 */

                const topicRef =
                    doc(db, "topics", key);

                const existing =
                    await getDoc(topicRef);


                const data = {

                    titleAr,
                    titleEn,

                    descriptionAr:
                        introAr,

                    descriptionEn:
                        introEn,

                    intro:
                        introAr,

                    symptoms,

                    active:
                        existing.exists()
                            ? existing.data().active !== false
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

                    await import(
                        "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js"
                    ).then(async module => {

                        await module.setDoc(
                            topicRef,
                            {
                                ...data,
                                createdAt:
                                    serverTimestamp()
                            }
                        );

                    });
                }


                showMessage(
                    "topicMsg",
                    "تم حفظ القسم بنجاح.",
                    "success"
                );

                event.target.reset();

            } catch (error) {

                console.error(
                    "Topic save:",
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


document.addEventListener(
    "click",
    async event => {

        const toggle =
            event.target.closest(
                "[data-topic-toggle]"
            );

        const remove =
            event.target.closest(
                "[data-topic-delete]"
            );


        try {

            if (toggle) {

                getCurrentUser();

                const id =
                    toggle.dataset.topicToggle;

                const current =
                    toggle.dataset.active === "true";


                await updateDoc(
                    doc(db, "topics", id),
                    {
                        active: !current,
                        updatedAt:
                            serverTimestamp()
                    }
                );
            }


            if (remove) {

                getCurrentUser();

                const id =
                    remove.dataset.topicDelete;

                if (
                    !confirm(
                        "هل تريد حذف هذا القسم نهائيًا؟"
                    )
                ) return;


                await deleteDoc(
                    doc(db, "topics", id)
                );
            }

        } catch (error) {

            console.error(
                "Topic action:",
                error
            );

            alert(
                "حدث خطأ أثناء تنفيذ العملية."
            );
        }
    }
);


/* =========================================================
   PROVIDERS / SPECIALISTS
========================================================= */

function listenToProviders() {

    if (providersUnsubscribe) {
        providersUnsubscribe();
    }

    const providersQuery =
        query(
            collection(db, "providers"),
            orderBy("createdAt", "desc")
        );

    providersUnsubscribe =
        onSnapshot(
            providersQuery,
            snapshot => {

                const providers =
                    snapshot.docs.map(item => ({
                        id: item.id,
                        ...item.data()
                    }));

                renderProviders(providers);
                fillProviderSelect(providers);

            },

            error => {

                console.error(
                    "Providers listener:",
                    error
                );

                listenToProvidersFallback();
            }
        );
}


function listenToProvidersFallback() {

    if (providersUnsubscribe) {
        providersUnsubscribe();
    }

    providersUnsubscribe =
        onSnapshot(
            collection(db, "providers"),
            snapshot => {

                const providers =
                    snapshot.docs.map(item => ({
                        id: item.id,
                        ...item.data()
                    }));

                renderProviders(providers);
                fillProviderSelect(providers);
            }
        );
}


function renderProviders(providers) {

    const container =
        document.getElementById("providersList");

    if (!container) return;

    if (!providers.length) {

        container.innerHTML = `
            <p class="empty">
                لا يوجد مختصون حاليًا.
            </p>
        `;

        return;
    }


    container.innerHTML =
        providers.map(provider => {

            const active =
                provider.active !== false;

            return `
                <div class="card"
                    style="
                        padding:15px;
                        margin-bottom:10px;
                    ">

                    <div class="top"
                        style="margin-bottom:10px">

                        <div>

                            <strong>
                                ${escapeHTML(
                                    provider.nameAr ||
                                    provider.name ||
                                    "بدون اسم"
                                )}
                            </strong>

                            <br>

                            <small>
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

                        <span class="badge ${
                            active
                                ? "confirmed"
                                : "cancelled"
                        }">

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
                            data-provider-toggle="${escapeHTML(provider.id)}"
                            data-active="${active}">

                            ${
                                active
                                    ? "إخفاء"
                                    : "تفعيل"
                            }

                        </button>

                        <button
                            class="btn btn-outline mini"
                            data-provider-delete="${escapeHTML(provider.id)}">

                            حذف

                        </button>

                    </div>

                </div>
            `;

        }).join("");
}


function fillProviderSelect(providers) {

    const select =
        document.getElementById("sProv");

    if (!select) return;

    const activeProviders =
        providers.filter(
            provider =>
                provider.active !== false
        );


    select.innerHTML =
        activeProviders.map(provider => {

            const name =
                provider.nameAr ||
                provider.name ||
                provider.nameEn ||
                "مختص";


            return `
                <option
                    value="${escapeHTML(provider.id)}"
                    data-name="${escapeHTML(name)}">

                    ${escapeHTML(name)}

                </option>
            `;

        }).join("");


    if (!activeProviders.length) {

        select.innerHTML =
            `<option value="">
                لا يوجد مختصون فعالون
            </option>`;
    }
}


/*
 * Add provider
 *
 * Supports:
 * providerName
 *
 * Future bilingual fields:
 * providerNameAr
 * providerNameEn
 * providerSpecialtyAr
 * providerSpecialtyEn
 * providerBioAr
 * providerBioEn
 */

document
    .getElementById("providerForm")
    ?.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            try {

                getCurrentUser();

                const nameInput =
                    document.getElementById(
                        "providerName"
                    );


                const nameAr =
                    nameInput?.value.trim();


                if (!nameAr) {

                    showMessage(
                        "providerMsg",
                        "اكتب اسم المختص.",
                        "error"
                    );

                    return;
                }


                const nameEnInput =
                    document.getElementById(
                        "providerNameEn"
                    );


                const specialtyArInput =
                    document.getElementById(
                        "providerSpecialtyAr"
                    );


                const specialtyEnInput =
                    document.getElementById(
                        "providerSpecialtyEn"
                    );


                const bioArInput =
                    document.getElementById(
                        "providerBioAr"
                    );


                const bioEnInput =
                    document.getElementById(
                        "providerBioEn"
                    );


                const nameEn =
                    nameEnInput?.value.trim() ||
                    nameAr;


                const specialtyAr =
                    specialtyArInput?.value.trim() ||
                    "";


                const specialtyEn =
                    specialtyEnInput?.value.trim() ||
                    specialtyAr;


                const bioAr =
                    bioArInput?.value.trim() ||
                    "";


                const bioEn =
                    bioEnInput?.value.trim() ||
                    bioAr;


                await addDoc(
                    collection(db, "providers"),
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
                    "Provider save:",
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


document.addEventListener(
    "click",
    async event => {

        const toggle =
            event.target.closest(
                "[data-provider-toggle]"
            );

        const remove =
            event.target.closest(
                "[data-provider-delete]"
            );


        try {

            if (toggle) {

                getCurrentUser();

                const id =
                    toggle.dataset.providerToggle;

                const current =
                    toggle.dataset.active === "true";


                await updateDoc(
                    doc(db, "providers", id),
                    {
                        active: !current,
                        updatedAt:
                            serverTimestamp()
                    }
                );
            }


            if (remove) {

                getCurrentUser();

                const id =
                    remove.dataset.providerDelete;

                if (
                    !confirm(
                        "هل تريد حذف هذا المختص نهائيًا؟"
                    )
                ) return;


                await deleteDoc(
                    doc(db, "providers", id)
                );
            }

        } catch (error) {

            console.error(
                "Provider action:",
                error
            );

            alert(
                "حدث خطأ أثناء تنفيذ العملية."
            );
        }
    }
);


/* =========================================================
   INITIALIZE AFTER ADMIN LOGIN
========================================================= */

window.addEventListener(
    "mindcare-admin-ready",
    () => {

        console.log(
            "MindCare Admin Firebase initialized."
        );

        listenToBookings();
        listenToSlots();
        listenToTopics();
        listenToProviders();

    },
    { once: true }
);


/* =========================================================
   TAB SYSTEM
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


        const sections = [
            "bookings",
            "slots",
            "topics",
            "providers"
        ];


        sections.forEach(name => {

            const section =
                document.getElementById(
                    `p-${name}`
                );

            if (!section) return;

            section.hidden =
                name !== tab;
        });


        document
            .querySelectorAll(
                "[data-tab]"
            )
            .forEach(item => {

                item.classList.remove(
                    "btn-primary"
                );

                item.classList.add(
                    "btn-soft"
                );

            });


        button.classList.remove(
            "btn-soft"
        );

        button.classList.add(
            "btn-primary"
        );
    }
);
