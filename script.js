/* =========================================================
   MindCare Mental Wellness
   Main JavaScript
   Prepared By: Eng Ahmad Ramadan
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       CONFIG
    ===================================================== */

    /* Safe browser storage: never throws when storage is blocked (private/in-app browsers) or holds bad data */
    const safeStorage = {
        get(key) {
            try { return window.localStorage.getItem(key); } catch { return null; }
        },
        set(key, value) {
            try { window.localStorage.setItem(key, value); return true; } catch { return false; }
        },
        getList(key) {
            try {
                const parsed = JSON.parse(window.localStorage.getItem(key) || "[]");
                return Array.isArray(parsed) ? parsed : [];
            } catch { return []; }
        }
    };

    let currentLanguage = safeStorage.get("mindcare-language") === "en" ? "en" : "ar";

    /* =====================================================
       ENGLISH FOR THE STATIC PAGE TEXT
       The Arabic text stays in index.html (one source of truth);
       the English version below is swapped in when the page is in English.
    ===================================================== */
    const EN_TEXT = {
        "الرئيسية": "Home",
        "كيف تعمل": "How It Works",
        "الصحة النفسية": "Mental Health",
        "دليل التوعية": "Awareness Guide",
        "أساليبنا العلاجية": "Therapeutic Approaches",
        "الجلسة الأولى": "First Session",
        "مكتبة التوعية": "Education Library",
        "المختصون": "Specialists",
        "الأسئلة الشائعة": "FAQ",
        "ابدأ الحجز": "Start booking",
        "استكشف المختصين": "Explore specialists",
        "خصوصيتك وراحتك جزء أساسي من التجربة": "Your privacy and comfort are a core part of the experience",
        "مساحة آمنة": "Safe space",
        "خذ وقتك": "Take your time",
        "افهم نفسك بشكل أفضل": "Understand yourself better",
        "خطوة صغيرة نحو فهم مشاعرك قد تكون بداية تغيير مهم.": "A small step toward understanding your feelings can be the start of an important change.",
        "وقتك": "Your time",
        "اختر الموعد المناسب": "Choose a time that suits you",
        "بدون أحكام": "No judgment",
        "أنت تستحق أن تُفهم": "You deserve to be understood",
        "لماذا MindCare؟": "Why MindCare?",
        "الصحة النفسية ليست فقط وقت الأزمات.": "Mental health isn't only for times of crisis.",
        "قد تحتاج إلى شخص يساعدك على فهم القلق، التعامل مع ضغوط الحياة، تحسين علاقتك بنفسك أو بالآخرين، أو التعامل مع تجربة صعبة مررت بها.": "You may need someone to help you understand anxiety, cope with life's pressures, improve your relationship with yourself or others, or work through a difficult experience you've been through.",
        "استكشف الموضوعات": "Explore topics",
        "افهم ما تمر به": "Understand what you're going through",
        "موضوعات نفسية تستحق أن تعرف عنها أكثر": "Mental health topics worth knowing more about",
        "المعرفة لا تعني تشخيص نفسك. هذه المعلومات تساعدك على فهم بعض العلامات التي قد تستحق التحدث عنها مع مختص.": "Knowing more doesn't mean diagnosing yourself. This information helps you recognize some signs that may be worth discussing with a specialist.",
        "القلق والتوتر": "Anxiety & Stress",
        "افهم القلق وأعراضه وتأثيره على الحياة اليومية.": "Understand anxiety, its symptoms, and its effect on daily life.",
        "اعرف أكثر": "Learn more",
        "الاكتئاب": "Depression",
        "تعرف على العلامات الشائعة للاكتئاب وتأثيره.": "Learn about the common signs of depression and its impact.",
        "نوبات الهلع": "Panic Attacks",
        "تعرف على أعراض نوبات الهلع والفرق بينها وبين القلق.": "Learn about the symptoms of panic attacks and how they differ from anxiety.",
        "الوسواس القهري": "Obsessive-Compulsive Disorder",
        "افهم الأفكار المتكررة والسلوكيات القهرية.": "Understand repetitive thoughts and compulsive behaviors.",
        "الصدمات النفسية": "Trauma & PTSD",
        "تعرف على بعض التأثيرات التي قد تظهر بعد التجارب المؤلمة.": "Learn about some of the effects that can follow painful experiences.",
        "النوم والصحة النفسية": "Sleep & Mental Health",
        "افهم العلاقة بين النوم والمزاج والطاقة والتركيز.": "Understand the link between sleep, mood, energy, and focus.",
        "دليل توعوي مستند إلى DSM-5": "An awareness guide based on the DSM-5",
        "افهم ما تمرّ به": "Understand what you're going through",
        "بهدوء وبدون وصم.": "calmly and without stigma.",
        "خريطة مبسّطة لأصل ومفهوم أشهر الاضطرابات النفسية، صُممت لتساعدك على بدء حوار واعٍ مع نفسك أو مع مختص.": "A simple map of the origins and meaning of the most common mental health conditions, designed to help you start a thoughtful conversation with yourself or with a specialist.",
        "ابدأ الاستكشاف": "Start exploring",
        "ساعدني أختار": "Help me choose",
        "وعي": "Awareness",
        "المعرفة": "Knowledge",
        "بداية آمنة": "A safe start",
        "لا تشخّص": "Don't diagnose",
        "نفسك وحدك": "yourself alone",
        "مسار سريع": "Quick path",
        "ما الذي تريد فهمه أكثر؟": "What would you like to understand more?",
        "اختر اهتمامك وسنرتّب لك البطاقات المناسبة تلقائيًا.": "Pick your area of interest and we'll arrange the right cards for you automatically.",
        "القلق والخوف": "Anxiety and fear",
        "المزاج والطاقة": "Mood and energy",
        "الصدمات والعلاقات": "Trauma and relationships",
        "علاقتي بجسدي": "My relationship with my body",
        "مكتبة الوعي": "Awareness library",
        "اضطرابات تستحق أن تعرف عنها أكثر": "Conditions worth knowing more about",
        "0 موضوع": "0 topics",
        "الكل": "All",
        "القلق": "Anxiety",
        "المزاج": "Mood",
        "الصدمات والشخصية": "Trauma & personality",
        "الأكل والجسد": "Eating & body",
        "لم نعثر على تطابق": "No matches found",
        "جرّب كلمة أخرى أو استعرض كل الموضوعات.": "Try another word or browse all topics.",
        "عرض الكل": "Show all",
        "تنبيه مهم:": "Important note:",
        "هذه النبذة للتوعية والتثقيف النفسي فقط، ولا تُعد بديلًا عن التقييم الإكلينيكي المباشر أو التشخيص المهني. وجود بعض العلامات لا يعني بالضرورة وجود اضطراب.": "This summary is for awareness and psychoeducation only and is not a substitute for a direct clinical assessment or professional diagnosis. Having some of these signs does not necessarily mean you have a disorder.",
        "الدعم بدون أحكام": "Support without judgment",
        "الإدمان واستخدام المواد": "Addiction & Substance Use",
        "طلب المساعدة ليس علامة ضعف. اضطراب استخدام المواد قد يؤثر على الصحة والعلاقات والدراسة أو العمل والقدرة على التحكم في الاستخدام.": "Asking for help is not a sign of weakness. Substance use disorder can affect health, relationships, studies or work, and the ability to control use.",
        "صعوبة التحكم في الاستخدام": "Difficulty controlling use",
        "استمرار الاستخدام رغم الأضرار": "Continued use despite harm",
        "تأثيره على العلاقات أو العمل أو الدراسة": "Impact on relationships, work, or studies",
        "تعرف على الإدمان": "Learn about addiction",
        "هناك دائمًا خطوة تالية.": "There is always a next step.",
        "فهم المشكلة وطلب الدعم قد يكونان بداية مهمة.": "Understanding the problem and asking for support can be an important beginning.",
        "علاقتك بنفسك": "Your relationship with yourself",
        "الثقة بالنفس وتقدير الذات": "Self-Esteem & Confidence",
        "كيف تنظر إلى نفسك يؤثر على كثير من اختياراتك. انخفاض تقدير الذات قد يظهر في صورة نقد مستمر للنفس، مقارنة بالآخرين، خوف من الفشل أو صعوبة في وضع الحدود.": "How you see yourself shapes many of your choices. Low self-esteem can show up as constant self-criticism, comparing yourself with others, fear of failure, or difficulty setting boundaries.",
        "استكشف الموضوع": "Explore the topic",
        "قيمتك ليست مرتبطة بالكمال.": "Your worth isn't tied to being perfect.",
        "العلاقات": "Relationships",
        "أحيانًا المشكلة ليست في الحب، بل في طريقة التواصل.": "Sometimes the problem isn't love, but the way we communicate.",
        "يمكن للدعم المتخصص أن يساعدك على فهم أنماط التواصل، الحدود، الخلافات المتكررة، الغيرة، التعلق والانفصال.": "Specialized support can help you understand communication patterns, boundaries, recurring conflicts, jealousy, attachment, and separation.",
        "العلاقات العاطفية": "Romantic Relationships",
        "العلاقات الأسرية": "Family Relationships",
        "التواصل والحدود": "Communication & Boundaries",
        "أساليبنا العلاجية، بوضوح وبدون تعقيد.": "Our therapeutic approaches, clear and uncomplicated.",
        "لا توجد رحلة واحدة تناسب الجميع. نتعرف أولًا على احتياجك، ثم نختار النهج الذي يساعدك على بناء خطوات عملية وآمنة.": "There is no single journey that fits everyone. We first get to know what you need, then choose the approach that helps you build practical, safe steps.",
        "العلاج المعرفي السلوكي": "Cognitive Behavioral Therapy (CBT)",
        "يركز على فهم العلاقة المتبادلة بين الأفكار، المشاعر، والسلوكيات. يساعدك على التعرف على أنماط التفكير السلبية واكتساب مهارات عملية لتعديلها ومواجهة مواقف الحياة اليومية بكفاءة.": "Focuses on understanding how thoughts, feelings, and behaviors affect one another. It helps you recognize negative thinking patterns and gain practical skills to change them and handle everyday situations more effectively.",
        "الأنسب لـ": "Best suited for",
        "القلق، التوتر، الاكتئاب، والتحكم في الضغوط.": "Anxiety, stress, depression, and managing pressure.",
        "كيف يعمل؟": "How does it work?",
        "نحوّل الملاحظة إلى مهارة: نفهم النمط، نجرّب طريقة جديدة، ثم نراجع ما تعلّمناه معًا.": "We turn observation into skill: we understand the pattern, try a new way, then review what we've learned together.",
        "العلاج الجدلي السلوكي": "Dialectical Behavior Therapy (DBT)",
        "يركز على أربعة محاور: التنظيم الانفعالي، تحمل الضغوط، الحضور الذهني، وفعالية العلاقات. يساعدك على تقبل المشاعر القوية وإدارتها بمرونة.": "Focuses on four areas: emotion regulation, distress tolerance, mindfulness, and interpersonal effectiveness. It helps you accept strong emotions and manage them flexibly.",
        "التقلبات المزاجية، حدة المشاعر، صعوبات التنظيم الانفعالي، وتحديات العلاقات.": "Mood swings, intense emotions, difficulty regulating emotions, and relationship challenges.",
        "نتمرّن على مهارات قصيرة قابلة للاستخدام في لحظات الضغط، بدل انتظار أن تختفي المشاعر وحدها.": "We practice short skills you can use in moments of pressure, instead of waiting for feelings to fade on their own.",
        "التقييم والاختبارات النفسية الإكلينيكية": "Clinical Assessment and Psychological Testing",
        "استخدام أدوات ومقاييس نفسية معتمدة علميًا لفهم طبيعة التحديات بدقة وبناء صورة إكلينيكية واضحة تُبنى عليها الخطة العلاجية الفردية.": "Using scientifically validated psychological tools and scales to understand your challenges accurately and build a clear clinical picture on which your individual treatment plan is based.",
        "استكشاف الأعراض، تحديد الأولويات العلاجية، ومتابعة التطور.": "Exploring symptoms, setting treatment priorities, and tracking progress.",
        "ماذا يشمل؟": "What does it include?",
        "الاختبار جزء من التقييم وليس حكمًا نهائيًا؛ تُفسّر نتائجه داخل السياق الكامل لتجربتك.": "Testing is one part of the assessment, not a final verdict; its results are interpreted within the full context of your experience.",
        "ماذا تتوقع": "What to expect",
        "في الجلسة الأولى؟": "in your first session?",
        "البداية لا تحتاج إلى إجابات مثالية. يكفي أن تأتي كما أنت، ونبني الصورة معًا خطوة بخطوة.": "You don't need perfect answers to begin. Just come as you are, and we'll build the picture together, step by step.",
        "التعارف والمساحة الآمنة": "Getting to know each other and a safe space",
        "مساحة هادئة وسرية للحديث عما تمر به دون أحكام، مع شرح أسلوب العمل وضوابط الخصوصية.": "A calm, confidential space to talk about what you're going through without judgment, along with an explanation of how we work and our privacy safeguards.",
        "استكشاف التحديات والتقييم الأول": "Exploring challenges and the first assessment",
        "فهم الأسباب والضغوط التي دفعتك لطلب الدعم، ومراجعة التاريخ النفسي والحياتي بشكل مبسط.": "Understanding the reasons and pressures that led you to seek support, and a simple review of your psychological and life history.",
        "تحديد الأهداف والخطة العلاجية": "Setting goals and the treatment plan",
        "الاتفاق المتبادل على الأهداف، وتحديد عدد الجلسات المبدئي والنهج المناسب لرحلتك.": "Agreeing together on goals and deciding the initial number of sessions and the approach that suits your journey.",
        "مختصون": "Specialists",
        "اختر المساحة التي تناسبك.": "Choose the space that suits you.",
        "تعرف على كل مختص قبل اتخاذ قرار الحجز.": "Get to know each specialist before deciding to book.",
        "متخصصة في علم النفس الإكلينيكي، مع اهتمام بالصحة النفسية والعلاقات والنمو الشخصي.": "Specializes in clinical psychology, with an interest in mental health, relationships, and personal growth.",
        "عرض الملف": "View profile",
        "احجز موعد": "Book an appointment",
        "متخصصة في علم النفس الإكلينيكي، مع اهتمام بالمشاعر والعلاقات والتحديات الشخصية.": "Specializes in clinical psychology, with an interest in emotions, relationships, and personal challenges.",
        "كيف تعمل MindCare": "How MindCare works",
        "خطوات بسيطة نحو دعم يناسبك.": "Simple steps toward support that suits you.",
        "استكشف": "Explore",
        "تعرف على الموضوعات النفسية والمجالات التي قد تكون قريبة من تجربتك.": "Learn about the mental health topics and areas that may be close to your experience.",
        "اختر المختص": "Choose a specialist",
        "تعرف على المختصين واختر الشخص الذي يناسب احتياجك.": "Get to know the specialists and choose the person who fits your needs.",
        "اختر موعدك": "Choose your time",
        "اختر اليوم والوقت المناسبين لك.": "Pick the day and time that work for you.",
        "ابدأ": "Start",
        "أكمل بيانات الحجز وابدأ خطوتك القادمة.": "Complete your booking details and take your next step.",
        "تقييم مبدئي": "Initial assessment",
        "هل ما أشعر به يستحق أن أتحدث عنه مع مختص؟": "Is what I'm feeling worth talking to a specialist about?",
        "تقييم قصير يساعدك على التفكير في بعض الأعراض وتأثيرها على حياتك. هذا التقييم لا يشخّص أي مرض.": "A short check that helps you reflect on some symptoms and how they affect your life. This assessment does not diagnose any condition.",
        "ابدأ التقييم": "Start the assessment",
        "الخصوصية أولًا": "Privacy first",
        "مساحتك الشخصية تستحق الاحترام.": "Your personal space deserves respect.",
        "نحافظ على مساحة تحترم خصوصيتك وتضع الأمان النفسي في مقدمة كل تواصل.": "We keep a space that respects your privacy and puts psychological safety first in every interaction.",
        "السرية المطلقة": "Absolute confidentiality",
        "تفاصيلك ومحادثاتك تُعامل بسرية تامة.": "Your details and conversations are treated with complete confidentiality.",
        "الأمان الرقمي": "Digital security",
        "نحمي بيانات التواصل وتفاصيل الحجز.": "We protect your contact information and booking details.",
        "الميثاق المهني": "Professional code of ethics",
        "التزام بأخلاقيات علم النفس وقواعد الأمان.": "Commitment to the ethics of psychology and to safety standards.",
        "أسئلة شائعة": "Common questions",
        "كل ما تحتاج معرفته قبل أن تبدأ.": "Everything you need to know before you begin.",
        "اضغط على أي سؤال لعرض الإجابة.": "Tap any question to see the answer.",
        "هل الموقع يشخّص الأمراض النفسية؟": "Does the site diagnose mental health conditions?",
        "لا. المحتوى الموجود هنا للتثقيف وفهم بعض العلامات المحتملة، ولا يحل محل التقييم المهني أو التشخيص من مختص مؤهل.": "No. The content here is for education and for understanding some possible signs, and it does not replace a professional assessment or a diagnosis from a qualified specialist.",
        "كيف أعرف أن الأعراض تستحق طلب المساعدة؟": "How do I know if my symptoms are worth seeking help for?",
        "إذا أصبحت الأعراض مستمرة أو شديدة أو بدأت تؤثر على الدراسة أو العمل أو النوم أو العلاقات أو قدرتك على أداء حياتك اليومية، فقد يكون التحدث مع مختص خطوة مناسبة.": "If symptoms become persistent or severe, or begin to affect your studies, work, sleep, relationships, or your ability to carry out daily life, talking to a specialist may be a suitable step.",
        "هل وجود عرض واحد يعني أنني مصاب بمرض؟": "Does having one symptom mean I have a condition?",
        "ليس بالضرورة. أعراض كثيرة يمكن أن تظهر بسبب الضغط أو قلة النوم أو ظروف حياتية مختلفة، ولذلك التشخيص يحتاج إلى تقييم متخصص وليس إلى عرض منفرد.": "Not necessarily. Many symptoms can appear because of stress, lack of sleep, or different life circumstances, so a diagnosis needs a specialist assessment, not a single symptom.",
        "ماذا لو كنت في خطر فوري؟": "What if I'm in immediate danger?",
        "إذا كنت في خطر فوري أو تخشى أن تؤذي نفسك أو شخصًا آخر، لا تعتمد على الموقع أو نظام الحجز. تواصل فورًا مع خدمات الطوارئ المحلية أو توجه إلى أقرب قسم طوارئ.": "If you are in immediate danger or fear you may hurt yourself or someone else, don't rely on the website or the booking system. Contact local emergency services right away or go to the nearest emergency department.",
        "خطوتك القادمة": "Your next step",
        "ابدأ عندما تكون مستعدًا.": "Begin when you're ready.",
        "لا تحتاج إلى معرفة كل الإجابات قبل طلب الدعم.": "You don't need to know all the answers before asking for support.",
        "مكتبة ومقالات التوعية النفسية": "Mental health awareness library and articles",
        "قراءات قصيرة تساعدك على تسمية ما يحدث وفهمه، دون تحويل التجربة الإنسانية إلى تشخيص ذاتي.": "Short reads that help you name and understand what is happening, without turning a human experience into a self-diagnosis.",
        "القلق والتوتر اليومي": "Everyday anxiety and stress",
        "كيف تميز بين القلق الطبيعي والقلق المجهد؟ وكيف تتعامل مع أعراضه الجسدية؟": "How can you tell normal anxiety from exhausting anxiety? And how do you deal with its physical symptoms?",
        "اقرأ الفكرة": "Read the idea",
        "القلق يصبح مرهقًا عندما يستمر أو يعطّل النوم والعلاقات والعمل. ابدأ بملاحظة الإشارة الجسدية، ثم جرّب زفيرًا أطول من الشهيق واطلب دعمًا إذا استمر التعطيل.": "Anxiety becomes exhausting when it persists or disrupts sleep, relationships, and work. Start by noticing the physical signal, then try an exhale that is longer than your inhale, and ask for support if the disruption continues.",
        "الحدود الصحية في العلاقات": "Healthy boundaries in relationships",
        "أهمية وضع الحدود الشخصية لحماية طاقتك النفسية دون الشعور بالذنب.": "Why setting personal boundaries protects your emotional energy without guilt.",
        "الحد ليس عقابًا ولا رفضًا للشخص الآخر؛ هو توضيح لما تستطيع تقديمه وما تحتاجه كي تبقى العلاقة أكثر احترامًا وتوازنًا.": "A boundary is not a punishment or a rejection of the other person; it clarifies what you can offer and what you need so the relationship stays more respectful and balanced.",
        "التنظيم الانفعالي": "Emotion regulation",
        "خطوات عملية للتعامل مع مشاعر الغضب والحزن عند ظهورها بشكل مفاجئ.": "Practical steps for handling anger and sadness when they appear suddenly.",
        "سمِّ الشعور، خفّف سرعة الاستجابة، ثم اختر خطوة صغيرة آمنة: ماء، تنفس، حركة، أو تأجيل الحوار حتى تهدأ شدة الانفعال.": "Name the feeling, slow down your response, then choose a small, safe step: water, breathing, movement, or postponing the conversation until the intensity settles.",
        "الاحتراق النفسي والمهني": "Emotional and professional burnout",
        "العلامات المبكرة للاحتراق وكيفية استعادة التوازن بين العمل والحياة الشخصية.": "Early signs of burnout and how to restore balance between work and personal life.",
        "راقب الإرهاق المستمر، التبلد، وتراجع الإحساس بالإنجاز. إعادة التوازن تبدأ بحدود واقعية وراحة منتظمة ومشاركة الحمل مع شخص موثوق.": "Watch for constant exhaustion, emotional numbness, and a declining sense of achievement. Restoring balance starts with realistic limits, regular rest, and sharing the load with someone you trust.",
        "تنبيه الحالات الطارئة والأزمات": "Emergency and crisis notice",
        "هذه المنصة ليست بديلًا عن التدخل الفوري.": "This platform is not a substitute for immediate help.",
        "خدمات MindCare جلسات أونلاين مجدولة، وليست مخصصة للأزمات الحادة أو التفكير في إيذاء الذات. في الخطر المباشر توجه لأقرب مستشفى أو اتصل بالطوارئ فورًا.": "MindCare offers scheduled online sessions and is not intended for acute crises or thoughts of self-harm. In direct danger, go to the nearest hospital or call emergency services immediately.",
        "الإسعاف": "Ambulance",
        "نسخ الرقم": "Copy number",
        "مساحة هادئة لفهم الصحة النفسية والوصول إلى الدعم المناسب.": "A calm space to understand mental health and reach the right support.",
        "روابط": "Links",
        "الموضوعات": "Topics",
        "الإدمان": "Addiction",
        "الثقة بالنفس": "Self-confidence",
        "أسئلة تساعدك على التفكير": "Questions to help you reflect",
        "هذا ليس اختبارًا تشخيصيًا. أجب فقط بناءً على الفترة الأخيرة من حياتك.": "This is not a diagnostic test. Answer based only on the recent period of your life.",
        "عرض النتيجة": "Show result",
        "استعد": "Get ready",
        "واتساب والحجز:": "WhatsApp & booking:",
    };
    const EN_ATTR = {
        "فتح القائمة": "Open menu",
        "البحث في دليل الاضطرابات": "Search the conditions guide",
        "تصنيف الاضطرابات": "Condition categories",
        "إغلاق": "Close",
        "ابحث عن اضطراب أو كلمة مفتاحية...": "Search for a condition or keyword...",
        "تواصل معنا عبر واتساب": "Chat with us on WhatsApp",
        "تابعنا على وسائل التواصل": "Follow us on social media",
        "فيسبوك — قريبًا": "Facebook — coming soon",
        "قريبًا": "Coming soon",
        "صفحتنا على فيسبوك": "Our Facebook page",
        "إنستغرام — قريبًا": "Instagram — coming soon",
        "صفحتنا على إنستغرام": "Our Instagram page",
    };
    const i18nNodes = [];
    const i18nAttributes = [];
    (function collectStaticEnglish() {
        const arabicLetters = /[\u0600-\u06FF]/;
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) {
            const parent = node.parentElement;
            if (!parent || parent.closest("script, style, noscript, .nav-link, .specialists-grid, [data-ar][data-en]")) continue;
            if (!arabicLetters.test(node.nodeValue)) continue;
            const english = EN_TEXT[node.nodeValue.replace(/\s+/g, " ").trim()];
            if (english !== undefined) i18nNodes.push({ node, original: node.nodeValue, english });
        }
        document.querySelectorAll("[aria-label], [placeholder], [title]").forEach(element => {
            ["aria-label", "placeholder", "title"].forEach(name => {
                const value = element.getAttribute(name);
                if (value && EN_ATTR[value] !== undefined) i18nAttributes.push({ element, name, original: value, english: EN_ATTR[value] });
            });
        });
    })();
    /* WhatsApp: one number for every link, with a ready first message in the visitor's language */
    const WHATSAPP_NUMBER = "201097524883";
    const WHATSAPP_MESSAGE = {
        ar: "مرحبًا، أود الاستفسار عن حجز موعد في MindCare.",
        en: "Hello, I'd like to ask about booking an appointment at MindCare."
    };
    function updateWhatsAppLinks(lang) {
        document.querySelectorAll("[data-whatsapp]").forEach(link => {
            link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE[lang] || WHATSAPP_MESSAGE.ar)}`;
        });
    }
    function applyStaticEnglish(lang) {
        i18nNodes.forEach(entry => {
            if (!entry.node.isConnected) return;
            if (lang === "en") {
                const lead = entry.original.match(/^\s*/)[0], trail = entry.original.match(/\s*$/)[0];
                entry.node.nodeValue = lead + entry.english + trail;
            } else {
                entry.node.nodeValue = entry.original;
            }
        });
        i18nAttributes.forEach(entry => entry.element.setAttribute(entry.name, lang === "en" ? entry.english : entry.original));
    }


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const languageSwitch = document.getElementById("languageSwitch");
    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");

    const topicModal = document.getElementById("topicModal");
    const providerModal = document.getElementById("providerModal");
    const assessmentModal = document.getElementById("assessmentModal");

    const topicModalContent =
        document.getElementById("topicModalContent");

    const providerModalContent =
        document.getElementById("providerModalContent");

    const assessmentButton =
        document.getElementById("assessmentButton");

    const assessmentQuestions =
        document.getElementById("assessmentQuestions");

    const assessmentResult =
        document.getElementById("assessmentResult");

    const calculateAssessment =
        document.getElementById("calculateAssessment");
    const moodModal = document.getElementById("moodModal");
    const breathingModal = document.getElementById("breathingModal");
    const journalModal = document.getElementById("journalModal");
    const weeklyMood = document.getElementById("weeklyMood");
    const moodSummary = document.getElementById("moodSummary");
    const breathingStage = document.getElementById("breathingStage");
    const breathingPhase = document.getElementById("breathingPhase");
    const breathingTimer = document.getElementById("breathingTimer");
    const startBreathingButton = document.getElementById("startBreathingButton");
    const journalText = document.getElementById("journalText");
    const journalCount = document.getElementById("journalCount");
    const journalStatus = document.getElementById("journalStatus");
    const guideGrid = document.getElementById("guideGrid");
    const guideSearch = document.getElementById("guideSearch");
    const guideCount = document.getElementById("guideCount");
    const guideEmpty = document.getElementById("guideEmpty");
    const guidePath = document.getElementById("guidePath");


    /* =====================================================
       MEDICAL / EDUCATIONAL TOPICS
    ===================================================== */

    const topics = {

        anxiety: {

            icon: "fa-solid fa-wind",

            ar: {
                title: "القلق والتوتر",

                intro:
                    "القلق شعور طبيعي قد يظهر عندما نتوقع خطرًا أو نواجه ضغطًا. يصبح من المهم طلب المساعدة عندما يكون القلق شديدًا أو مستمرًا أو يبدأ في التأثير على الحياة اليومية.",

                symptoms: [
                    "القلق أو الخوف بشكل متكرر",
                    "صعوبة التحكم في الأفكار المقلقة",
                    "الشعور بالتوتر أو عدم القدرة على الاسترخاء",
                    "صعوبة التركيز",
                    "مشكلات في النوم",
                    "تعب أو توتر جسدي",
                    "تجنب بعض المواقف بسبب الخوف أو القلق"
                ],

                help:
                    "إذا أصبح القلق مستمرًا أو شديدًا، أو بدأ يؤثر على الدراسة أو العمل أو النوم أو العلاقات، تحدث مع مختص في الصحة النفسية.",

                sourceName:
                    "National Institute of Mental Health (NIMH)",

                source:
                    "https://" +
                    "www.nimh.nih.gov/health/topics/anxiety-disorders"
            },

            en: {

                title: "Anxiety & Stress",

                intro:
                    "Anxiety is a normal response to stress or perceived danger. Professional support may be helpful when anxiety becomes persistent, intense, or interferes with everyday life.",

                symptoms: [
                    "Frequent worry or fear",
                    "Difficulty controlling worries",
                    "Feeling tense or unable to relax",
                    "Difficulty concentrating",
                    "Sleep problems",
                    "Fatigue or physical tension",
                    "Avoiding situations because of fear or anxiety"
                ],

                help:
                    "Consider speaking with a mental health professional when anxiety becomes persistent, severe, or interferes with school, work, sleep, or relationships.",

                sourceName:
                    "National Institute of Mental Health (NIMH)",

                source:
                    "https://" +
                    "www.nimh.nih.gov/health/topics/anxiety-disorders"
            }
        },


        depression: {

            icon: "fa-regular fa-cloud",

            ar: {

                title: "الاكتئاب",

                intro:
                    "الاكتئاب ليس مجرد حزن عابر. قد يتضمن تغيرات مستمرة في المزاج أو الاهتمام والقدرة على أداء الأنشطة اليومية.",

                symptoms: [
                    "حزن أو فراغ مستمر",
                    "فقدان الاهتمام أو المتعة",
                    "الشعور بالذنب أو عدم القيمة",
                    "انخفاض الطاقة أو التعب",
                    "صعوبة التركيز أو اتخاذ القرارات",
                    "تغيرات في النوم",
                    "تغيرات في الشهية أو الوزن",
                    "الابتعاد عن الآخرين",
                    "أفكار عن الموت أو الانتحار"
                ],

                help:
                    "إذا استمرت الأعراض أو أثرت بشكل واضح على حياتك اليومية، تحدث مع طبيب أو مختص في الصحة النفسية. وجود بعض الأعراض لا يعني تلقائيًا وجود تشخيص.",

                sourceName:
                    "National Institute of Mental Health (NIMH)",

                source:
                    "https://" +
                    "www.nimh.nih.gov/health/publications/depression"
            },

            en: {

                title: "Depression",

                intro:
                    "Depression is more than temporary sadness. It can involve persistent changes in mood, interest, energy, thinking, sleep, and everyday functioning.",

                symptoms: [
                    "Persistent sadness or emptiness",
                    "Loss of interest or pleasure",
                    "Feelings of guilt or worthlessness",
                    "Low energy or fatigue",
                    "Difficulty concentrating or making decisions",
                    "Changes in sleep",
                    "Changes in appetite or weight",
                    "Withdrawal from others",
                    "Thoughts of death or suicide"
                ],

                help:
                    "If symptoms persist or significantly affect daily life, speak with a healthcare or mental health professional. Having some symptoms does not automatically mean you have a diagnosis.",

                sourceName:
                    "National Institute of Mental Health (NIMH)",

                source:
                    "https://" +
                    "www.nimh.nih.gov/health/publications/depression"
            }
        },


        panic: {

            icon: "fa-solid fa-heart-pulse",

            ar: {

                title: "نوبات الهلع",

                intro:
                    "نوبة الهلع هي موجة مفاجئة من الخوف أو الانزعاج الشديد قد تحدث بشكل غير متوقع، وقد يصاحبها عدد من الأعراض الجسدية.",

                symptoms: [
                    "خوف شديد ومفاجئ",
                    "الإحساس بفقدان السيطرة",
                    "تسارع ضربات القلب",
                    "التعرق أو الرعشة",
                    "صعوبة التنفس",
                    "دوخة أو ضعف",
                    "تنميل أو وخز",
                    "ألم في الصدر",
                    "غثيان أو ألم في المعدة",
                    "الخوف من حدوث نوبة أخرى"
                ],

                help:
                    "إذا تكررت النوبات أو بدأت تؤثر على حياتك أو جعلتك تتجنب أماكن أو مواقف معينة، تحدث مع مختص.",

                sourceName:
                    "National Institute of Mental Health (NIMH)",

                source:
                    "https://" +
                    "www.nimh.nih.gov/health/publications/panic-disorder-when-fear-overwhelms"
            },

            en: {

                title: "Panic Attacks",

                intro:
                    "A panic attack is a sudden wave of intense fear or discomfort that can occur unexpectedly and may include strong physical symptoms.",

                symptoms: [
                    "Sudden intense fear",
                    "Feeling out of control",
                    "Racing heart",
                    "Sweating or trembling",
                    "Difficulty breathing",
                    "Dizziness or weakness",
                    "Tingling or numbness",
                    "Chest discomfort",
                    "Nausea or stomach discomfort",
                    "Fear of another attack"
                ],

                help:
                    "If attacks keep happening or begin to affect your life or cause avoidance, consider speaking with a mental health professional.",

                sourceName:
                    "National Institute of Mental Health (NIMH)",

                source:
                    "https://" +
                    "www.nimh.nih.gov/health/publications/panic-disorder-when-fear-overwhelms"
            }
        },


        ocd: {

            icon: "fa-solid fa-arrows-rotate",

            ar: {

                title: "الوسواس القهري",

                intro:
                    "الوسواس القهري اضطراب قد يتضمن أفكارًا أو دوافع أو صورًا متكررة وغير مرغوبة، وسلوكيات متكررة يشعر الشخص بأنه مدفوع للقيام بها.",

                symptoms: [
                    "أفكار متكررة وغير مرغوبة",
                    "الخوف من التلوث أو الجراثيم",
                    "الحاجة إلى الترتيب بشكل دقيق",
                    "التأكد المتكرر من الأشياء",
                    "الغسل أو التنظيف المفرط",
                    "العد أو تكرار كلمات أو أفعال",
                    "استهلاك وقت طويل في الأفكار أو السلوكيات",
                    "تأثير الأعراض على الحياة اليومية"
                ],

                help:
                    "إذا كانت الأفكار أو السلوكيات خارج السيطرة، تستهلك وقتًا كبيرًا أو تسبب ضيقًا أو تعطل حياتك اليومية، فمن المناسب التحدث مع مختص.",

                sourceName:
                    "National Institute of Mental Health (NIMH)",

                source:
                    "https://" +
                    "www.nimh.nih.gov/health/topics/obsessive-compulsive-disorder-ocd"
            },

            en: {

                title: "Obsessive-Compulsive Disorder",

                intro:
                    "OCD can involve recurring unwanted thoughts, urges, or images and repetitive behaviors that a person feels driven to perform.",

                symptoms: [
                    "Repeated unwanted thoughts",
                    "Fear of contamination",
                    "Need for exact order or symmetry",
                    "Repeated checking",
                    "Excessive cleaning",
                    "Counting or repeating behaviors",
                    "Spending significant time on obsessions or compulsions",
                    "Interference with daily life"
                ],

                help:
                    "If symptoms feel difficult to control, take significant time, cause distress, or interfere with daily life, consider speaking with a qualified professional.",

                sourceName:
                    "National Institute of Mental Health (NIMH)",

                source:
                    "https://" +
                    "www.nimh.nih.gov/health/topics/obsessive-compulsive-disorder-ocd"
            }
        },


        trauma: {

            icon: "fa-solid fa-feather",

            ar: {

                title: "الصدمات النفسية",

                intro:
                    "بعد تجربة مؤلمة أو مهددة، قد تظهر مجموعة من الاستجابات مثل الخوف أو الحزن أو الغضب أو صعوبة النوم والتركيز. بعض هذه الاستجابات قد تخف مع الوقت، بينما قد تستمر لدى بعض الأشخاص.",

                symptoms: [
                    "ذكريات أو أحلام مزعجة مرتبطة بالتجربة",
                    "تجنب الأماكن أو الأشياء التي تذكر بالحدث",
                    "الشعور بالتوتر أو التأهب المستمر",
                    "سهولة الاستثارة أو الغضب",
                    "صعوبة النوم",
                    "صعوبة التركيز",
                    "الشعور بالعزلة",
                    "مشاعر مستمرة من الخوف أو الذنب أو العار"
                ],

                help:
                    "إذا استمرت الأعراض وأصبحت تؤثر على العلاقات أو العمل أو الدراسة أو الحياة اليومية، فمن المناسب طلب تقييم من مختص.",

                sourceName:
                    "National Institute of Mental Health (NIMH)",

                source:
                    "https://" +
                    "www.nimh.nih.gov/health/publications/post-traumatic-stress-disorder-ptsd"
            },

            en: {

                title: "Trauma & PTSD",

                intro:
                    "After a traumatic or threatening experience, people may experience fear, sadness, anger, sleep problems, or difficulty concentrating. For many people these reactions decrease over time, while others may continue to experience significant symptoms.",

                symptoms: [
                    "Distressing memories or dreams",
                    "Avoiding reminders of the event",
                    "Feeling constantly alert or tense",
                    "Irritability or anger",
                    "Sleep difficulties",
                    "Difficulty concentrating",
                    "Feeling socially isolated",
                    "Ongoing fear, guilt, or shame"
                ],

                help:
                    "If symptoms continue and interfere with relationships, work, school, or daily life, consider seeking an assessment from a qualified professional.",

                sourceName:
                    "National Institute of Mental Health (NIMH)",

                source:
                    "https://" +
                    "www.nimh.nih.gov/health/publications/post-traumatic-stress-disorder-ptsd"
            }
        },


        sleep: {

            icon: "fa-regular fa-moon",

            ar: {

                title: "النوم والصحة النفسية",

                intro:
                    "النوم الجيد يساعد الدماغ والجسم على العمل بشكل أفضل. نقص النوم قد يؤثر على التركيز والتعلم والذاكرة والمزاج والقدرة على التعامل مع الضغوط.",

                symptoms: [
                    "صعوبة الدخول في النوم",
                    "الاستيقاظ المتكرر",
                    "الاستيقاظ دون الشعور بالراحة",
                    "النعاس أثناء النهار",
                    "صعوبة التركيز",
                    "بطء التفكير أو رد الفعل",
                    "تغيرات في المزاج",
                    "صعوبة التعامل مع الضغوط"
                ],

                help:
                    "إذا كانت مشاكل النوم مستمرة أو تؤثر على نشاطك اليومي، تحدث مع مقدم رعاية صحية أو مختص.",

                sourceName:
                    "National Heart, Lung, and Blood Institute (NHLBI)",

                source:
                    "https://" +
                    "www.nhlbi.nih.gov/health/sleep-deprivation/health-effects"
            },

            en: {

                title: "Sleep & Mental Health",

                intro:
                    "Quality sleep supports healthy brain and body function. Sleep deficiency can affect concentration, learning, memory, mood, and the ability to cope with change.",

                symptoms: [
                    "Difficulty falling asleep",
                    "Repeated waking",
                    "Not feeling refreshed after sleep",
                    "Daytime sleepiness",
                    "Difficulty concentrating",
                    "Slower thinking or reactions",
                    "Mood changes",
                    "Difficulty coping with stress"
                ],

                help:
                    "If sleep problems persist or interfere with daily functioning, consider speaking with a healthcare professional.",

                sourceName:
                    "National Heart, Lung, and Blood Institute (NHLBI)",

                source:
                    "https://" +
                    "www.nhlbi.nih.gov/health/sleep-deprivation/health-effects"
            }
        },


        addiction: {

            icon: "fa-solid fa-hand-holding-heart",

            ar: {

                title: "الإدمان واستخدام المواد",

                intro:
                    "اضطراب استخدام المواد يمكن أن يؤثر على الصحة والعلاقات والمسؤوليات اليومية. طلب الدعم والعلاج خطوة مهمة ويمكن أن يكون جزءًا من رحلة التعافي.",

                symptoms: [
                    "صعوبة تقليل أو التحكم في الاستخدام",
                    "قضاء وقت كبير في الحصول على المادة أو استخدامها",
                    "الاستمرار في الاستخدام رغم المشكلات",
                    "التأثير على العمل أو الدراسة أو الأسرة",
                    "استمرار الاستخدام رغم الأضرار",
                    "ظهور مشكلات صحية أو اجتماعية مرتبطة بالاستخدام"
                ],

                help:
                    "إذا كنت تواجه صعوبة في التحكم في الاستخدام أو يستمر الاستخدام رغم الأضرار، تحدث مع مختص في الصحة النفسية أو علاج الإدمان.",

                sourceName:
                    "Substance Abuse and Mental Health Services Administration (SAMHSA)",

                source:
                    "https://" +
                    "www.samhsa.gov/substance-use/treatment"
            },

            en: {

                title: "Substance Use",

                intro:
                    "Substance use disorder can affect health, relationships, responsibilities, and daily life. Seeking professional support can be an important part of recovery.",

                symptoms: [
                    "Difficulty controlling or reducing use",
                    "Spending significant time obtaining or using substances",
                    "Continuing use despite problems",
                    "Problems at work, school, or home",
                    "Continuing despite physical or emotional harm",
                    "Health or social problems related to use"
                ],

                help:
                    "If you are struggling to control substance use or continue despite harm, consider speaking with a qualified mental health or addiction professional.",

                sourceName:
                    "Substance Abuse and Mental Health Services Administration (SAMHSA)",

                source:
                    "https://" +
                    "www.samhsa.gov/substance-use/treatment"
            }
        },


        "self-esteem": {

            icon: "fa-regular fa-heart",

            ar: {

                title: "الثقة بالنفس وتقدير الذات",

                intro:
                    "تقدير الذات يتعلق بالطريقة التي يرى بها الإنسان نفسه وقيمته. قد تؤثر النظرة السلبية المستمرة للذات على العلاقات والقرارات والقدرة على وضع الحدود.",

                symptoms: [
                    "النقد المستمر للنفس",
                    "الشعور بعدم الكفاية",
                    "المقارنة المستمرة بالآخرين",
                    "الخوف الشديد من الفشل",
                    "صعوبة تقبل الأخطاء",
                    "صعوبة وضع الحدود",
                    "الحاجة المستمرة إلى قبول الآخرين"
                ],

                help:
                    "إذا أصبحت هذه المشاعر تؤثر على حياتك أو علاقاتك أو قراراتك، يمكن أن يساعدك التحدث مع مختص على فهم أنماط التفكير والتعامل معها.",

                sourceName:
                    "MindCare Educational Resource",

                source:
                    "https://" +
                    "www.nimh.nih.gov/health"
            },

            en: {

                title: "Self-Esteem & Confidence",

                intro:
                    "Self-esteem involves how people view themselves and their sense of worth. Persistent negative self-perception can affect relationships, decisions, and boundaries.",

                symptoms: [
                    "Persistent self-criticism",
                    "Feeling inadequate",
                    "Constant comparison with others",
                    "Strong fear of failure",
                    "Difficulty accepting mistakes",
                    "Difficulty setting boundaries",
                    "Strong need for external approval"
                ],

                help:
                    "If these feelings affect your relationships, decisions, or daily life, speaking with a mental health professional may help you understand and work with these patterns.",

                sourceName:
                    "MindCare Educational Resource",

                source:
                    "https://" +
                    "www.nimh.nih.gov/health"
            }
        },


        relationships: {

            icon: "fa-solid fa-heart",

            ar: {

                title: "العلاقات العاطفية",

                intro:
                    "العلاقات الصحية تحتاج إلى التواصل والاحترام والحدود الواضحة. أحيانًا قد تتكرر الخلافات أو تظهر صعوبات في الثقة أو التعلق أو الانفصال.",

                symptoms: [
                    "خلافات متكررة",
                    "صعوبة التواصل",
                    "مشكلات في الثقة",
                    "الغيرة المستمرة",
                    "الخوف من الانفصال",
                    "صعوبة التعبير عن الاحتياجات",
                    "عدم وضوح الحدود"
                ],

                help:
                    "يمكن للدعم المتخصص أن يساعد على فهم أنماط التواصل والتعلق والحدود والتعامل مع الخلافات.",

                sourceName:
                    "MindCare Educational Resource",

                source:
                    "https://" +
                    "www.nimh.nih.gov/health"
            },

            en: {

                title: "Romantic Relationships",

                intro:
                    "Healthy relationships often require communication, respect, and clear boundaries. Repeated conflict, trust problems, attachment concerns, or separation difficulties can be worth discussing.",

                symptoms: [
                    "Repeated conflict",
                    "Communication difficulties",
                    "Trust problems",
                    "Persistent jealousy",
                    "Fear of separation",
                    "Difficulty expressing needs",
                    "Unclear boundaries"
                ],

                help:
                    "Professional support may help people understand communication patterns, attachment, boundaries, and recurring conflicts.",

                sourceName:
                    "MindCare Educational Resource",

                source:
                    "https://" +
                    "www.nimh.nih.gov/health"
            }
        },


        family: {

            icon: "fa-solid fa-house",

            ar: {

                title: "العلاقات الأسرية",

                intro:
                    "العلاقات الأسرية قد تتأثر بالضغوط والخلافات وتغير الأدوار والحدود. فهم طريقة التواصل يمكن أن يساعد على التعامل مع هذه التحديات.",

                symptoms: [
                    "خلافات أسرية متكررة",
                    "صعوبة الحوار",
                    "الشعور بعدم الفهم",
                    "مشكلات في الحدود",
                    "توتر مستمر داخل المنزل",
                    "صعوبة التعبير عن المشاعر"
                ],

                help:
                    "عندما تؤثر الخلافات الأسرية على الحياة اليومية أو العلاقات، يمكن طلب دعم متخصص.",

                sourceName:
                    "MindCare Educational Resource",

                source:
                    "https://" +
                    "www.nimh.nih.gov/health"
            },

            en: {

                title: "Family Relationships",

                intro:
                    "Family relationships can be affected by stress, conflict, changing roles, and unclear boundaries. Understanding communication patterns can help people navigate these challenges.",

                symptoms: [
                    "Repeated family conflict",
                    "Difficulty communicating",
                    "Feeling misunderstood",
                    "Boundary problems",
                    "Ongoing tension at home",
                    "Difficulty expressing emotions"
                ],

                help:
                    "When family conflict significantly affects daily life or relationships, professional support may be useful.",

                sourceName:
                    "MindCare Educational Resource",

                source:
                    "https://" +
                    "www.nimh.nih.gov/health"
            }
        },


        communication: {

            icon: "fa-solid fa-comments",

            ar: {

                title: "التواصل والحدود",

                intro:
                    "التواصل الصحي لا يعني أن نتفق دائمًا، لكنه يتضمن القدرة على التعبير عن الاحتياجات والاستماع للآخرين ووضع حدود واضحة.",

                symptoms: [
                    "صعوبة التعبير عن الاحتياجات",
                    "الخوف من قول لا",
                    "تجنب المواجهة دائمًا",
                    "الغضب بسبب عدم وضوح الحدود",
                    "صعوبة الاستماع أثناء الخلاف",
                    "الشعور بأن الآخرين يتجاوزون حدودك"
                ],

                help:
                    "إذا أصبحت صعوبات التواصل والحدود تؤثر بشكل مستمر على علاقاتك، يمكن مناقشتها مع مختص.",

                sourceName:
                    "MindCare Educational Resource",

                source:
                    "https://" +
                    "www.nimh.nih.gov/health"
            },

            en: {

                title: "Communication & Boundaries",

                intro:
                    "Healthy communication does not require constant agreement. It involves expressing needs, listening, and maintaining clear and respectful boundaries.",

                symptoms: [
                    "Difficulty expressing needs",
                    "Fear of saying no",
                    "Avoiding difficult conversations",
                    "Anger caused by unclear boundaries",
                    "Difficulty listening during conflict",
                    "Feeling that others repeatedly cross your boundaries"
                ],

                help:
                    "If communication and boundary difficulties repeatedly affect your relationships, consider discussing them with a qualified professional.",

                sourceName:
                    "MindCare Educational Resource",

                source:
                    "https://" +
                    "www.nimh.nih.gov/health"
            }
        }

    };


    /* =====================================================
       SPECIALISTS
       The profiles below are the built-in text, written exactly as the owner gave it.
       When the dashboard has specialists, site-data.js passes them to
       window.mindcareSetProviders() and they take over (see "SPECIALISTS: cards and profile popup").
    ===================================================== */

    const builtInSpecialists = [
            {
                    "id": "tasbeh",
                    "nameAr": "تسبيح محمد",
                    "nameEn": "Tasbeh Mohamed",
                    "specialtyAr": "أخصائية نفسية إكلينيكية (Clinical Psychologist)",
                    "specialtyEn": "Clinical Psychologist",
                    "qualificationsAr": [
                            "خريجة برنامج علم النفس الإكلينيكي",
                            "حاصلة على دبلومة علم النفس الإكلينيكي"
                    ],
                    "qualificationsEn": [
                            "Graduate of the Clinical Psychology program",
                            "Holds a diploma in Clinical Psychology"
                    ],
                    "bioAr": "أخصائية نفسية إكلينيكية متخصصة في تقديم الدعم والتقييم النفسي والعلاج الإكلينيكي. تركز على مساعدة الأفراد في التعامل مع مشاعر القلق، التنظيم الانفعالي، الضغوط النفسية، وتحديات العلاقات، وتطوير مهارات التكيف والنمو الذاتي.",
                    "bioEn": "A clinical psychologist specializing in psychological support, assessment, and clinical therapy. She focuses on helping individuals cope with feelings of anxiety, emotional regulation, psychological stress, and relationship challenges, and on developing coping skills and personal growth.",
                    "areasAr": [
                            "اضطرابات القلق والتوتر",
                            "التنظيم الانفعالي وإدارة المشاعر",
                            "تقدير الذات والنمو الشخصي",
                            "العلاقات والضغوط النفسية"
                    ],
                    "areasEn": [
                            "Anxiety and stress disorders",
                            "Emotional regulation and managing feelings",
                            "Self-esteem and personal growth",
                            "Relationships and psychological stress"
                    ],
                    "approachAr": [
                            "العلاج المعرفي السلوكي (CBT)",
                            "العلاج الجدلي السلوكي (DBT)",
                            "التقييمات والاختبارات النفسية الإكلينيكية المعتمدة"
                    ],
                    "approachEn": [
                            "Cognitive Behavioral Therapy (CBT)",
                            "Dialectical Behavior Therapy (DBT)",
                            "Accredited clinical psychological assessments and tests"
                    ],
                    "philosophyAr": "أؤمن أن رحلة التعافي تبدأ من توفير مساحة آمنة وخالية من الأحكام، لنعمل معًا وفق أسس علمية ودقيقة على فهم أسباب الضغط النفسي واستعادة التوازن والصحة النفسية.",
                    "philosophyEn": "I believe that the journey of recovery begins with providing a safe, judgment-free space, so that together we can work, on precise scientific foundations, to understand the causes of psychological stress and restore balance and mental health."
            },
            {
                    "id": "mariam",
                    "nameAr": "مريم محمود",
                    "nameEn": "Mariam Mahmoud",
                    "specialtyAr": "أخصائية نفسية إكلينيكية (Clinical Psychologist)",
                    "specialtyEn": "Clinical Psychologist",
                    "qualificationsAr": [
                            "خريجة برنامج علم النفس الإكلينيكي",
                            "حاصلة على دبلومة علم النفس الإكلينيكي"
                    ],
                    "qualificationsEn": [
                            "Graduate of the Clinical Psychology program",
                            "Holds a diploma in Clinical Psychology"
                    ],
                    "bioAr": "أخصائية نفسية إكلينيكية تركز على تقديم الدعم النفسي للأفراد لمساعدتهم على التعامل مع التوتر اليومي، رفع تقدير الذات، تجاوز التحديات الحياتية، وبناء علاقات صحية ومتوازنة.",
                    "bioEn": "A clinical psychologist who focuses on providing psychological support to individuals, helping them cope with everyday stress, raise self-esteem, overcome life challenges, and build healthy, balanced relationships.",
                    "areasAr": [
                            "إدارة التوتر والضغوط اليومية",
                            "تعزيز تقدير الذات والنمو الشخصي",
                            "العلاقات الإنسانية والتواصل",
                            "التكيف مع المتغيرات الحياتية"
                    ],
                    "areasEn": [
                            "Managing stress and daily pressures",
                            "Strengthening self-esteem and personal growth",
                            "Human relationships and communication",
                            "Adapting to life changes"
                    ],
                    "approachAr": [
                            "العلاج المعرفي السلوكي (CBT)",
                            "أساليب الإرشاد والتقييم النفسي الإكلينيكي"
                    ],
                    "approachEn": [
                            "Cognitive Behavioral Therapy (CBT)",
                            "Counseling methods and clinical psychological assessment"
                    ],
                    "philosophyAr": "نعمل معًا في مساحة قائمة على التقبل والدعم خطوة بخطوة لمساعدتك على فهم نفسك بشكل أفضل وتحقيق التوازن النفسي.",
                    "philosophyEn": "Together we work in a space built on acceptance and support, step by step, to help you better understand yourself and achieve psychological balance."
            }
    ];

    let specialists = builtInSpecialists.map(item => ({ ...item, bookingKey: item.nameEn }));
    let revealReady = false;


    /* =====================================================
       LANGUAGE SYSTEM
    ===================================================== */

    function setLanguage(lang) {

        currentLanguage = lang;

        safeStorage.set(
            "mindcare-language",
            lang
        );

        document.documentElement.lang = lang;

        document.documentElement.dir =
            lang === "ar" ? "rtl" : "ltr";

        document.body.classList.toggle(
            "english-mode",
            lang === "en"
        );

        document
            .querySelectorAll("[data-ar][data-en]")
            .forEach(element => {

                const value =
                    element.getAttribute(
                        lang === "ar"
                            ? "data-ar"
                            : "data-en"
                    );

                if (value !== null) {
                    element.textContent = value;
                }

            });

        if (languageSwitch) {

            languageSwitch.textContent =
                lang === "ar"
                    ? "EN"
                    : "العربية";

        }

        updateStaticNavigation(lang);
        applyStaticEnglish(lang);
        renderSpecialistCards();
        renderDashboardTopicCards();
        updateWhatsAppLinks(lang);
        syncDynamicLabels();
        if (guideGrid) renderGuide();
        renderMoodHistory();
        if (journalText) journalText.placeholder = lang === "ar" ? journalText.dataset.placeholderAr : journalText.dataset.placeholderEn;
    }


    function updateStaticNavigation(lang) {

        const navLinks =
            document.querySelectorAll(".nav-link");

        const ar = [
            "الرئيسية",
            "كيف تعمل",
            "الصحة النفسية",
            "دليل التوعية",
            "أساليبنا العلاجية",
            "الجلسة الأولى",
            "مكتبة التوعية",
            "المختصون",
            "الأسئلة الشائعة"
        ];

        const en = [
            "Home",
            "How It Works",
            "Mental Health",
            "Awareness Guide",
            "Therapeutic Approaches",
            "First Session",
            "Education Library",
            "Specialists",
            "FAQ"
        ];

        navLinks.forEach((link, index) => {

            if (link) {
                link.textContent =
                    lang === "ar"
                        ? ar[index]
                        : en[index];
            }

        });

    }


    if (languageSwitch) {

        languageSwitch.addEventListener(
            "click",
            () => {

                setLanguage(
                    currentLanguage === "ar"
                        ? "en"
                        : "ar"
                );

            }
        );

    }


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    if (menuToggle && mainNav) {

        menuToggle.addEventListener(
            "click",
            () => {

                const isOpen =
                    mainNav.classList.toggle("open");

                menuToggle.classList.toggle(
                    "active",
                    isOpen
                );

                menuToggle.setAttribute(
                    "aria-expanded",
                    String(isOpen)
                );

            }
        );


        mainNav
            .querySelectorAll("a")
            .forEach(link => {

                link.addEventListener(
                    "click",
                    () => {

                        mainNav.classList.remove("open");
                        menuToggle.classList.remove("active");

                    }
                );

            });

    }


    /* =====================================================
       MODAL HELPERS
    ===================================================== */

    /* keyboard focus: remember what opened a popup, so focus can go back there when it closes */
    let lastTrigger = null;
    let lastTriggerTime = 0;

    document.addEventListener(
        "click",
        event => {

            const trigger = event.target.closest
                ? event.target.closest("button, a[href], [role='button'], [data-topic], [data-provider], [tabindex]")
                : null;

            if (trigger && !trigger.closest(".modal")) {
                lastTrigger = trigger;
                lastTriggerTime = Date.now();
            }

        },
        true
    );

    const focusableSelector =
        "a[href], button:not([disabled]), input:not([disabled]):not([type='hidden']), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])";

    function getFocusable(box) {

        return [...box.querySelectorAll(focusableSelector)]
            .filter(element => element.getClientRects().length > 0);

    }

    function openModal(modal) {

        if (!modal) return;

        /* remember the opener only the first time (never overwrite it with something inside the popup) */
        if (!modal.classList.contains("active")) {

            const active = document.activeElement;

            modal._opener =
                lastTrigger && document.contains(lastTrigger) && Date.now() - lastTriggerTime < 1500
                    ? lastTrigger
                    : (active && active !== document.body ? active : null);

        }

        modal.classList.add("active");

        modal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "modal-open"
        );

        const box = modal.querySelector(".modal-box");
        const heading = box && box.querySelector("h1, h2, h3");

        /* give the dialog an accessible name from its heading (also for popups filled in by script) */
        if (box && heading) {

            if (!heading.id) heading.id = `${modal.id}Title`;

            box.setAttribute("aria-labelledby", heading.id);

        }

        /* move focus into the dialog; it becomes visible a frame later, so retry briefly */
        if (box) {

            box.setAttribute("tabindex", "-1");

            const tryFocus = attempts => {

                if (!modal.classList.contains("active")) return;

                box.focus({ preventScroll: true });

                if (document.activeElement !== box && attempts > 0) {
                    setTimeout(() => tryFocus(attempts - 1), 40);
                }

            };

            requestAnimationFrame(() => tryFocus(6));

        }

    }


    function closeModal(modal) {

        if (!modal) return;

        const wasActive = modal.classList.contains("active");

        modal.classList.remove("active");

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        if (
            !document.querySelector(
                ".modal.active"
            )
        ) {

            document.body.classList.remove(
                "modal-open"
            );

        }

        /* give focus back to the button that opened the popup */
        const opener = modal._opener;

        modal._opener = null;

        if (
            wasActive &&
            opener &&
            document.contains(opener) &&
            !document.querySelector(".modal.active")
        ) {

            opener.focus({ preventScroll: true });

        }

    }


    document
        .querySelectorAll("[data-close-modal]")
        .forEach(element => {

            element.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(".modal.active")
                        .forEach(closeModal);

                }
            );

        });


    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {

                document
                    .querySelectorAll(".modal.active")
                    .forEach(closeModal);

                return;

            }

            /* keep Tab / Shift+Tab inside the open dialog */
            if (event.key === "Tab") {

                const modal = document.querySelector(".modal.active");
                const box = modal && modal.querySelector(".modal-box");

                if (!box) return;

                const items = getFocusable(box);

                if (!items.length) {
                    event.preventDefault();
                    box.focus({ preventScroll: true });
                    return;
                }

                const first = items[0];
                const last = items[items.length - 1];
                const current = document.activeElement;

                if (!box.contains(current) || current === box) {
                    event.preventDefault();
                    (event.shiftKey ? last : first).focus();
                } else if (event.shiftKey && current === first) {
                    event.preventDefault();
                    last.focus();
                } else if (!event.shiftKey && current === last) {
                    event.preventDefault();
                    first.focus();
                }

            }

        }
    );


    /* =====================================================
       TOPIC MODAL
    ===================================================== */

    function renderTopic(key) {

        const topic = topics[key] || dashboardTopicAsTopic(key);

        if (!topic || !topicModalContent) {
            return;
        }

        const data =
            topic[currentLanguage];

        const symptomsHTML =
            data.symptoms
                .map(
                    symptom => `
                        <li>
                            <i class="fa-solid fa-check"></i>
                            <span>${symptom}</span>
                        </li>
                    `
                )
                .join("");

        const sourceLabel =
            currentLanguage === "ar"
                ? "المصدر الموثوق"
                : "Trusted source";

        const helpLabel =
            currentLanguage === "ar"
                ? "متى تطلب المساعدة؟"
                : "When to seek help";

        const symptomsLabel =
            currentLanguage === "ar"
                ? "العلامات والأعراض"
                : "Common signs";

        const readLabel =
            currentLanguage === "ar"
                ? "قراءة المصدر الأصلي"
                : "Read original source";

        const disclaimer =
            currentLanguage === "ar"
                ? "هذه المعلومات للتثقيف فقط ولا تستخدم لتشخيص نفسك."
                : "This information is educational and should not be used for self-diagnosis.";

        topicModalContent.innerHTML = `

            <div class="modal-topic-header">

                <div class="modal-topic-icon">
                    <i class="${topic.icon}"></i>
                </div>

                <div>
                    <span class="modal-eyebrow">
                        ${currentLanguage === "ar"
                            ? "معلومات تثقيفية"
                            : "Educational information"}
                    </span>

                    <h2>${data.title}</h2>
                </div>

            </div>

            <div class="modal-topic-body">

                <p class="topic-intro">
                    ${data.intro}
                </p>

                ${data.symptoms.length ? `<div class="topic-modal-section">

                    <h3>
                        <i class="fa-solid fa-list-check"></i>
                        ${symptomsLabel}
                    </h3>

                    <ul class="modal-list">
                        ${symptomsHTML}
                    </ul>

                </div>

                ` : ""}${data.help ? `<div class="help-box">

                    <div class="help-box-icon">
                        <i class="fa-solid fa-hand-holding-heart"></i>
                    </div>

                    <div>

                        <h3>
                            ${helpLabel}
                        </h3>

                        <p>
                            ${data.help}
                        </p>

                    </div>

                </div>

                ` : ""}${data.sourceName ? `<div class="source-box">

                    <div>

                        <small>
                            ${sourceLabel}
                        </small>

                        <strong>
                            ${data.sourceName}
                        </strong>

                    </div>

                    <a
                        href="${data.source}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="source-link">

                        ${readLabel}

                        <i class="fa-solid fa-arrow-up-right-from-square"></i>

                    </a>

                </div>

                ` : ""}<div class="modal-disclaimer">

                    <i class="fa-solid fa-circle-info"></i>

                    <span>
                        ${disclaimer}
                    </span>

                </div>

            </div>
        `;

        openModal(topicModal);
    }


    document
        .querySelectorAll("[data-topic]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const key =
                        button.getAttribute(
                            "data-topic"
                        );

                    renderTopic(key);

                }
            );

        });


    /* =====================================================
       SPECIALISTS: cards and profile popup
    ===================================================== */

    const specialistsGrid = document.querySelector(".specialists-grid");

    const specEsc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));

    /* the text in the current language; falls back to the other language if this one is empty */
    function specPick(item, field) {
        const primary = item[field + (currentLanguage === "en" ? "En" : "Ar")];
        const secondary = item[field + (currentLanguage === "en" ? "Ar" : "En")];
        const filled = value => Array.isArray(value) ? value.length > 0 : Boolean(value && String(value).trim());
        if (filled(primary)) return primary;
        if (filled(secondary)) return secondary;
        return Array.isArray(primary) || Array.isArray(secondary) ? [] : "";
    }

    function specInitial(item) {
        const name = String(specPick(item, "name") || "").trim();
        return name ? Array.from(name)[0].toUpperCase() : "";
    }

    function specLabels() {
        return currentLanguage === "en"
            ? { view: "View profile", book: "Book an appointment", booking: "Book an Appointment", qualifications: "Academic Qualifications", about: "About the Therapist", areas: "Areas of Support", approach: "Therapeutic Approach", philosophy: "Work Philosophy" }
            : { view: "عرض الملف", book: "احجز موعد", booking: "احجز موعدًا", qualifications: "المؤهلات الأكاديمية", about: "عن المعالجة", areas: "المجالات ومحاور الدعم", approach: "المنهج العلاجي", philosophy: "فلسفة العمل" };
    }

    function specialistCardHtml(item) {
        const labels = specLabels();
        return `
            <article class="specialist-card" data-specialist="${specEsc(item.id)}">
                <div class="specialist-avatar">${specEsc(specInitial(item))}</div>
                <div class="specialist-content">
                    <span class="specialist-label">${specEsc(specPick(item, "specialty"))}</span>
                    <h3>${specEsc(specPick(item, "name"))}</h3>
                    <p>${specEsc(specPick(item, "bio"))}</p>
                    <div class="specialist-actions">
                        <button class="btn btn-soft" type="button" data-provider="${specEsc(item.id)}">${labels.view}</button>
                        <button class="btn btn-primary" type="button" data-specialist-book="${specEsc(item.bookingKey)}">${labels.book}</button>
                    </div>
                </div>
            </article>`;
    }

    /* same cards as before: only the text is refreshed (language change); the cards are rebuilt only when the list of specialists changes */
    function renderSpecialistCards() {
        if (!specialistsGrid) return;
        const labels = specLabels();
        const cards = [...specialistsGrid.querySelectorAll(".specialist-card")];
        const sameList = cards.length === specialists.length && cards.every((card, index) => card.dataset.specialist === specialists[index].id);
        if (sameList) {
            cards.forEach((card, index) => {
                const item = specialists[index];
                card.querySelector(".specialist-avatar").textContent = specInitial(item);
                card.querySelector(".specialist-label").textContent = specPick(item, "specialty");
                card.querySelector("h3").textContent = specPick(item, "name");
                card.querySelector(".specialist-content p").textContent = specPick(item, "bio");
                card.querySelector("[data-provider]").textContent = labels.view;
                const book = card.querySelector("[data-specialist-book]");
                book.textContent = labels.book;
                book.dataset.specialistBook = item.bookingKey;
            });
            return;
        }
        specialistsGrid.innerHTML = specialists.map(specialistCardHtml).join("");
        if (revealReady) specialistsGrid.querySelectorAll(".specialist-card").forEach(card => card.classList.add("mc-reveal", "is-visible"));
    }

    function openSpecialistProfile(id) {
        const item = specialists.find(entry => entry.id === id);
        if (!item || !providerModalContent) return;
        const labels = specLabels();
        const bullets = values => values.map(value => `<li><i class="fa-solid fa-check"></i> ${specEsc(value)}</li>`).join("");
        const section = (icon, title, body) => `<div class="topic-modal-section"><h3><i class="fa-solid ${icon}"></i> ${title}</h3>${body}</div>`;
        const qualifications = specPick(item, "qualifications");
        const bio = specPick(item, "bio");
        const areas = specPick(item, "areas");
        const approach = specPick(item, "approach");
        const philosophy = specPick(item, "philosophy");

        providerModalContent.innerHTML = `
            <div class="provider-modal-header">
                <div class="provider-large-avatar">${specEsc(specInitial(item))}</div>
                <div>
                    <span class="modal-eyebrow">${specEsc(specPick(item, "specialty"))}</span>
                    <h2>${specEsc(specPick(item, "name"))}</h2>
                </div>
            </div>
            <div class="provider-modal-body">
                ${qualifications.length ? section("fa-graduation-cap", labels.qualifications, `<ul class="modal-list">${bullets(qualifications)}</ul>`) : ""}
                ${bio ? section("fa-circle-info", labels.about, `<p>${specEsc(bio)}</p>`) : ""}
                ${areas.length ? section("fa-list-check", labels.areas, `<div class="provider-tags">${areas.map(area => `<span class="provider-tag">${specEsc(area)}</span>`).join("")}</div>`) : ""}
                ${approach.length ? section("fa-compass", labels.approach, `<ul class="modal-list">${bullets(approach)}</ul>`) : ""}
                ${philosophy ? `<div class="help-box"><div class="help-box-icon"><i class="fa-solid fa-quote-right"></i></div><div><h3>${labels.philosophy}</h3><p>"${specEsc(philosophy)}"</p></div></div>` : ""}
                <button class="btn btn-primary full-width provider-book-button" type="button" data-provider-book="${specEsc(item.id)}">
                    ${labels.booking}
                    <i class="fa-solid fa-arrow-left"></i>
                </button>
            </div>
        `;

        openModal(providerModal);

        const bookButton = providerModalContent.querySelector("[data-provider-book]");
        if (bookButton) {
            bookButton.addEventListener("click", () => {
                closeModal(providerModal);
                openBooking(item.bookingKey);
            });
        }
    }

    if (specialistsGrid) {
        specialistsGrid.addEventListener("click", event => {
            const viewButton = event.target.closest("[data-provider]");
            if (viewButton) {
                openSpecialistProfile(viewButton.dataset.provider);
                return;
            }
            const bookButton = event.target.closest("[data-specialist-book]");
            if (bookButton) openBooking(bookButton.dataset.specialistBook);
        });
    }

    /* Called by site-data.js with the specialists the owner manages in the dashboard.
       Nothing set up there yet (or no connection): the built-in profiles above stay. */
    window.mindcareSetProviders = function (rows) {
        if (!Array.isArray(rows) || !rows.length) return;
        const normalize = value => String(value || "").toLowerCase().replace(/\s+/g, " ").trim();
        const builtInFor = row => builtInSpecialists.findIndex(base => [row.nameEn, row.nameAr].some(name => normalize(name) && [base.nameEn, base.nameAr].some(known => normalize(known) === normalize(name))));
        const filled = value => Array.isArray(value) ? value.length > 0 : Boolean(value && String(value).trim());
        const fields = ["nameAr", "nameEn", "specialtyAr", "specialtyEn", "qualificationsAr", "qualificationsEn", "bioAr", "bioEn", "areasAr", "areasEn", "approachAr", "approachEn", "philosophyAr", "philosophyEn"];
        const merged = rows.map(row => {
            const baseIndex = builtInFor(row);
            const base = baseIndex >= 0 ? builtInSpecialists[baseIndex] : {};
            /* a built-in specialist keeps the owner's exact text until its profile is saved from the dashboard's new form (profileVersion 2) */
            const useDashboardText = baseIndex < 0 || Number(row.profileVersion) >= 2;
            const item = { id: row.id, bookingKey: row.id, order: baseIndex >= 0 ? baseIndex : 1000 + (row.createdAt && row.createdAt.seconds ? row.createdAt.seconds : 0) };
            fields.forEach(field => { item[field] = useDashboardText && filled(row[field]) ? row[field] : base[field]; });
            return item;
        }).sort((a, b) => a.order - b.order);
        specialists = merged;
        renderSpecialistCards();
    };


    /* =====================================================
       SECTIONS from the dashboard ("الأقسام"): extra cards after the built-in ones
       Called by site-data.js. A section whose key is one of the built-in topics is ignored
       (the built-in cards stay as they are).
    ===================================================== */

    const topicsGrid = document.querySelector("#topics .topics-grid");
    const builtInTopicCards = topicsGrid ? topicsGrid.querySelectorAll(".topic-card").length : 0;
    let dashboardTopics = [];

    function topicText(row, field) {
        const primary = row[field + (currentLanguage === "en" ? "En" : "Ar")];
        const secondary = row[field + (currentLanguage === "en" ? "Ar" : "En")];
        if (primary && String(primary).trim()) return String(primary);
        return secondary && String(secondary).trim() ? String(secondary) : "";
    }

    /* the same shape the built-in topics have, so the existing popup can show it (only title and description exist) */
    function dashboardTopicAsTopic(key) {
        const row = dashboardTopics.find(item => item.key === key);
        if (!row) return null;
        const part = language => {
            const suffix = language === "en" ? "En" : "Ar", other = language === "en" ? "Ar" : "En";
            const get = field => (row[field + suffix] && String(row[field + suffix]).trim()) ? String(row[field + suffix]) : (row[field + other] ? String(row[field + other]) : "");
            return { title: specEsc(get("title")), intro: specEsc(get("description")), symptoms: [], help: "", sourceName: "", source: "" };
        };
        return { icon: "fa-solid fa-book-open", ar: part("ar"), en: part("en") };
    }

    function attachCardTilt(card) {
        if (!window.matchMedia("(pointer:fine)").matches) return;
        card.addEventListener("pointermove", event => {
            const rect = card.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width;
            const y = (event.clientY - rect.top) / rect.height;
            card.style.setProperty("--mc-tilt", `perspective(900px) rotateX(${(0.5 - y) * 3}deg) rotateY(${(x - 0.5) * 3}deg) translateY(-4px)`);
        });
        card.addEventListener("pointerleave", () => {
            card.style.setProperty("--mc-tilt", "perspective(900px) rotateX(0) rotateY(0) translateY(0)");
        });
    }

    function dashboardTopicCardHtml(row, index) {
        const more = currentLanguage === "en" ? "Learn more" : "اعرف أكثر";
        return `
            <button class="topic-card" type="button" data-topic="${specEsc(row.key)}" data-dashboard-topic>
                <span class="topic-number">${String(builtInTopicCards + index + 1).padStart(2, "0")}</span>
                <span class="topic-icon"><i class="fa-solid fa-book-open"></i></span>
                <h3>${specEsc(topicText(row, "title"))}</h3>
                <p>${specEsc(topicText(row, "description"))}</p>
                <span class="card-link">${more} <i class="fa-solid fa-arrow-left"></i></span>
            </button>`;
    }

    function renderDashboardTopicCards() {
        if (!topicsGrid) return;
        const cards = [...topicsGrid.querySelectorAll("[data-dashboard-topic]")];
        const sameList = cards.length === dashboardTopics.length && cards.every((card, index) => card.dataset.topic === dashboardTopics[index].key);
        if (sameList) {
            cards.forEach((card, index) => {
                card.querySelector("h3").textContent = topicText(dashboardTopics[index], "title");
                card.querySelector("p").textContent = topicText(dashboardTopics[index], "description");
                card.querySelector(".card-link").firstChild.textContent = (currentLanguage === "en" ? "Learn more" : "اعرف أكثر") + " ";
            });
            return;
        }
        cards.forEach(card => card.remove());
        topicsGrid.insertAdjacentHTML("beforeend", dashboardTopics.map(dashboardTopicCardHtml).join(""));
        topicsGrid.querySelectorAll("[data-dashboard-topic]").forEach(card => {
            attachCardTilt(card);
            if (revealReady) card.classList.add("mc-reveal", "is-visible");
        });
    }

    if (topicsGrid) {
        topicsGrid.addEventListener("click", event => {
            const card = event.target.closest("[data-dashboard-topic]");
            if (card) renderTopic(card.dataset.topic);
        });
    }

    window.mindcareSetTopics = function (rows) {
        if (!Array.isArray(rows)) return;
        dashboardTopics = rows
            .map(row => ({ ...row, key: String(row.key || row.id || "") }))
            .filter(row => /^[a-z0-9-]+$/.test(row.key) && !Object.prototype.hasOwnProperty.call(topics, row.key))
            .filter(row => [row.titleAr, row.titleEn].some(value => value && String(value).trim()))
            .sort((a, b) => (((a.createdAt && a.createdAt.seconds) || 0) - ((b.createdAt && b.createdAt.seconds) || 0)) || a.key.localeCompare(b.key));
        renderDashboardTopicCards();
    };


    /* =====================================================
       BOOKING — FIREBASE FLOW
    ===================================================== */

    function openBooking(providerName = "") {

        const params = new URLSearchParams();

        if (providerName) {
            params.set("provider", providerName);
        }

        const query = params.toString();

        window.location.href =
            "booking.html" + (query ? `?${query}` : "");
    }


    document
        .querySelectorAll("[data-open-booking]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const provider =
                        button.getAttribute("data-selected-provider") || "";

                    openBooking(provider);

                }
            );

        });


    /* =====================================================
       ASSESSMENT
    ===================================================== */

    const assessmentData = [

        {
            ar: "خلال الفترة الأخيرة، هل شعرت بالحزن أو الفراغ أو انخفاض المزاج؟",
            en: "Recently, have you often felt sad, empty, or low?"
        },

        {
            ar: "هل فقدت الاهتمام أو المتعة في أشياء كنت تستمتع بها؟",
            en: "Have you lost interest or pleasure in things you usually enjoy?"
        },

        {
            ar: "هل شعرت بقلق أو توتر يصعب التحكم فيه؟",
            en: "Have you experienced anxiety or worry that feels difficult to control?"
        },

        {
            ar: "هل أثرت مشاعرك على النوم أو التركيز أو الدراسة أو العمل؟",
            en: "Have your feelings affected sleep, concentration, school, or work?"
        },

        {
            ar: "هل أصبحت هذه المشاعر تؤثر على علاقاتك أو حياتك اليومية؟",
            en: "Have these feelings affected your relationships or daily life?"
        },

        {
            ar: "هل شعرت أن التعامل مع ما تمر به أصبح صعبًا بمفردك؟",
            en: "Have you felt that dealing with what you are experiencing has become difficult on your own?"
        }

    ];


    function renderAssessment() {

        if (!assessmentQuestions) {
            return;
        }

        assessmentQuestions.innerHTML =
            assessmentData
                .map(
                    (question, index) => `

                        <div class="assessment-question">

                            <p>
                                <strong>
                                    ${index + 1}.
                                </strong>

                                ${
                                    question[
                                        currentLanguage
                                    ]
                                }
                            </p>

                            <div class="assessment-options">

                                <label>
                                    <input
                                        type="radio"
                                        name="assessment-${index}"
                                        value="0">
                                    <span>
                                        ${
                                            currentLanguage === "ar"
                                                ? "لا"
                                                : "No"
                                        }
                                    </span>
                                </label>

                                <label>
                                    <input
                                        type="radio"
                                        name="assessment-${index}"
                                        value="1">
                                    <span>
                                        ${
                                            currentLanguage === "ar"
                                                ? "أحيانًا"
                                                : "Sometimes"
                                        }
                                    </span>
                                </label>

                                <label>
                                    <input
                                        type="radio"
                                        name="assessment-${index}"
                                        value="2">
                                    <span>
                                        ${
                                            currentLanguage === "ar"
                                                ? "غالبًا"
                                                : "Often"
                                        }
                                    </span>
                                </label>

                            </div>

                        </div>
                    `
                )
                .join("");

    }


    if (assessmentButton) {

        assessmentButton.addEventListener(
            "click",
            () => {

                renderAssessment();

                if (assessmentResult) {
                    assessmentResult.innerHTML = "";
                }

                openModal(assessmentModal);

            }
        );

    }


    if (calculateAssessment) {

        calculateAssessment.addEventListener(
            "click",
            () => {

                let score = 0;
                let answered = 0;

                assessmentData.forEach(
                    (_, index) => {

                        const selected =
                            document.querySelector(
                                `input[name="assessment-${index}"]:checked`
                            );

                        if (selected) {

                            score +=
                                Number(
                                    selected.value
                                );

                            answered++;

                        }

                    }
                );


                if (answered < assessmentData.length) {

                    assessmentResult.innerHTML = `
                        <div class="assessment-warning">

                            <i class="fa-solid fa-circle-exclamation"></i>

                            ${
                                currentLanguage === "ar"
                                    ? "من فضلك أجب عن جميع الأسئلة."
                                    : "Please answer all questions."
                            }

                        </div>
                    `;

                    return;
                }


                let result;

                if (score <= 3) {

                    result =
                        currentLanguage === "ar"
                            ? {
                                title: "قد تكون الأعراض محدودة حاليًا",
                                text:
                                    "استمر في ملاحظة ما تشعر به. إذا زادت الأعراض أو استمرت وأثرت على حياتك اليومية، تحدث مع مختص."
                            }
                            : {
                                title: "Your current symptoms may be limited",
                                text:
                                    "Continue observing how you feel. If symptoms increase, persist, or affect daily life, consider speaking with a professional."
                            };

                } else if (score <= 8) {

                    result =
                        currentLanguage === "ar"
                            ? {
                                title: "قد يكون من المفيد التحدث مع مختص",
                                text:
                                    "قد تكون بعض المشاعر أو الأعراض مؤثرة في حياتك. التحدث مع مختص يمكن أن يساعدك على فهم ما تمر به بشكل أفضل."
                            }
                            : {
                                title: "Speaking with a professional may be helpful",
                                text:
                                    "Some symptoms may be affecting your life. A professional conversation may help you better understand what you are experiencing."
                            };

                } else {

                    result =
                        currentLanguage === "ar"
                            ? {
                                title: "من المهم التفكير في طلب دعم متخصص",
                                text:
                                    "الإجابات تشير إلى وجود عدد من الأعراض المؤثرة. هذا التقييم لا يشخّص أي حالة، لكن التحدث مع مختص قد يكون خطوة مناسبة."
                            }
                            : {
                                title: "Consider seeking professional support",
                                text:
                                    "Your answers suggest several symptoms that may be affecting you. This assessment is not diagnostic, but speaking with a professional may be an appropriate next step."
                            };

                }


                assessmentResult.innerHTML = `

                    <div class="assessment-result">

                        <div class="result-icon">
                            <i class="fa-solid fa-heart"></i>
                        </div>

                        <h3>
                            ${result.title}
                        </h3>

                        <p>
                            ${result.text}
                        </p>

                        <button
                            class="btn btn-primary"
                            type="button"
                            id="resultBookingButton">

                            ${
                                currentLanguage === "ar"
                                    ? "التحدث مع مختص"
                                    : "Talk to a professional"
                            }

                            <i class="fa-solid fa-arrow-left"></i>

                        </button>

                    </div>
                `;


                const resultBookingButton =
                    document.getElementById(
                        "resultBookingButton"
                    );

                if (resultBookingButton) {

                    resultBookingButton.addEventListener(
                        "click",
                        () => {

                            closeModal(assessmentModal);
                            openBooking();

                        }
                    );

                }

            }
        );

    }


    /* =====================================================
       AWARENESS GUIDE — EDUCATIONAL, NOT DIAGNOSTIC
    ===================================================== */
    const guideData = [
        { id: "gad", category: "anxiety", icon: "fa-solid fa-wind", title: "القلق العام", en: "Generalized Anxiety Disorder (GAD)", origin: "ينشأ غالبًا من تفاعل بين الاستعداد الوراثي، طريقة تفسير الضغوط، والخبرات الحياتية — وليس من ضعف شخصي.", description: "توتر وقلق مفرط ومستمر يصعب التحكم فيه بشأن مجريات الحياة اليومية.", signs: ["شد العضلات والإرهاق", "صعوبة التركيز", "صعوبة الاسترخاء أو النوم"] },
        { id: "panic", category: "anxiety", icon: "fa-solid fa-heart-pulse", title: "اضطراب الهلع", en: "Panic Disorder", origin: "قد تصبح النوبة أكثر إزعاجًا عندما يبدأ الشخص في الخوف من تكرارها أو تجنب أماكن مرتبطة بها.", description: "نوبات مفاجئة من الخوف الشديد تصل لذروتها خلال دقائق وقد تحدث بشكل غير متوقع.", signs: ["تسارع ضربات القلب", "ضيق التنفس أو الدوخة", "شعور بفقدان السيطرة"] },
        { id: "social", category: "anxiety", icon: "fa-solid fa-users", title: "القلق الاجتماعي", en: "Social Anxiety Disorder", origin: "يرتبط بخوف مستمر من التقييم السلبي، وقد يتغذى على تجارب إحراج سابقة أو حساسية عالية للنقد.", description: "خوف شديد ومستمر من المواقف الاجتماعية أو الأداء أمام الآخرين خشية الإحراج أو الحكم السلبي.", signs: ["تجنب التحدث أو الظهور أمام الآخرين", "قلق قبل المناسبات وبعدها", "أعراض جسدية مثل الاحمرار أو التعرق"] },
        { id: "depression", category: "mood", icon: "fa-regular fa-cloud", title: "الاكتئاب الجسيم", en: "Major Depressive Disorder", origin: "يتأثر بعوامل بيولوجية ونفسية واجتماعية متداخلة، ولا يختصر في الحزن العابر أو قلة الإرادة.", description: "حزن مستمر وفقدان الشغف والمتعة لمدة أسبوعين أو أكثر مع تغيرات في النوم أو الشهية ونظرة سلبية للذات.", signs: ["انخفاض الطاقة أو التركيز", "الشعور بالذنب أو عدم القيمة", "الانسحاب من الأنشطة والعلاقات"] },
        { id: "bipolar", category: "mood", icon: "fa-solid fa-arrows-rotate", title: "اضطراب ثنائي القطب", en: "Bipolar Disorder", origin: "هو اضطراب في تنظيم المزاج والطاقة، ولا يعني مجرد تقلبات يومية طبيعية أو تغيرًا في الشخصية.", description: "تناوب نوبات الاكتئاب مع نوبات هوس أو هوس خفيف تتضمن ارتفاعًا غير طبيعي في الطاقة والنشاط.", signs: ["قلة الحاجة للنوم أثناء الهوس", "تسارع الأفكار والكلام", "اندفاع أو قرارات عالية المخاطر"] },
        { id: "ocd", category: "trauma", icon: "fa-solid fa-rotate", title: "اضطراب الوسواس القهري", en: "Obsessive-Compulsive Disorder (OCD)", origin: "تعمل الوساوس والقهرات كحلقة مؤقتة: فكرة مزعجة ثم فعل يخفف القلق لحظيًا، فيتقوى تكرار الحلقة.", description: "أفكار أو صور ملحة وغير مرغوب فيها تدفع لسلوكيات أو أفعال ذهنية تكرارية لتخفيف التوتر مؤقتًا.", signs: ["أفكار متطفلة ومزعجة", "التحقق أو الغسل أو العد بشكل متكرر", "استهلاك وقت كبير أو تعطيل الحياة اليومية"] },
        { id: "ptsd", category: "trauma", icon: "fa-solid fa-shield-heart", title: "اضطراب ما بعد الصدمة", en: "Post-Traumatic Stress Disorder (PTSD)", origin: "استجابة نفسية عصبية لحدث مهدد أو صادم، وقد تظهر بعد مدة وليس بالضرورة مباشرة بعد الحدث.", description: "استجابة مجهدة تلي التعرض لحدث صدمي، وتتضمن استعادة الذكريات وتجنب المثيرات وفرط اليقظة.", signs: ["ذكريات اقتحامية أو Flashbacks", "تجنب أماكن أو أحاديث مرتبطة بالحدث", "فرط الاستثارة وصعوبة النوم"] },
        { id: "bpd", category: "trauma", icon: "fa-solid fa-people-arrows", title: "اضطراب الشخصية الحدية", en: "Borderline Personality Disorder (BPD)", origin: "نمط معقد يتداخل فيه تنظيم المشاعر والخبرات والعلاقات؛ والعلاج الجدلي السلوكي DBT من الخيارات الموصى بها بقوة.", description: "نمط مستمر من عدم الاستقرار في المشاعر والعلاقات وصورة الذات، مع اندفاعية وخوف شديد من الهجران.", signs: ["تغيرات انفعالية شديدة", "علاقات متقلبة أو حساسية للهجر", "اندفاعية أو صعوبة في تهدئة المشاعر"] },
        { id: "eating", category: "body", icon: "fa-solid fa-utensils", title: "اضطرابات الأكل", en: "Eating Disorders", origin: "تتأثر بعوامل نفسية واجتماعية وبيولوجية وصورة الجسد، وهي حالات صحية جادة لا تتعلق بالمظهر أو الإرادة فقط.", description: "سلوكيات أكل غير صحية وانشغال مفرط بوزن الجسم وشكله بما يؤثر على الصحة الجسدية والنفسية.", signs: ["تقييد شديد أو نوبات أكل وفقدان السيطرة", "انشغال قهري بالوزن أو الشكل", "تغيرات جسدية أو انعزال حول الطعام"] }
    ];
    const guideEnglish = {
        "gad": {"origin": "Often arises from an interaction between genetic predisposition, the way stress is interpreted, and life experiences — not from personal weakness.", "description": "Excessive, persistent worry and tension that is hard to control, about the events of everyday life.", "signs": ["Muscle tension and fatigue", "Difficulty concentrating", "Difficulty relaxing or sleeping"]},
        "panic": {"origin": "An attack can become more distressing when a person begins to fear it will happen again or avoids places linked to it.", "description": "Sudden episodes of intense fear that peak within minutes and can happen unexpectedly.", "signs": ["Racing heartbeat", "Shortness of breath or dizziness", "A feeling of losing control"]},
        "social": {"origin": "Linked to a persistent fear of negative evaluation; it may be fed by past experiences of embarrassment or a high sensitivity to criticism.", "description": "Intense, persistent fear of social situations or of performing in front of others, for fear of embarrassment or negative judgment.", "signs": ["Avoiding speaking or appearing in front of others", "Anxiety before and after events", "Physical symptoms such as blushing or sweating"]},
        "depression": {"origin": "Shaped by overlapping biological, psychological, and social factors; it is not reducible to passing sadness or a lack of willpower.", "description": "Persistent sadness and loss of interest and pleasure for two weeks or more, with changes in sleep or appetite and a negative view of oneself.", "signs": ["Low energy or poor concentration", "Feelings of guilt or worthlessness", "Withdrawing from activities and relationships"]},
        "bipolar": {"origin": "A disorder of mood and energy regulation; it doesn't mean ordinary day-to-day mood changes or a change in personality.", "description": "Episodes of depression alternating with episodes of mania or hypomania, involving an abnormal rise in energy and activity.", "signs": ["Reduced need for sleep during mania", "Racing thoughts and speech", "Impulsivity or high-risk decisions"]},
        "ocd": {"origin": "Obsessions and compulsions work as a loop: a distressing thought, then an action that eases anxiety for a moment, which strengthens the repetition of the loop.", "description": "Intrusive, unwanted thoughts or images that drive repetitive behaviors or mental acts to relieve tension temporarily.", "signs": ["Intrusive, distressing thoughts", "Repeated checking, washing, or counting", "Taking up a lot of time or disrupting daily life"]},
        "ptsd": {"origin": "A neurological and psychological response to a threatening or traumatic event; it may appear after some time, not necessarily right after the event.", "description": "A stress response that follows exposure to a traumatic event, including re-experiencing memories, avoiding triggers, and hypervigilance.", "signs": ["Intrusive memories or flashbacks", "Avoiding places or conversations linked to the event", "Heightened arousal and difficulty sleeping"]},
        "bpd": {"origin": "A complex pattern in which emotion regulation, experiences, and relationships intertwine; Dialectical Behavior Therapy (DBT) is one of the strongly recommended options.", "description": "A persistent pattern of instability in emotions, relationships, and self-image, with impulsivity and an intense fear of abandonment.", "signs": ["Intense emotional shifts", "Unstable relationships or sensitivity to abandonment", "Impulsivity or difficulty calming emotions"]},
        "eating": {"origin": "Influenced by psychological, social, and biological factors and by body image; these are serious health conditions that are not only about appearance or willpower.", "description": "Unhealthy eating behaviors and excessive preoccupation with body weight and shape, affecting physical and mental health.", "signs": ["Severe restriction, or binge episodes with loss of control", "Compulsive preoccupation with weight or shape", "Physical changes or withdrawal around food"]},
    };
    const guideCategoryEn = { anxiety: "Anxiety", mood: "Mood", trauma: "Trauma & Personality", body: "Eating & Body" };
    let activeGuideFilter = "all";
    let guideFavorites = safeStorage.getList("mindcare-guide-favorites").filter(item => typeof item === "string");

    function renderGuide() {
        if (!guideGrid) return;
        const query = (guideSearch?.value || "").trim().toLowerCase();
        const visible = guideData.filter(item => {
            const matchesFilter = activeGuideFilter === "all" || item.category === activeGuideFilter;
            const extra = guideEnglish[item.id] ? [guideEnglish[item.id].origin, guideEnglish[item.id].description, ...guideEnglish[item.id].signs] : [];
            const haystack = [item.title, item.en, item.origin, item.description, ...item.signs, ...extra].join(" ").toLowerCase();
            return matchesFilter && (!query || haystack.includes(query));
        });
        guideGrid.innerHTML = visible.map((item, index) => {
            const favorite = guideFavorites.includes(item.id);
            const english = currentLanguage === "en" ? guideEnglish[item.id] : null;
            return `<article class="guide-card" style="--guide-delay:${index * 45}ms" data-guide-id="${item.id}">
                <div class="guide-card-top"><span class="guide-card-icon"><i class="${item.icon}"></i></span><button class="guide-favorite ${favorite ? "is-favorite" : ""}" type="button" data-favorite="${item.id}" aria-label="${favorite ? (english ? "Remove from saved" : "إزالة من المحفوظات") : (english ? "Save topic" : "حفظ الموضوع")}"><i class="${favorite ? "fa-solid" : "fa-regular"} fa-bookmark"></i></button></div>
                <span class="guide-card-category">${english ? guideCategoryEn[item.category] : item.en}</span><h3>${english ? item.en : item.title}</h3><p>${english ? english.description : item.description}</p>
                <div class="guide-card-detail"><strong>${english ? "How do we understand it?" : "كيف نفهمه؟"}</strong><span>${english ? english.origin : item.origin}</span><strong>${english ? "Common signs" : "علامات شائعة"}</strong><ul>${(english ? english.signs : item.signs).map(sign => `<li><i class="fa-solid fa-check"></i>${sign}</li>`).join("")}</ul></div>
                <button class="guide-more" type="button" data-expand-guide="${item.id}">${english ? "Read summary" : "اقرأ الملخص"} <i class="fa-solid fa-chevron-down"></i></button>
            </article>`;
        }).join("");
        if (guideCount) guideCount.textContent = `${visible.length} ${currentLanguage === "en" ? (visible.length === 1 ? "topic" : "topics") : "موضوع"}`;
        if (guideEmpty) guideEmpty.hidden = visible.length !== 0;
        guideGrid.querySelectorAll("[data-expand-guide]").forEach(button => button.addEventListener("click", () => {
            const card = button.closest(".guide-card"); card?.classList.toggle("is-expanded");
            button.querySelector("i")?.classList.toggle("fa-rotate-180");
        }));
        guideGrid.querySelectorAll("[data-favorite]").forEach(button => button.addEventListener("click", () => {
            const id = button.dataset.favorite;
            guideFavorites = guideFavorites.includes(id) ? guideFavorites.filter(item => item !== id) : [...guideFavorites, id];
            safeStorage.set("mindcare-guide-favorites", JSON.stringify(guideFavorites)); renderGuide();
        }));
    }
    document.querySelectorAll("[data-guide-filter]").forEach(button => button.addEventListener("click", () => {
        activeGuideFilter = button.dataset.guideFilter;
        document.querySelectorAll("[data-guide-filter]").forEach(item => item.classList.toggle("active", item === button));
        renderGuide();
    }));
    guideSearch?.addEventListener("input", renderGuide);
    document.getElementById("resetGuide")?.addEventListener("click", () => { activeGuideFilter = "all"; if (guideSearch) guideSearch.value = ""; document.querySelectorAll("[data-guide-filter]").forEach(item => item.classList.toggle("active", item.dataset.guideFilter === "all")); renderGuide(); });
    document.getElementById("openGuidePath")?.addEventListener("click", () => { if (guidePath) { guidePath.hidden = !guidePath.hidden; if (!guidePath.hidden) guidePath.scrollIntoView({ behavior: "smooth", block: "center" }); } });
    document.querySelectorAll("[data-guide-path]").forEach(button => button.addEventListener("click", () => { activeGuideFilter = button.dataset.guidePath; if (guideSearch) guideSearch.value = ""; document.querySelectorAll("[data-guide-filter]").forEach(item => item.classList.toggle("active", item.dataset.guideFilter === activeGuideFilter)); renderGuide(); document.getElementById("guide-library")?.scrollIntoView({ behavior: "smooth", block: "start" }); }));
    const copyButtonHtml = copied => currentLanguage === "en"
        ? (copied ? '<i class="fa-solid fa-check"></i> Copied' : '<i class="fa-regular fa-copy"></i> Copy number')
        : (copied ? '<i class="fa-solid fa-check"></i> تم النسخ' : '<i class="fa-regular fa-copy"></i> نسخ الرقم');
    const articleButtonHtml = expanded => currentLanguage === "en"
        ? (expanded ? 'Hide the idea <i class="fa-solid fa-arrow-up"></i>' : 'Read the idea <i class="fa-solid fa-arrow-left"></i>')
        : (expanded ? 'إخفاء الفكرة <i class="fa-solid fa-arrow-up"></i>' : 'اقرأ الفكرة <i class="fa-solid fa-arrow-left"></i>');
    /* buttons whose label this script rewrites after a click: keep them in the current language */
    function syncDynamicLabels() {
        document.querySelectorAll("[data-emergency-copy][data-label-dirty]").forEach(button => { button.innerHTML = copyButtonHtml(false); });
        document.querySelectorAll("[data-article]").forEach(card => {
            const button = card.querySelector(".article-read");
            if (button && button.dataset.labelDirty) button.innerHTML = articleButtonHtml(card.classList.contains("is-expanded"));
        });
    }
    document.querySelectorAll("[data-emergency-copy]").forEach(button => button.addEventListener("click", async () => { const number = button.dataset.emergencyCopy; try { await navigator.clipboard.writeText(number); button.innerHTML = copyButtonHtml(true); button.dataset.labelDirty = "1"; setTimeout(() => { button.innerHTML = copyButtonHtml(false); }, 1800); } catch { window.location.href = `tel:${number}`; } }));
    renderGuide();

    /* =====================================================
       TRUST CONTENT INTERACTIONS
    ===================================================== */
    document.querySelectorAll("[data-approach]").forEach(button => button.addEventListener("click", () => {
        const card = button.closest(".approach-card");
        card?.classList.toggle("is-expanded");
        button.querySelector("i")?.classList.toggle("fa-rotate-180");
    }));
    document.querySelectorAll("[data-session-step]").forEach(button => button.addEventListener("click", () => {
        document.querySelectorAll("[data-session-step]").forEach(item => item.classList.toggle("is-active", item === button));
    }));
    document.querySelectorAll("[data-article]").forEach(card => card.querySelector(".article-read")?.addEventListener("click", () => {
        card.classList.toggle("is-expanded");
        const button = card.querySelector(".article-read");
        if (button) { button.innerHTML = articleButtonHtml(card.classList.contains("is-expanded")); button.dataset.labelDirty = "1"; }
    }));

    /* =====================================================
       DAILY CARE TOOLS
    ===================================================== */
    const moodLabels = {
        great: { ar: "رائع", en: "Great", emoji: "😊" },
        good: { ar: "جيد", en: "Good", emoji: "🙂" },
        okay: { ar: "مقبول", en: "Okay", emoji: "😐" },
        low: { ar: "منخفض", en: "Low", emoji: "😔" },
        tough: { ar: "صعب", en: "Tough", emoji: "🌧️" }
    };
    const moodStorageKey = "mindcare-mood-history";
    let moodHistory = safeStorage.getList(moodStorageKey).filter(item => item && typeof item.date === "string" && moodLabels[item.mood]);
    let breathingInterval = null;
    let breathingRemaining = 32;

    function saveMood(key) {
        const today = new Date().toISOString().slice(0, 10);
        moodHistory = moodHistory.filter(item => item.date !== today);
        moodHistory.push({ date: today, mood: key });
        moodHistory = moodHistory.slice(-30);
        safeStorage.set(moodStorageKey, JSON.stringify(moodHistory));
        renderMoodHistory();
        const label = moodLabels[key][currentLanguage];
        const note = document.getElementById("moodNote");
        if (note) note.textContent = currentLanguage === "ar" ? `تم تسجيل: ${label} — أحسنت لأنك توقفت لحظة مع نفسك.` : `Logged: ${label} — well done for pausing with yourself.`;
        document.querySelectorAll("#moodOptions button").forEach(button => button.classList.toggle("selected", button.dataset.mood === key));
    }

    function renderMoodHistory() {
        if (!weeklyMood) return;
        const recent = moodHistory.slice(-7);
        const days = currentLanguage === "ar" ? ["أحد", "اثن", "ثلا", "أرب", "خمي", "جمع", "سبت"] : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        weeklyMood.innerHTML = `<div class="weekly-mood-head"><strong>${currentLanguage === "ar" ? "نبض أسبوعك" : "Your weekly pulse"}</strong><span>${recent.length}/7 ${currentLanguage === "ar" ? "أيام مسجلة" : "days logged"}</span></div><div class="mood-dots">${Array.from({ length: 7 }, (_, index) => {
            const date = new Date(); date.setDate(date.getDate() - (6 - index));
            const iso = date.toISOString().slice(0, 10);
            const item = moodHistory.find(entry => entry.date === iso);
            return `<div class="mood-day"><span>${days[date.getDay()]}</span><b class="${item ? "has-mood" : ""}" title="${item ? moodLabels[item.mood][currentLanguage] : ""}">${item ? moodLabels[item.mood].emoji : "·"}</b></div>`;
        }).join("")}</div>`;
        const today = new Date().toISOString().slice(0, 10);
        const todayMood = moodHistory.find(item => item.date === today);
        if (moodSummary) moodSummary.textContent = todayMood ? (currentLanguage === "ar" ? `مزاجك اليوم: ${moodLabels[todayMood.mood].ar}. يمكنك تحديثه في أي وقت.` : `Today: ${moodLabels[todayMood.mood].en}. You can update it anytime.`) : (currentLanguage === "ar" ? "سجّل شعورك في ثوانٍ وشاهد نمطك خلال الأسبوع." : "Log your feeling in seconds and see your weekly pattern.");
    }

    document.getElementById("openMoodButton")?.addEventListener("click", () => openModal(moodModal));
    document.querySelectorAll("#moodOptions button").forEach(button => button.addEventListener("click", () => saveMood(button.dataset.mood)));
    document.getElementById("openBreathingButton")?.addEventListener("click", () => {
        clearInterval(breathingInterval); breathingInterval = null; breathingRemaining = 32; breathingStage?.classList.remove("is-running", "is-exhale");
        if (breathingPhase) breathingPhase.textContent = currentLanguage === "ar" ? "استعد" : "Get ready";
        if (breathingTimer) breathingTimer.textContent = "00:32";
        if (startBreathingButton) { startBreathingButton.disabled = false; startBreathingButton.textContent = currentLanguage === "ar" ? "ابدأ 32 ثانية" : "Start 32 seconds"; }
        openModal(breathingModal);
    });
    startBreathingButton?.addEventListener("click", () => {
        if (breathingInterval) return;
        startBreathingButton.disabled = true;
        breathingRemaining = 32;
        const tick = () => {
            breathingRemaining--;
            const elapsed = 32 - breathingRemaining;
            const inhale = Math.floor(elapsed / 4) % 2 === 0;
            breathingStage?.classList.toggle("is-exhale", !inhale);
            breathingStage?.classList.add("is-running");
            if (breathingPhase) breathingPhase.textContent = inhale ? (currentLanguage === "ar" ? "شهيق" : "Inhale") : (currentLanguage === "ar" ? "زفير" : "Exhale");
            if (breathingTimer) breathingTimer.textContent = `00:${String(Math.max(0, breathingRemaining)).padStart(2, "0")}`;
            if (breathingRemaining <= 0) {
                clearInterval(breathingInterval); breathingInterval = null; breathingStage?.classList.remove("is-running", "is-exhale");
                if (breathingPhase) breathingPhase.textContent = currentLanguage === "ar" ? "أحسنت" : "Well done";
                if (startBreathingButton) { startBreathingButton.disabled = false; startBreathingButton.textContent = currentLanguage === "ar" ? "ابدأ من جديد" : "Start again"; }
            }
        };
        tick(); breathingInterval = setInterval(tick, 1000);
    });
    document.getElementById("openJournalButton")?.addEventListener("click", () => { if (journalText) journalText.value = safeStorage.get("mindcare-journal") || ""; if (journalCount) journalCount.textContent = `${journalText?.value.length || 0} / 1000`; openModal(journalModal); });
    journalText?.addEventListener("input", () => { if (journalCount) journalCount.textContent = `${journalText.value.length} / 1000`; });
    document.getElementById("saveJournalButton")?.addEventListener("click", () => { const saved = safeStorage.set("mindcare-journal", journalText?.value || ""); if (journalStatus) journalStatus.textContent = saved ? (currentLanguage === "ar" ? "تم الحفظ على جهازك ✓" : "Saved on your device ✓") : (currentLanguage === "ar" ? "تعذّر الحفظ في هذا المتصفح." : "Couldn't save in this browser."); });
    renderMoodHistory();

    /* =====================================================
       FAQ
    ===================================================== */

    document
        .querySelectorAll(".faq-question")
        .forEach(question => {

            question.addEventListener(
                "click",
                () => {

                    const item =
                        question.closest(
                            ".faq-item"
                        );

                    if (!item) return;

                    document
                        .querySelectorAll(".faq-item")
                        .forEach(other => {

                            if (other !== item) {
                                other.classList.remove(
                                    "active"
                                );
                            }

                        });

                    item.classList.toggle(
                        "active"
                    );

                }
            );

        });


    /* =====================================================
       NAVBAR SCROLL
    ===================================================== */

    const header =
        document.getElementById(
            "siteHeader"
        );

    window.addEventListener(
        "scroll",
        () => {

            if (!header) return;

            header.classList.toggle(
                "scrolled",
                window.scrollY > 20
            );

        },
        { passive: true }
    );


    /* =====================================================
       ACTIVE NAV
    ===================================================== */

    const sections =
        document.querySelectorAll(
            "main section[id]"
        );

    const navLinks =
        document.querySelectorAll(
            ".nav-link"
        );

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        navLinks.forEach(
                            link => {

                                link.classList.remove(
                                    "active"
                                );

                                if (
                                    link.getAttribute(
                                        "href"
                                    ) ===
                                    "#" + entry.target.id
                                ) {

                                    link.classList.add(
                                        "active"
                                    );

                                }

                            }
                        );

                    }

                });

            },
            {
                rootMargin:
                    "-30% 0px -60% 0px"
            }
        );


    sections.forEach(
        section =>
            observer.observe(section)
    );


    /* =====================================================
       PREVENT INVALID BOOKING DATE
    ===================================================== */

    const bookingDate =
        document.getElementById(
            "bookingDate"
        );

    if (bookingDate) {

        const today =
            new Date()
                .toISOString()
                .split("T")[0];

        bookingDate.min = today;

    }


    /* =====================================================
       PREMIUM INTERACTION LAYER
       Scroll reveal, progress, parallax and micro-interactions
    ===================================================== */

    const progressBar = document.createElement("div");
    progressBar.className = "scroll-progress";
    progressBar.setAttribute("aria-hidden", "true");
    document.body.prepend(progressBar);

    const updateScrollProgress = () => {

        const scrollable =
            document.documentElement.scrollHeight - window.innerHeight;

        const progress = scrollable > 0
            ? (window.scrollY / scrollable) * 100
            : 0;

        progressBar.style.width = `${progress}%`;
    };

    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    updateScrollProgress();


    const revealTargets = document.querySelectorAll(
        "main section, .topic-card, .specialist-card, .step-card, .faq-item, .article-card, .approach-card, .privacy-section"
    );

    revealTargets.forEach((element, index) => {

        element.classList.add("mc-reveal");
        element.style.setProperty(
            "--reveal-delay",
            `${Math.min((index % 5) * 70, 280)}ms`
        );
    });

    const revealObserver = new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    revealObserver.unobserve(entry.target);
                }

            });
        },
        {
            threshold: 0.10,
            rootMargin: "0px 0px -50px 0px"
        }
    );

    revealTargets.forEach(element => revealObserver.observe(element));
    revealReady = true;


    const hero = document.querySelector(".hero-section");
    const heroShapes = document.querySelectorAll(".hero-shape");

    if (hero && window.matchMedia("(pointer:fine)").matches) {

        hero.addEventListener("pointermove", event => {

            const rect = hero.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;

            heroShapes.forEach((shape, index) => {

                const depth = index === 0 ? 14 : -10;

                shape.style.transform =
                    `translate3d(${x * depth}px, ${y * depth}px, 0)`;
            });
        });

        hero.addEventListener("pointerleave", () => {
            heroShapes.forEach(shape => {
                shape.style.transform = "translate3d(0,0,0)";
            });
        });
    }


    const interactiveCards = document.querySelectorAll(
        ".topic-card, .provider, .method-card, .article-card"
    );

    if (window.matchMedia("(pointer:fine)").matches) {

        interactiveCards.forEach(card => {

            card.addEventListener("pointermove", event => {

                const rect = card.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width;
                const y = (event.clientY - rect.top) / rect.height;
                const rotateX = (0.5 - y) * 3;
                const rotateY = (x - 0.5) * 3;

                card.style.setProperty(
                    "--mc-tilt",
                    `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`
                );
            });

            card.addEventListener("pointerleave", () => {
                card.style.setProperty(
                    "--mc-tilt",
                    "perspective(900px) rotateX(0) rotateY(0) translateY(0)"
                );
            });
        });
    }


    document.querySelectorAll("a[href^='#']").forEach(link => {

        link.addEventListener("click", event => {

            const targetId = link.getAttribute("href");
            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);
            if (!target) return;

            event.preventDefault();

            const headerHeight =
                document.getElementById("siteHeader")?.offsetHeight || 84;

            const top =
                target.getBoundingClientRect().top +
                window.scrollY -
                headerHeight -
                14;

            window.scrollTo({
                top,
                behavior: "smooth"
            });
        });
    });


    document.querySelectorAll(".btn, .language-switch, .menu-toggle").forEach(button => {

        button.addEventListener("pointerdown", () => {
            button.classList.add("is-pressed");
        });

        button.addEventListener("pointerup", () => {
            button.classList.remove("is-pressed");
        });

        button.addEventListener("pointercancel", () => {
            button.classList.remove("is-pressed");
        });
    });


    document.addEventListener("visibilitychange", () => {

        if (document.hidden) {
            document.body.classList.add("page-paused");
        } else {
            document.body.classList.remove("page-paused");
        }
    });


    /* =====================================================
       INITIALIZE
    ===================================================== */

    setLanguage(currentLanguage);

});
