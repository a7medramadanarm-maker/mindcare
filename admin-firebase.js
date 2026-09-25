/* =========================================================
   MINDCARE ADMIN DASHBOARD
   Firebase Authentication + Firestore
   No WhatsApp integration
========================================================= */

import { initializeApp } from
    "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut
} from
    "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    getFirestore,
    collection,
    doc,
    addDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
    writeBatch
} from
    "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


/* =========================================================
   FIREBASE
========================================================= */

const firebaseConfig = window.MINDCARE_FIREBASE_CONFIG;

if (!firebaseConfig) {
    throw new Error(
        "Firebase configuration was not found. Check firebase-config.js"
    );
}

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);


/* =========================================================
   ADMIN UID
========================================================= */

const ADMIN_UID = "70WNrO5zubWwSxegfpSPRkCIfhw1";


/* =========================================================
   DOM
========================================================= */

const login = document.getElementById("login");
const appPanel = document.getElementById("app");

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("pass");
const loginErr = document.getElementById("loginErr");

const logoutBtn = document.getElementById("logout");

const bookingCount = document.getElementById("bookingCount");
const pendingCount = document.getElementById("pendingCount");
const slotCount = document.getElementById("slotCount");
const topicCount = document.getElementById("topicCount");

const bookRows = document.getElementById("bookRows");
const slotRows = document.getElementById("slotRows");

const slotForm = document.getElementById("slotForm");
const sProv = document.getElementById("sProv");
const sDate = document.getElementById("sDate");
const sTimes = document.getElementById("sTimes");
const slotMsg = document.getElementById("slotMsg");

const topicForm = document.getElementById("topicForm");
const tKey = document.getElementById("tKey");
const tTitle = document.getElementById("tTitle");
const tTitleEn = document.getElementById("tTitleEn");
const tIntro = document.getElementById("tIntro");
const tIntroEn = document.getElementById("tIntroEn");
const tSymptoms = document.getElementById("tSymptoms");
const topicMsg = document.getElementById("topicMsg");
const topicsList = document.getElementById("topicsList");

const providerForm = document.getElementById("providerForm");
const providerName = document.getElementById("providerName");
const providerNameEn = document.getElementById("providerNameEn");
const providerSpecialtyAr = document.getElementById("providerSpecialtyAr");
const providerSpecialtyEn = document.getElementById("providerSpecialtyEn");
const providerBioAr = document.getElementById("providerBioAr");
const providerBioEn = document.getElementById("providerBioEn");
const providerMsg = document.getElementById("providerMsg");
const providersList = document.getElementById("providersList");

const notificationBox = document.getElementById("notification");
const notificationTitle = document.getElementById("notificationTitle");
const notificationBody = document.getElementById("notificationBody");

const enableNotifications =
    document.getElementById("enableNotifications");


/* =========================================================
   LOCAL STATE
========================================================= */

let bookingsCache = [];
let slotsCache = [];
let topicsCache = [];
let providersCache = [];

let unsubscribeBookings = null;
let unsubscribeSlots = null;
let unsubscribeTopics = null;
let unsubscribeProviders = null;


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


function showElement(element) {
    if (element) {
        element.style.display = "";
    }
}


function hideElement(element) {
    if (element) {
        element.style.display = "none";
    }
}


function showMessage(element, message, type = "success") {
    if (!element) return;

    element.textContent = message;
    element.className = `msg ${type}`;
    element.style.display = "block";

    setTimeout(() => {
        element.style.display = "none";
    }, 3500);
}


function formatTimestamp(timestamp) {
    if (!timestamp) return "—";

    try {
        if (typeof timestamp.toDate === "function") {
            return timestamp.toDate().toLocaleString("ar-EG");
        }

        return new Date(timestamp).toLocaleString("ar-EG");
    } catch {
        return "—";
    }
}


function todayString() {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function normalizeKey(value) {
    return String(value || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\u0600-\u06FF-]/g, "");
}


/* =========================================================
   AUTHENTICATION
========================================================= */

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        showElement(login);
        hideElement(appPanel);

        stopListeners();

        return;
    }


    if (user.uid !== ADMIN_UID) {

        await signOut(auth);

        showElement(login);
        hideElement(appPanel);

        if (loginErr) {
            loginErr.textContent =
                "هذا الحساب ليس لديه صلاحية الدخول إلى لوحة الإدارة.";

            loginErr.style.display = "block";
        }

        return;
    }


    hideElement(login);
    showElement(appPanel);

    startListeners();
});


/* =========================================================
   LOGIN
========================================================= */

if (loginForm) {

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        if (loginErr) {
            loginErr.style.display = "none";
        }

        const email = emailInput?.value.trim();
        const password = passwordInput?.value;

        if (!email || !password) {

            if (loginErr) {
                loginErr.textContent =
                    "اكتب البريد الإلكتروني وكلمة المرور.";

                loginErr.style.display = "block";
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

            console.error("Login error:", error);

            let message = "حدث خطأ أثناء تسجيل الدخول.";

            if (
                error.code === "auth/invalid-credential" ||
                error.code === "auth/wrong-password" ||
                error.code === "auth/user-not-found"
            ) {
                message =
                    "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
            }

            if (error.code === "auth/too-many-requests") {
                message =
                    "تمت محاولات كثيرة. حاول مرة أخرى بعد قليل.";
            }

            if (loginErr) {
                loginErr.textContent = message;
                loginErr.style.display = "block";
            }
        }
    });
}


/* =========================================================
   LOGOUT
========================================================= */

if (logoutBtn) {

    logoutBtn.addEventListener("click", async () => {

        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout error:", error);
        }

    });
}


/* =========================================================
   REALTIME LISTENERS
========================================================= */

function startListeners() {

    stopListeners();


    /* -----------------------------------------------------
       BOOKINGS
    ----------------------------------------------------- */

    const bookingsQuery = query(
        collection(db, "bookings"),
        orderBy("createdAt", "desc")
    );

    unsubscribeBookings = onSnapshot(
        bookingsQuery,
        (snapshot) => {

            bookingsCache = snapshot.docs.map(item => ({
                id: item.id,
                ...item.data()
            }));

            renderBookings();
            updateStats();
        },

        (error) => {
            console.error("Bookings listener error:", error);
        }
    );


    /* -----------------------------------------------------
       SLOTS
    ----------------------------------------------------- */

    unsubscribeSlots = onSnapshot(
        collection(db, "slots"),
        (snapshot) => {

            slotsCache = snapshot.docs.map(item => ({
                id: item.id,
                ...item.data()
            }));

            renderSlots();
            updateStats();
            populateProviderSelect();
        },

        (error) => {
            console.error("Slots listener error:", error);
        }
    );


    /* -----------------------------------------------------
       TOPICS
    ----------------------------------------------------- */

    unsubscribeTopics = onSnapshot(
        collection(db, "topics"),
        (snapshot) => {

            topicsCache = snapshot.docs.map(item => ({
                id: item.id,
                ...item.data()
            }));

            topicsCache.sort((a, b) =>
                String(a.titleAr || "").localeCompare(
                    String(b.titleAr || ""),
                    "ar"
                )
            );

            renderTopics();
            updateStats();
        },

        (error) => {
            console.error("Topics listener error:", error);
        }
    );


    /* -----------------------------------------------------
       PROVIDERS
    ----------------------------------------------------- */

    unsubscribeProviders = onSnapshot(
        collection(db, "providers"),
        (snapshot) => {

            providersCache = snapshot.docs.map(item => ({
                id: item.id,
                ...item.data()
            }));

            providersCache.sort((a, b) =>
                String(a.nameAr || "").localeCompare(
                    String(b.nameAr || ""),
                    "ar"
                )
            );

            renderProviders();
            populateProviderSelect();
        },

        (error) => {
            console.error("Providers listener error:", error);
        }
    );
}


function stopListeners() {

    if (unsubscribeBookings) {
        unsubscribeBookings();
        unsubscribeBookings = null;
    }

    if (unsubscribeSlots) {
        unsubscribeSlots();
        unsubscribeSlots = null;
    }

    if (unsubscribeTopics) {
        unsubscribeTopics();
        unsubscribeTopics = null;
    }

    if (unsubscribeProviders) {
        unsubscribeProviders();
        unsubscribeProviders = null;
    }
}


/* =========================================================
   STATS
========================================================= */

function updateStats() {

    const pending = bookingsCache.filter(
        booking =>
            !booking.status ||
            booking.status === "pending"
    ).length;


    if (bookingCount) {
        bookingCount.textContent = bookingsCache.length;
    }

    if (pendingCount) {
        pendingCount.textContent = pending;
    }

    if (slotCount) {
        slotCount.textContent =
            slotsCache.filter(slot => !slot.booked).length;
    }

    if (topicCount) {
        topicCount.textContent =
            topicsCache.filter(topic => topic.active !== false).length;
    }
}


/* =========================================================
   BOOKINGS
========================================================= */

function renderBookings() {

    if (!bookRows) return;

    if (!bookingsCache.length) {

        bookRows.innerHTML = `
            <tr>
                <td colspan="8">
                    لا توجد حجوزات حتى الآن.
                </td>
            </tr>
        `;

        return;
    }


    bookRows.innerHTML = bookingsCache.map(booking => {

        const status =
            booking.status || "pending";

        let statusText = "في الانتظار";

        if (status === "confirmed") {
            statusText = "مؤكد";
        }

        if (status === "cancelled") {
            statusText = "ملغي";
        }


        return `
            <tr>

                <td>
                    ${escapeHTML(booking.name || "—")}
                </td>

                <td>
                    ${escapeHTML(booking.phone || "—")}
                </td>

                <td>
                    ${escapeHTML(booking.provider || "—")}
                </td>

                <td>
                    ${escapeHTML(booking.date || "—")}
                </td>

                <td>
                    ${escapeHTML(booking.time || "—")}
                </td>

                <td>
                    ${escapeHTML(booking.message || "—")}
                </td>

                <td>
                    <span class="status status-${escapeHTML(status)}">
                        ${statusText}
                    </span>
                </td>

                <td>
                    <div class="actions">

                        ${
                            status === "pending"
                                ? `
                                <button
                                    class="btn small"
                                    onclick="confirmBooking('${booking.id}')">
                                    تأكيد
                                </button>
                                `
                                : ""
                        }

                        ${
                            status !== "cancelled"
                                ? `
                                <button
                                    class="btn small danger"
                                    onclick="cancelBooking('${booking.id}')">
                                    إلغاء
                                </button>
                                `
                                : ""
                        }

                        <button
                            class="btn small danger"
                            onclick="deleteBooking('${booking.id}')">
                            حذف
                        </button>

                    </div>
                </td>

            </tr>
        `;

    }).join("");
}


/* =========================================================
   CONFIRM BOOKING
========================================================= */

window.confirmBooking = async function (bookingId) {

    try {

        await updateDoc(
            doc(db, "bookings", bookingId),
            {
                status: "confirmed",
                updatedAt: serverTimestamp()
            }
        );

    } catch (error) {

        console.error("Confirm booking error:", error);

        alert("حدث خطأ أثناء تأكيد الحجز.");
    }
};


/* =========================================================
   CANCEL BOOKING
========================================================= */

window.cancelBooking = async function (bookingId) {

    const booking =
        bookingsCache.find(item => item.id === bookingId);

    if (!booking) return;


    try {

        const batch = writeBatch(db);


        batch.update(
            doc(db, "bookings", bookingId),
            {
                status: "cancelled",
                updatedAt: serverTimestamp()
            }
        );


        if (booking.slotId) {

            batch.update(
                doc(db, "slots", booking.slotId),
                {
                    booked: false,
                    bookingId: "",
                    updatedAt: serverTimestamp()
                }
            );
        }


        await batch.commit();

    } catch (error) {

        console.error("Cancel booking error:", error);

        alert("حدث خطأ أثناء إلغاء الحجز.");
    }
};


/* =========================================================
   DELETE BOOKING
========================================================= */

window.deleteBooking = async function (bookingId) {

    const booking =
        bookingsCache.find(item => item.id === bookingId);

    if (!booking) return;


    const confirmed =
        confirm("هل تريد حذف هذا الحجز نهائيًا؟");

    if (!confirmed) return;


    try {

        const batch = writeBatch(db);


        batch.delete(
            doc(db, "bookings", bookingId)
        );


        if (
            booking.slotId &&
            booking.status !== "confirmed"
        ) {

            batch.update(
                doc(db, "slots", booking.slotId),
                {
                    booked: false,
                    bookingId: "",
                    updatedAt: serverTimestamp()
                }
            );
        }


        await batch.commit();

    } catch (error) {

        console.error("Delete booking error:", error);

        alert("حدث خطأ أثناء حذف الحجز.");
    }
};


/* =========================================================
   PROVIDERS SELECT
========================================================= */

function populateProviderSelect() {

    if (!sProv) return;


    const currentValue = sProv.value;


    sProv.innerHTML = `
        <option value="">
            اختر المعالج
        </option>
    `;


    providersCache
        .filter(provider => provider.active !== false)
        .forEach(provider => {

            const option =
                document.createElement("option");

            option.value = provider.id;

            option.textContent =
                provider.nameAr ||
                provider.nameEn ||
                "معالج";

            sProv.appendChild(option);
        });


    if (
        currentValue &&
        providersCache.some(
            provider => provider.id === currentValue
        )
    ) {
        sProv.value = currentValue;
    }
}


/* =========================================================
   ADD SLOTS
========================================================= */

if (slotForm) {

    slotForm.addEventListener("submit", async (event) => {

        event.preventDefault();


        const providerId =
            sProv?.value.trim();

        const date =
            sDate?.value.trim();

        const timesText =
            sTimes?.value.trim();


        if (!providerId || !date || !timesText) {

            showMessage(
                slotMsg,
                "أكمل بيانات الموعد.",
                "error"
            );

            return;
        }


        if (date < todayString()) {

            showMessage(
                slotMsg,
                "لا يمكن إضافة موعد في تاريخ سابق.",
                "error"
            );

            return;
        }


        const provider =
            providersCache.find(
                item => item.id === providerId
            );


        if (!provider) {

            showMessage(
                slotMsg,
                "المعالج غير موجود.",
                "error"
            );

            return;
        }


        const times =
            timesText
                .split(",")
                .map(time => time.trim())
                .filter(Boolean);


        if (!times.length) {

            showMessage(
                slotMsg,
                "أدخل وقتًا واحدًا على الأقل.",
                "error"
            );

            return;
        }


        try {

            let added = 0;


            for (const time of times) {

                const alreadyExists =
                    slotsCache.some(slot =>
                        slot.providerId === providerId &&
                        slot.date === date &&
                        slot.time === time
                    );


                if (alreadyExists) {
                    continue;
                }


                await addDoc(
                    collection(db, "slots"),
                    {
                        providerId,
                        provider:
                            provider.nameAr ||
                            provider.nameEn ||
                            "",

                        date,
                        time,

                        booked: false,
                        bookingId: "",

                        createdAt: serverTimestamp(),
                        updatedAt: serverTimestamp()
                    }
                );


                added++;
            }


            if (added === 0) {

                showMessage(
                    slotMsg,
                    "هذه المواعيد موجودة بالفعل.",
                    "error"
                );

            } else {

                showMessage(
                    slotMsg,
                    `تمت إضافة ${added} موعد بنجاح.`
                );

                sTimes.value = "";
            }

        } catch (error) {

            console.error("Add slots error:", error);

            showMessage(
                slotMsg,
                "حدث خطأ أثناء إضافة المواعيد.",
                "error"
            );
        }
    });
}


/* =========================================================
   RENDER SLOTS
========================================================= */

function renderSlots() {

    if (!slotRows) return;


    const sorted =
        [...slotsCache].sort((a, b) => {

            const first =
                `${a.date || ""} ${a.time || ""}`;

            const second =
                `${b.date || ""} ${b.time || ""}`;

            return first.localeCompare(second);
        });


    if (!sorted.length) {

        slotRows.innerHTML = `
            <tr>
                <td colspan="5">
                    لا توجد مواعيد مضافة.
                </td>
            </tr>
        `;

        return;
    }


    slotRows.innerHTML =
        sorted.map(slot => {

            const provider =
                escapeHTML(slot.provider || "—");

            const booked =
                Boolean(slot.booked);


            return `
                <tr>

                    <td>
                        ${provider}
                    </td>

                    <td>
                        ${escapeHTML(slot.date || "—")}
                    </td>

                    <td>
                        ${escapeHTML(slot.time || "—")}
                    </td>

                    <td>
                        ${
                            booked
                                ? `<span class="status status-confirmed">محجوز</span>`
                                : `<span class="status status-pending">متاح</span>`
                        }
                    </td>

                    <td>

                        ${
                            booked
                                ? ""
                                : `
                                <button
                                    class="btn small danger"
                                    onclick="deleteSlot('${slot.id}')">
                                    حذف
                                </button>
                                `
                        }

                    </td>

                </tr>
            `;

        }).join("");
}


/* =========================================================
   DELETE SLOT
========================================================= */

window.deleteSlot = async function (slotId) {

    const slot =
        slotsCache.find(item => item.id === slotId);

    if (!slot) return;


    if (slot.booked) {

        alert(
            "لا يمكن حذف موعد محجوز."
        );

        return;
    }


    if (
        !confirm(
            "هل تريد حذف هذا الموعد؟"
        )
    ) {
        return;
    }


    try {

        await deleteDoc(
            doc(db, "slots", slotId)
        );

    } catch (error) {

        console.error("Delete slot error:", error);

        alert("حدث خطأ أثناء حذف الموعد.");
    }
};


/* =========================================================
   TOPICS
========================================================= */

if (topicForm) {

    topicForm.addEventListener("submit", async (event) => {

        event.preventDefault();


        const key =
            normalizeKey(tKey?.value);

        const titleAr =
            tTitle?.value.trim();

        const titleEn =
            tTitleEn?.value.trim();

        const introAr =
            tIntro?.value.trim();

        const introEn =
            tIntroEn?.value.trim();

        const symptoms =
            tSymptoms?.value.trim();


        if (!key || !titleAr) {

            showMessage(
                topicMsg,
                "اكتب اسم القسم والمفتاح.",
                "error"
            );

            return;
        }


        try {

            await setDoc(
                doc(db, "topics", key),
                {
                    key,

                    titleAr,
                    titleEn,

                    descriptionAr: introAr,
                    descriptionEn: introEn,

                    intro: introAr,
                    introEn,

                    symptoms,

                    active: true,

                    updatedAt:
                        serverTimestamp()
                },
                {
                    merge: true
                }
            );


            showMessage(
                topicMsg,
                "تم حفظ القسم بنجاح."
            );


            topicForm.reset();

        } catch (error) {

            console.error("Topic save error:", error);

            showMessage(
                topicMsg,
                "حدث خطأ أثناء حفظ القسم.",
                "error"
            );
        }
    });
}


/* =========================================================
   RENDER TOPICS
========================================================= */

function renderTopics() {

    if (!topicsList) return;


    if (!topicsCache.length) {

        topicsList.innerHTML =
            "<p>لا توجد أقسام.</p>";

        return;
    }


    topicsList.innerHTML =
        topicsCache.map(topic => {

            const active =
                topic.active !== false;


            return `
                <div class="admin-item">

                    <div>

                        <strong>
                            ${escapeHTML(
                                topic.titleAr ||
                                topic.titleEn ||
                                "قسم"
                            )}
                        </strong>

                        <small>
                            ${escapeHTML(
                                topic.key || topic.id
                            )}
                        </small>

                    </div>

                    <div class="actions">

                        <button
                            class="btn small"
                            onclick="toggleTopic('${topic.id}', ${active})">
                            ${
                                active
                                    ? "تعطيل"
                                    : "تفعيل"
                            }
                        </button>

                        <button
                            class="btn small danger"
                            onclick="deleteTopic('${topic.id}')">
                            حذف
                        </button>

                    </div>

                </div>
            `;

        }).join("");
}


/* =========================================================
   TOGGLE TOPIC
========================================================= */

window.toggleTopic = async function (
    topicId,
    currentState
) {

    try {

        await updateDoc(
            doc(db, "topics", topicId),
            {
                active: !currentState,
                updatedAt: serverTimestamp()
            }
        );

    } catch (error) {

        console.error("Toggle topic error:", error);

        alert("حدث خطأ.");
    }
};


/* =========================================================
   DELETE TOPIC
========================================================= */

window.deleteTopic = async function (topicId) {

    if (
        !confirm(
            "هل تريد حذف هذا القسم نهائيًا؟"
        )
    ) {
        return;
    }


    try {

        await deleteDoc(
            doc(db, "topics", topicId)
        );

    } catch (error) {

        console.error("Delete topic error:", error);

        alert("حدث خطأ أثناء حذف القسم.");
    }
};


/* =========================================================
   PROVIDERS
========================================================= */

if (providerForm) {

    providerForm.addEventListener("submit", async (event) => {

        event.preventDefault();


        const nameAr =
            providerName?.value.trim();

        const nameEn =
            providerNameEn?.value.trim();

        const specialtyAr =
            providerSpecialtyAr?.value.trim();

        const specialtyEn =
            providerSpecialtyEn?.value.trim();

        const bioAr =
            providerBioAr?.value.trim();

        const bioEn =
            providerBioEn?.value.trim();


        if (!nameAr) {

            showMessage(
                providerMsg,
                "اكتب اسم المعالج.",
                "error"
            );

            return;
        }


        try {

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
                providerMsg,
                "تمت إضافة المعالج بنجاح."
            );


            providerForm.reset();

        } catch (error) {

            console.error(
                "Provider add error:",
                error
            );

            showMessage(
                providerMsg,
                "حدث خطأ أثناء إضافة المعالج.",
                "error"
            );
        }
    });
}


/* =========================================================
   RENDER PROVIDERS
========================================================= */

function renderProviders() {

    if (!providersList) return;


    if (!providersCache.length) {

        providersList.innerHTML =
            "<p>لا يوجد معالجون.</p>";

        return;
    }


    providersList.innerHTML =
        providersCache.map(provider => {

            const active =
                provider.active !== false;


            return `
                <div class="admin-item">

                    <div>

                        <strong>
                            ${escapeHTML(
                                provider.nameAr ||
                                provider.nameEn ||
                                "معالج"
                            )}
                        </strong>

                        <small>
                            ${escapeHTML(
                                provider.specialtyAr ||
                                provider.specialtyEn ||
                                ""
                            )}
                        </small>

                    </div>

                    <div class="actions">

                        <button
                            class="btn small"
                            onclick="toggleProvider('${provider.id}', ${active})">
                            ${
                                active
                                    ? "تعطيل"
                                    : "تفعيل"
                            }
                        </button>

                        <button
                            class="btn small danger"
                            onclick="deleteProvider('${provider.id}')">
                            حذف
                        </button>

                    </div>

                </div>
            `;

        }).join("");
}


/* =========================================================
   TOGGLE PROVIDER
========================================================= */

window.toggleProvider = async function (
    providerId,
    currentState
) {

    try {

        await updateDoc(
            doc(db, "providers", providerId),
            {
                active: !currentState,
                updatedAt: serverTimestamp()
            }
        );

    } catch (error) {

        console.error(
            "Toggle provider error:",
            error
        );

        alert("حدث خطأ.");
    }
};


/* =========================================================
   DELETE PROVIDER
========================================================= */

window.deleteProvider = async function (
    providerId
) {

    const hasBookings =
        bookingsCache.some(
            booking =>
                booking.providerId === providerId
        );


    if (hasBookings) {

        alert(
            "لا يمكن حذف هذا المعالج لأنه مرتبط بحجوزات سابقة. يمكنك تعطيله بدلًا من حذفه."
        );

        return;
    }


    if (
        !confirm(
            "هل تريد حذف هذا المعالج؟"
        )
    ) {
        return;
    }


    try {

        await deleteDoc(
            doc(db, "providers", providerId)
        );

    } catch (error) {

        console.error(
            "Delete provider error:",
            error
        );

        alert("حدث خطأ أثناء حذف المعالج.");
    }
};


/* =========================================================
   ADMIN TABS
========================================================= */

document
    .querySelectorAll("[data-tab]")
    .forEach(button => {

        button.addEventListener("click", () => {

            const tab =
                button.dataset.tab;


            document
                .querySelectorAll("[data-tab]")
                .forEach(item => {
                    item.classList.remove("active");
                });


            document
                .querySelectorAll(".admin-panel")
                .forEach(panel => {
                    panel.classList.remove("active");
                });


            button.classList.add("active");


            const target =
                document.getElementById(
                    `p-${tab}`
                );


            if (target) {
                target.classList.add("active");
            }

        });

    });


/* =========================================================
   BROWSER NOTIFICATIONS
========================================================= */

if (enableNotifications) {

    enableNotifications.addEventListener(
        "click",
        async () => {

            if (
                !("Notification" in window)
            ) {

                alert(
                    "المتصفح لا يدعم الإشعارات."
                );

                return;
            }


            try {

                const permission =
                    await Notification.requestPermission();


                if (permission === "granted") {

                    new Notification(
                        "MindCare",
                        {
                            body:
                                "تم تفعيل إشعارات لوحة الإدارة."
                        }
                    );

                    enableNotifications.textContent =
                        "الإشعارات مفعلة";

                } else {

                    alert(
                        "لم يتم السماح بالإشعارات."
                    );
                }

            } catch (error) {

                console.error(
                    "Notification error:",
                    error
                );
            }
        }
    );
}


/* =========================================================
   NEW BOOKING NOTIFICATION
   Realtime dashboard notification only.
   No WhatsApp.
========================================================= */

let previousBookingCount = null;


function checkForNewBookingNotification() {

    if (previousBookingCount === null) {

        previousBookingCount =
            bookingsCache.length;

        return;
    }


    if (
        bookingsCache.length >
        previousBookingCount
    ) {

        const newest =
            bookingsCache[0];


        showAdminNotification(
            "حجز جديد",
            newest
                ? `تم استلام حجز جديد من ${newest.name || "عميل"}`
                : "تم استلام حجز جديد."
        );
    }


    previousBookingCount =
        bookingsCache.length;
}


function showAdminNotification(
    title,
    body
) {

    if (notificationTitle) {
        notificationTitle.textContent = title;
    }

    if (notificationBody) {
        notificationBody.textContent = body;
    }

    if (notificationBox) {

        notificationBox.style.display =
            "block";

        setTimeout(() => {

            notificationBox.style.display =
                "none";

        }, 5000);
    }


    if (
        "Notification" in window &&
        Notification.permission === "granted"
    ) {

        try {

            new Notification(
                title,
                {
                    body
                }
            );

        } catch (error) {

            console.error(
                "Browser notification error:",
                error
            );
        }
    }
}


/* =========================================================
   BOOKING LISTENER WRAPPER
========================================================= */

const originalRenderBookings =
    renderBookings;


/* =========================================================
   INITIAL UI
========================================================= */

if (sDate) {
    sDate.min = todayString();
}


/* =========================================================
   DEBUG
========================================================= */

console.log(
    "MindCare Admin Firebase initialized successfully."
);
