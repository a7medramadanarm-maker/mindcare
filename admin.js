"use strict";

(() => {
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const esc = MC.esc;
  const STATUS = { pending: "قيد المراجعة", confirmed: "مؤكد", cancelled: "ملغي" };
  const app = $("#app"), login = $("#login");

  const waNum = p => {
    p = p.replace(/\D/g, "");
    return p.startsWith("00") ? p.slice(2) : p.startsWith("0") ? "20" + p.slice(1) : p;
  };

  function updateStats() {
    const bs = MC.bookings(), sl = MC.slots(), ts = MC.topics();
    $("#bookingCount").textContent = bs.length;
    $("#pendingCount").textContent = bs.filter(b => b.status === "pending").length;
    $("#slotCount").textContent = sl.filter(s => !s.booked).length;
    $("#topicCount").textContent = Object.keys(ts).length;
  }

  function renderBookings() {
    const bs = MC.bookings();
    $("#bookRows").innerHTML = bs.length ? bs.map(b => `
      <tr>
        <td>#${esc(b.id)}<br><small>${new Date(b.created).toLocaleString("ar-EG")}</small></td>
        <td>${esc(b.name)}</td>
        <td dir="ltr">${esc(b.phone)}</td>
        <td>${esc(b.provider) || "—"}</td>
        <td>${esc(b.when) || "—"}</td>
        <td><span class="badge ${esc(b.status)}">${STATUS[b.status] || ""}</span></td>
        <td><div class="acts">
          <button class="btn btn-soft mini" data-a="confirmed" data-id="${esc(b.id)}" type="button">✓</button>
          <button class="btn btn-soft mini" data-a="cancelled" data-id="${esc(b.id)}" type="button">✕</button>
          <a class="btn btn-soft mini" href="https://wa.me/${waNum(b.phone)}" target="_blank" rel="noopener">WA</a>
          <button class="btn btn-soft mini" data-a="del" data-id="${esc(b.id)}" type="button">حذف</button>
        </div></td>
      </tr>`).join("") : '<tr><td colspan="7" class="empty">لا توجد طلبات حجز بعد.</td></tr>';
  }

  function renderSlots() {
    const sl = MC.slots();
    $("#slotRows").innerHTML = sl.length ? sl.map(s => `
      <tr>
        <td>${esc(s.provider)}</td>
        <td>${esc(s.date)}</td>
        <td dir="ltr">${esc(s.time)}</td>
        <td><span class="badge ${s.booked ? "confirmed" : ""}">${s.booked ? "محجوز" : "متاح"}</span></td>
        <td><button class="btn btn-soft mini" data-a="delslot" data-id="${esc(s.id)}" type="button">حذف</button></td>
      </tr>`).join("") : '<tr><td colspan="5" class="empty">أضف أول موعد متاح من النموذج بالأعلى.</td></tr>';
  }

  function renderTopics() {
    const ts = MC.topics();
    const keys = Object.keys(ts);
    $("#topicsList").innerHTML = keys.length ? keys.map(k => `
      <div class="card" style="margin-top:10px;padding:15px;background:var(--cream)">
        <div style="display:flex;justify-content:space-between;align-items:start;gap:10px">
          <div>
            <strong>${esc(ts[k].title)}</strong><br>
            <small>المعرّف: <code>${esc(k)}</code></small>
          </div>
          <button class="btn btn-soft mini" data-a="deltopic" data-id="${esc(k)}" type="button">حذف</button>
        </div>
      </div>`).join("") : '<p class="empty">لا توجد موضوعات مخصصة حتى الآن. استخدم الموضوعات المدمجة أو أضف موضوعات جديدة.</p>';
  }

  function renderProviders() {
    const pvs = MC.PROVIDERS;
    $("#providersList").innerHTML = pvs.map((p, i) => `
      <div class="card" style="margin-top:10px;padding:15px;background:var(--cream)">
        <strong>${esc(p)}</strong>
      </div>`).join("");
  }

  function render() {
    updateStats();
    renderBookings();
    renderSlots();
    renderTopics();
    renderProviders();
  }

  function show(ok) {
    app.hidden = !ok;
    login.hidden = ok;
    if (ok) render();
  }

  /* login */
  $("#loginForm").addEventListener("submit", e => {
    e.preventDefault();
    if ($("#pass").value === MC.ADMIN_PASSWORD) {
      sessionStorage.setItem("mindcare_admin", "1");
      $("#pass").value = "";
      show(true);
    } else {
      $("#loginErr").textContent = "كلمة المرور غير صحيحة";
    }
  });
  $("#logout").addEventListener("click", () => { sessionStorage.removeItem("mindcare_admin"); show(false); });

  /* tabs */
  app.addEventListener("click", e => {
    const t = e.target.closest("[data-tab]");
    if (t) {
      $$("[data-tab]").forEach(b => {
        const on = b === t;
        b.classList.toggle("btn-primary", on);
        b.classList.toggle("btn-soft", !on);
      });
      $("#p-bookings, #p-slots, #p-topics, #p-providers").forEach(el => el.hidden = true);
      document.getElementById("p-" + t.dataset.tab).hidden = false;
      return;
    }

    const a = e.target.closest("[data-a]");
    if (!a) return;

    const { action: act, id } = a.dataset;
    if (act === "confirmed" || act === "cancelled") MC.setStatus(id, act);
    else if (act === "del") { if (!confirm("حذف الطلب نهائيًا؟")) return; MC.delBooking(id); }
    else if (act === "delslot") { if (!confirm("حذف هذا الموعد؟")) return; MC.delSlot(id); }
    else if (act === "deltopic") { if (!confirm("حذف هذا الموضوع؟")) return; MC.delTopic(id); }
    render();
  });

  /* add slots */
  $("#sProv").innerHTML = MC.PROVIDERS.map(p => `<option>${esc(p)}</option>`).join("");
  $("#sDate").min = new Date().toLocaleDateString("en-CA");

  $("#slotForm").addEventListener("submit", e => {
    e.preventDefault();
    const provider = $("#sProv").value, date = $("#sDate").value;
    const times = $("#sTimes").value.split(/[,،]/).map(x => x.trim()).filter(Boolean).map(x => x.replace(/^(\d):/, "0$1:"));
    const bad = times.filter(x => !/^([01]\d|2[0-3]):[0-5]\d$/.test(x));
    if (!date || !times.length || bad.length) {
      $("#slotMsg").textContent = "❌ اكتب الأوقات بصيغة 10:00, 11:30, 14:00";
      return;
    }
    const added = times.filter(x => MC.addSlot(provider, date, x)).length;
    $("#slotMsg").textContent = `✓ تمت إضافة ${added} موعد` + (added < times.length ? " (المواعيد المكررة تم تجاهلها)" : "");
    $("#sTimes").value = "";
    render();
  });

  /* add topic */
  $("#topicForm").addEventListener("submit", e => {
    e.preventDefault();
    const key = $("#tKey").value.trim().toLowerCase().replace(/\s+/g, "-");
    const title = $("#tTitle").value.trim();
    const intro = $("#tIntro").value.trim();
    const symptoms = $("#tSymptoms").value.split(/[,،]/).map(x => x.trim()).filter(Boolean);

    if (!key || !title || !intro || !symptoms.length) {
      $("#topicMsg").textContent = "❌ املأ جميع الحقول";
      return;
    }

    MC.addTopic(key, { title, intro, symptoms, effects: [], when: "استشر مختص إذا استمرت الأعراض" });
    $("#topicMsg").textContent = `✓ تمت إضافة الموضوع: ${title}`;
    $("#topicForm").reset();
    render();
  });

  /* live refresh on storage change */
  window.addEventListener("storage", () => { if (!app.hidden) render(); });

  show(sessionStorage.getItem("mindcare_admin") === "1");
})();
