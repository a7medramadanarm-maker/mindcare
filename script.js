here/* =========================================================
   MindCare - Main Frontend Script (script.js)
========================================================= */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. القائمة الجانبية للموبايل ---
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('mobile-open');
        });

        // إغلاق القائمة عند النقر على أي رابط
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('mobile-open');
            });
        });
    }

    // --- 2. نظام النوافذ المنبثقة (Modals) ---
    function openModal(modal) {
        if (!modal) return;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // إغلاق أي نافذة عند الضغط على زر الإغلاق أو الخلفية المظلمة
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
        btn.addEventListener('click', () => {
            const activeModal = btn.closest('.modal');
            closeModal(activeModal);
        });
    });

    // --- 3. نافذة الحجز (Booking Modal) ---
    const bookingModal = document.getElementById('bookingModal');
    const bookingForm = document.getElementById('bookingForm');
    const bookingProviderSelect = document.getElementById('bookingProvider');
    const bookingSuccessMsg = document.getElementById('bookingSuccess');

    // فتح نافذة الحجز مع تحديد المختص تلقائيًا إذا كان محددًا
    document.querySelectorAll('[data-open-booking]').forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedProvider = btn.getAttribute('data-selected-provider');
            if (selectedProvider && bookingProviderSelect) {
                bookingProviderSelect.value = selectedProvider;
            }
            if (bookingSuccessMsg) bookingSuccessMsg.textContent = '';
            openModal(bookingModal);
        });
    });

    // معالجة إرسال نموذج الحجز
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = {
                name: document.getElementById('bookingName').value,
                phone: document.getElementById('bookingPhone').value,
                provider: bookingProviderSelect ? bookingProviderSelect.value : '',
                date: document.getElementById('bookingDate').value,
                message: document.getElementById('bookingMessage').value
            };

            if (typeof Store !== 'undefined') {
                Store.addBooking(formData);
                bookingSuccessMsg.textContent = 'تم إرسال طلب الحجز بنجاح! سنتواصل معك قريبًا.';
                bookingForm.reset();

                setTimeout(() => {
                    closeModal(bookingModal);
                    bookingSuccessMsg.textContent = '';
                }, 2500);
            }
        });
    }

    // --- 4. الأسئلة الشائعة (FAQ Accordion) ---
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const faqItem = btn.closest('.faq-item');
            
            // إغلاق العنصر إذا كان مفتوحًا أو فتح العنصر المحدد
            const isOpen = faqItem.classList.contains('open');
            document.querySelectorAll('.faq-item').forEach(item => item.classList.remove('open'));
            
            if (!isOpen) {
                faqItem.classList.add('open');
            }
        });
    });

    // --- 5. تبديل اللغة (شكلي) ---
    const languageSwitch = document.getElementById('languageSwitch');
    if (languageSwitch) {
        languageSwitch.addEventListener('click', () => {
            languageSwitch.textContent = languageSwitch.textContent.trim() === 'EN' ? 'AR' : 'EN';
        });
    }
});
