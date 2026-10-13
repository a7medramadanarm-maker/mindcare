hereimport { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getFirestore, collection, doc, runTransaction, query, where, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const config = window.MINDCARE_FIREBASE_CONFIG;
if (!config) throw new Error("Firebase configuration was not loaded.");
const app = getApps().length ? getApps()[0] : initializeApp(config);
const db = getFirestore(app);
const $ = id => document.getElementById(id);
const form = $("bookingForm"), nameInput = $("name"), phoneInput = $("phone"), messageInput = $("message");
const providerSelect = $("provider"), dateSelect = $("date"), timeSelect = $("time"), submitButton = $("submitBooking"), messageBox = $("bookingMessage");
let providers = [], slots = [], stopProviders = null, stopSlots = null;
const requestedProvider = new URLSearchParams(location.search).get("provider") || "";
let preselectDone = false;
const norm = value => String(value || "").toLowerCase().replace(/\s+/g, " ").trim();
function findRequestedProvider() {
    const wanted = norm(requestedProvider);
    if (!wanted) return null;
    const exact = providers.find(p => [p.id, p.nameEn, p.nameAr].some(v => norm(v) === wanted));
    if (exact) return exact;
    const loose = providers.filter(p => [p.nameEn, p.nameAr].some(v => norm(v) && (norm(v).includes(wanted) || wanted.includes(norm(v)))));
    return loose.length === 1 ? loose[0] : null;
}

function showMessage(text, type="success") { messageBox.textContent = text; messageBox.className = `booking-message ${type}`; messageBox.style.display = "block"; }
function hideMessage() { messageBox.textContent = ""; messageBox.className = "booking-message"; messageBox.style.display = "none"; }
function resetSelect(select, text) { select.innerHTML = ""; const option = document.createElement("option"); option.value = ""; option.textContent = text; select.appendChild(option); }
function today() { return new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Cairo" }).format(new Date()); }
function isFutureSlot(slot) { if (!slot.date || slot.date < today()) return false; if (slot.date > today()) return true; if (!slot.time) return false; const now = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Cairo", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date()); return slot.time >= now; }
function formatDate(value) { const date = new Date(`${value}T00:00:00`); return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("ar-EG", { weekday:"long", year:"numeric", month:"long", day:"numeric" }).format(date); }
function normalizeDigits(value) { return value.replace(/[\u0660-\u0669]/g, d => d.charCodeAt(0) - 0x0660).replace(/[\u06F0-\u06F9]/g, d => d.charCodeAt(0) - 0x06F0); }
function phoneIsValid(value) { return /^(?:\+?20|0020|0)?1[0125]\d{8}$/.test(normalizeDigits(value).replace(/[\s()-]/g, "")); }
function setLoading(loading) { submitButton.disabled = loading; submitButton.textContent = loading ? "جاري إرسال طلب الحجز..." : "تأكيد طلب الحجز"; }

function renderProviders() {
    const keep = providerSelect.value;
    resetSelect(providerSelect, providers.length ? "اختر المختص" : "لا يوجد مختصون متاحون حاليًا");
    providers.forEach(provider => { const option = document.createElement("option"); option.value = provider.id; option.textContent = provider.nameAr || provider.nameEn || "مختص"; providerSelect.appendChild(option); });
    providerSelect.disabled = !providers.length;
    if (!providers.length) { resetSelect(dateSelect, "لا توجد مواعيد متاحة"); resetSelect(timeSelect, "لا توجد مواعيد متاحة"); dateSelect.disabled = true; timeSelect.disabled = true; }
    else if (keep && providers.some(p => p.id === keep)) providerSelect.value = keep;
    else if (!preselectDone) { const wanted = findRequestedProvider(); if (wanted) { preselectDone = true; providerSelect.value = wanted.id; watchSlots(wanted.id); } }
}
function renderDates() {
    const available = slots.filter(isFutureSlot);
    const dates = [...new Set(available.map(slot => slot.date))].sort();
    resetSelect(dateSelect, dates.length ? "اختر التاريخ" : "لا توجد مواعيد متاحة");
    dates.forEach(value => { const option = document.createElement("option"); option.value = value; option.textContent = formatDate(value); dateSelect.appendChild(option); });
    dateSelect.disabled = !dates.length; resetSelect(timeSelect, "اختر التاريخ أولًا"); timeSelect.disabled = true;
}
function renderTimes(date) {
    const selected = slots.filter(slot => slot.date === date && isFutureSlot(slot));
    resetSelect(timeSelect, selected.length ? "اختر الوقت" : "لا توجد أوقات متاحة");
    selected.sort((a,b) => String(a.time).localeCompare(String(b.time))).forEach(slot => { const option = document.createElement("option"); option.value = slot.id; option.textContent = slot.time || "وقت غير محدد"; timeSelect.appendChild(option); });
    timeSelect.disabled = !selected.length;
}
function watchProviders() {
    stopProviders?.();
    const q = query(collection(db, "providers"), where("active", "==", true));
    stopProviders = onSnapshot(q, snap => { providers = snap.docs.map(item => ({ id:item.id, ...item.data() })).sort((a,b) => String(a.nameAr||"").localeCompare(String(b.nameAr||""), "ar")); renderProviders(); }, () => { resetSelect(providerSelect, "تعذر تحميل المختصين"); providerSelect.disabled = true; showMessage("حدث خطأ أثناء تحميل المختصين. حاول مرة أخرى.", "error"); });
}
function watchSlots(providerId) {
    stopSlots?.(); slots = []; resetSelect(dateSelect, providerId ? "جاري تحميل المواعيد..." : "اختر المختص أولًا"); resetSelect(timeSelect, "اختر التاريخ أولًا"); dateSelect.disabled = true; timeSelect.disabled = true; if (!providerId) return;
    const q = query(collection(db, "slots"), where("providerId", "==", providerId), where("booked", "==", false));
    stopSlots = onSnapshot(q, snap => { slots = snap.docs.map(item => ({ id:item.id, ...item.data() })); renderDates(); }, () => showMessage("حدث خطأ أثناء تحميل المواعيد.", "error"));
}

providerSelect.addEventListener("change", () => { hideMessage(); watchSlots(providerSelect.value); });
dateSelect.addEventListener("change", () => { hideMessage(); renderTimes(dateSelect.value); });
form.addEventListener("submit", async event => {
    event.preventDefault(); hideMessage();
    const name = nameInput.value.trim(), phone = normalizeDigits(phoneInput.value.trim()), message = messageInput.value.trim(), providerId = providerSelect.value, date = dateSelect.value, slotId = timeSelect.value;
    if (name.length < 2 || name.length > 100) return showMessage("اكتب اسمًا صحيحًا من 2 إلى 100 حرف.", "error");
    if (!phoneIsValid(phone)) return showMessage("اكتب رقم هاتف مصري صحيح.", "error");
    if (!providerId || !date || !slotId) return showMessage("أكمل اختيار المختص والتاريخ والوقت.", "error");
    if (message.length > 1000) return showMessage("الرسالة طويلة جدًا.", "error");
    const provider = providers.find(item => item.id === providerId), selected = slots.find(item => item.id === slotId);
    if (!provider || !selected) return showMessage("هذا الموعد لم يعد متاحًا. اختر موعدًا آخر.", "error");
    setLoading(true);
    // Open a temporary tab directly from the user's click so the browser is less likely
    // to block WhatsApp after the asynchronous Firestore transaction completes.
    const whatsappWindow = window.open("about:blank", "_blank");
    if (whatsappWindow) whatsappWindow.opener = null;
    let createdBookingId = "";
    try {
        await runTransaction(db, async transaction => {
            const slotRef = doc(db, "slots", slotId), bookingRef = doc(collection(db, "bookings"));
            createdBookingId = bookingRef.id;
            const slotSnap = await transaction.get(slotRef);
            if (!slotSnap.exists()) throw new Error("SLOT_NOT_FOUND");
            const slot = slotSnap.data();
            if (slot.booked === true) throw new Error("SLOT_ALREADY_BOOKED");
            if (slot.providerId !== providerId || slot.date !== date || !isFutureSlot(slot)) throw new Error("SLOT_CHANGED");
            transaction.set(bookingRef, { name, phone, message, providerId, provider: provider.nameAr || provider.nameEn || "", slotId, date: slot.date, time: slot.time, status:"pending", createdAt:serverTimestamp(), updatedAt:serverTimestamp() });
            transaction.update(slotRef, { booked:true, bookingId:bookingRef.id, updatedAt:serverTimestamp() });
        });
        const whatsappText = [
            "مرحبًا، تم تسجيل طلب حجز جديد في MindCare.",
            `رقم الطلب: ${createdBookingId}`,
            `الاسم: ${name}`,
            `رقم الهاتف: ${phone}`,
            `المختص: ${provider.nameAr || provider.nameEn || "غير محدد"}`,
            `التاريخ: ${date}`,
            `الوقت: ${selected.time || "غير محدد"}`,
            message ? `ملاحظات العميل: ${message}` : ""
        ].filter(Boolean).join("\n");
        const whatsappUrl = `https://wa.me/201097524883?text=${encodeURIComponent(whatsappText)}`;
        showMessage("تم تسجيل طلب الحجز بنجاح. سيتم فتح واتساب لإرسال تفاصيل الطلب إلى الإدارة.", "success");
        if (whatsappWindow && !whatsappWindow.closed) {
            whatsappWindow.location.href = whatsappUrl;
        } else {
            const fallback = document.createElement("a");
            fallback.href = whatsappUrl; fallback.target = "_blank"; fallback.rel = "noopener noreferrer";
            fallback.textContent = "اضغط هنا لفتح واتساب وإرسال تفاصيل الحجز";
            fallback.style.cssText = "display:inline-block;margin-top:8px;color:#356047;font-weight:700;text-decoration:underline";
            messageBox.appendChild(document.createElement("br")); messageBox.appendChild(fallback);
        }
        form.reset(); renderProviders(); resetSelect(dateSelect, "اختر المختص أولًا"); resetSelect(timeSelect, "اختر التاريخ أولًا"); dateSelect.disabled = true; timeSelect.disabled = true;
    } catch (error) { if (whatsappWindow && !whatsappWindow.closed) whatsappWindow.close(); console.error(error); const text = error.message === "SLOT_ALREADY_BOOKED" ? "عذرًا، هذا الموعد تم حجزه للتو." : "حدث خطأ أثناء إرسال الحجز. اختر موعدًا آخر وحاول مرة أخرى."; showMessage(text, "error"); watchSlots(providerId); } finally { setLoading(false); }
});
watchProviders();
