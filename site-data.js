/* =========================================================
   SITE DATA  |  بيانات الموقع من لوحة التحكم
   يقرأ المختصين والأقسام اللي بتديرهم من لوحة التحكم (Firestore) ويسلّمهم لصفحة الموقع.
   لو مفيش اتصال أو لسه ما أضفتش مختصين في اللوحة، بيفضل الوصف الأساسي الموجود في script.js زي ما هو.
   Reads the specialists and the sections managed in the dashboard and hands them to the page.
   On any problem (offline, nothing added yet) the built-in profiles in script.js simply stay.
   ========================================================= */
(function readSpecialistsFromDashboard() {
    var config = window.MINDCARE_FIREBASE_CONFIG;
    if (!config) return;

    function start() {
        /* script.js sets these hooks up once the page is ready, so they are checked here, not earlier */
        if (typeof window.mindcareSetProviders !== "function" && typeof window.mindcareSetTopics !== "function") return;
        Promise.all([
            import("https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js"),
            import("https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js")
        ]).then(function (modules) {
            var app = modules[0].getApps().length ? modules[0].getApps()[0] : modules[0].initializeApp(config);
            var firestore = modules[1];
            var db = firestore.getFirestore(app);
            function read(name, hook) {
                return firestore.getDocs(firestore.query(firestore.collection(db, name), firestore.where("active", "==", true))).then(function (snapshot) {
                    var rows = snapshot.docs.map(function (item) {
                        var data = item.data();
                        data.id = item.id;
                        return data;
                    });
                    if (typeof window[hook] === "function") window[hook](rows);
                }).catch(function () { /* keep what the page already shows */ });
            }
            return Promise.all([read("providers", "mindcareSetProviders"), read("topics", "mindcareSetTopics")]);
        }).catch(function () { /* keep what the page already shows */ });
    }

    /* after the page has finished loading, so it never slows the first view */
    if (document.readyState === "complete") setTimeout(start, 400);
    else window.addEventListener("load", function () { setTimeout(start, 400); });
})();
