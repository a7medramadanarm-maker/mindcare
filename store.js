/* MindCare data layer (localStorage).
   The site and admin only talk to window.MC, so to go multi-device later
   replace the bodies of these functions with Firebase/Supabase calls. */
(function () {
  "use strict";
  const P = "mindcare_";
  const rd = (k, d) => { try { return JSON.parse(localStorage.getItem(P + k)) || d; } catch (e) { return d; } };
  const wr = (k, v) => localStorage.setItem(P + k, JSON.stringify(v));
  const uid = () => Math.random().toString(36).slice(2, 7).toUpperCase();
  const today = () => new Date().toLocaleDateString("en-CA");
  const when = s => s.date + " " + s.time;

  window.MC = {
    ADMIN_PASSWORD: "a15330aF", // غيّرها قبل النشر
    WHATSAPP: "201003089153",
    PROVIDERS: ["Tasbeh Mohamed", "Mariam Mahmoud"],

    esc: s => String(s == null ? "" : s).replace(/[&<>"']/g, c => "&#" + c.charCodeAt(0) + ";"),

    /* ===== SLOTS ===== */
    slots: () => rd("slots", []).sort((a, b) => when(a).localeCompare(when(b))),
    bookings: () => rd("bookings", []).sort((a, b) => b.created - a.created),
    freeSlots(provider) {
      return this.slots().filter(s => !s.booked && s.date >= today() && (!provider || s.provider === provider));
    },
    addSlot(provider, date, time) {
      const all = rd("slots", []);
      if (all.some(s => s.provider === provider && s.date === date && s.time === time)) return false;
      all.push({ id: uid(), provider, date, time, booked: false });
      wr("slots", all);
      return true;
    },
    delSlot(id) { wr("slots", rd("slots", []).filter(s => s.id !== id)); },

    /* ===== BOOKINGS ===== */
    addBooking(d) {
      const slots = rd("slots", []);
      const slot = slots.find(s => s.id === d.slotId && !s.booked);
      if (slot) { slot.booked = true; wr("slots", slots); }
      const b = {
        id: uid(), name: d.name, phone: d.phone, message: d.message || "",
        provider: slot ? slot.provider : (d.provider || ""),
        slotId: slot ? slot.id : "",
        when: slot ? slot.date + " — " + slot.time : "",
        status: "pending", created: Date.now()
      };
      wr("bookings", [...rd("bookings", []), b]);
      return b;
    },
    setStatus(id, status) {
      const all = rd("bookings", []);
      const b = all.find(x => x.id === id);
      if (!b) return;
      b.status = status;
      wr("bookings", all);
      if (status === "cancelled" && b.slotId) {
        const slots = rd("slots", []);
        const s = slots.find(x => x.id === b.slotId);
        if (s) { s.booked = false; wr("slots", slots); }
      }
    },
    delBooking(id) { wr("bookings", rd("bookings", []).filter(b => b.id !== id)); },

    /* ===== TOPICS (جديد) ===== */
    topics: () => rd("topics", {}),
    addTopic(key, data) {
      const all = rd("topics", {});
      all[key] = { ...data, id: key };
      wr("topics", all);
      return all[key];
    },
    delTopic(key) {
      const all = rd("topics", {});
      delete all[key];
      wr("topics", all);
    },
    getTopic(key) {
      return this.topics()[key] || null;
    }
  };
})();
