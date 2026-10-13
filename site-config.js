/* =========================================================
   SITE SETTINGS  |  إعدادات الموقع
   هنا أماكن: (1) اللوجو  (2) رابط صفحة فيسبوك
   Places for: (1) the logo  (2) the Facebook page link
   ---------------------------------------------------------
   (1) اللوجو | LOGO
   - ضع ملف اللوجو في نفس مجلد index.html (مثال: logo.png أو logo.svg)
   - اكتب اسم الملف في logo.src بالأسفل، مثال:  src: "logo.png"
   - ارفع الملفات: يظهر اللوجو تلقائيًا في رأس الموقع وفوتر الموقع وصفحة الحجز
   - لو تركت src فاضي ("") يفضل الشكل الحالي (أيقونة الورقة). لو اسم الملف غلط يفضل الشكل الحالي برضه.
   - Put the logo file next to index.html, write its name in logo.src. Leave "" to keep the leaf icon.

   (2) فيسبوك وإنستغرام | FACEBOOK AND INSTAGRAM
   - الأيقونتين في فوتر الموقع، ولما تكتب الرابط في social.facebook أو social.instagram
     بتتحول الأيقونة تلقائيًا لرابط يفتح الصفحة في تبويب جديد.
   - لو سيبت الرابط فاضي ("") بتفضل الأيقونة ظاهرة باهتة ومش بتفتح حاجة.
   - لو عايز الأيقونة تختفي تمامًا لحد ما الرابط يجهز: خلّي showUntilReady: false
   - Both icons sit in the footer. Paste a page link to activate its icon (opens in a new tab);
     leave "" for a dimmed, inactive icon (or set showUntilReady: false to hide it until then).

   مهم: سيب سطر <script src="site-config.js"> قبل <script src="script.js"> في آخر الصفحة.
   ========================================================= */
window.MINDCARE_SITE = {
    logo: {
        src: "logo.png",         // اسم ملف اللوجو (موجود جنب index.html)
        alt: "MindCare",         // النص البديل للصورة
        hideBrandName: false     // true = إخفاء كلمة MindCare جنب اللوجو (لو اللوجو فيه الاسم)
    },
    social: {
        facebook: "https://www.facebook.com/share/1bhkZc5Luf/",
        instagram: "https://www.instagram.com/mind.care.mh?vrfl=MTViZmF3b2gzOGc5bA==",
        showUntilReady: true           // true = الأيقونة ظاهرة وباهتة لحد ما تحط الرابط | false = مخفية لحد ما تحط الرابط
    }
};

(function applySiteSettings() {
    var site = window.MINDCARE_SITE || {};
    var logo = site.logo || {};
    var social = site.social || {};

    function applyLogo() {
        if (!logo.src) return;
        document.querySelectorAll(".brand-mark, .booking-brand-mark").forEach(function (mark) {
            if (mark.getAttribute("data-logo-started")) return;
            mark.setAttribute("data-logo-started", "1");
            var original = mark.innerHTML;
            var image = new Image();
            image.className = "brand-logo-img";
            image.alt = logo.alt || "MindCare";
            image.decoding = "async";
            image.onload = function () {
                mark.classList.add("has-logo");
                mark.innerHTML = "";
                mark.appendChild(image);
                if (logo.hideBrandName) document.documentElement.classList.add("logo-hides-name");
            };
            image.onerror = function () { mark.innerHTML = original; };   /* wrong file name: keep the icon */
            image.src = logo.src;
        });
    }

    function applySocial(name, activeLabel) {
        var url = String(social[name] || "").trim();
        var ready = /^https?:\/\//i.test(url);
        var showUntilReady = social.showUntilReady !== undefined ? social.showUntilReady : social.showFacebookUntilReady;
        document.querySelectorAll("[data-social='" + name + "']").forEach(function (item) {
            if (ready) {
                item.setAttribute("href", url);
                item.setAttribute("target", "_blank");
                item.setAttribute("rel", "noopener noreferrer");
                item.removeAttribute("role");
                item.classList.remove("is-pending");
                item.setAttribute("aria-label", activeLabel);
                item.setAttribute("title", activeLabel);
                item.hidden = false;
            } else if (showUntilReady === false) {
                item.hidden = true;
            }
        });
    }

    function applySocialLinks() {
        applySocial("facebook", "صفحتنا على فيسبوك");
        applySocial("instagram", "صفحتنا على إنستغرام");
        document.querySelectorAll(".social-links").forEach(function (row) {
            var anyVisible = Array.prototype.some.call(row.querySelectorAll(".social-link"), function (item) { return !item.hidden; });
            row.hidden = !anyVisible;
        });
    }

    function run() { applyLogo(); applySocialLinks(); }
    run();                                                    /* the script sits after the page content, so this works right away */
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);   /* safety net if it is moved to the top */
})();
