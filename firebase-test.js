import { getFirestore, collection, getDocs } from
    "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const db = window.MC_FIREBASE.db;

async function testFirebase() {
    try {
        const snapshot = await getDocs(collection(db, "slots"));

        console.log(
            "MindCare Firebase OK - slots:",
            snapshot.size
        );

    } catch (error) {
        console.error(
            "MindCare Firebase Error:",
            error
        );
    }
}

testFirebase();
