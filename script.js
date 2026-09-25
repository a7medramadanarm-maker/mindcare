here/* =========================================================
   MINDCARE
   Interactive Mental Wellness Website
   Prepared By: Eng Ahmad Ramadan

   Features:
   - Arabic / English
   - RTL / LTR
   - Interactive mental-health topics
   - Reliable source links
   - Specialist profiles
   - Booking modal
   - Date + time + AM/PM
   - Local booking storage
   - Assessment
   - FAQ accordion
   - Mobile navigation
   - Provider selection
   - Admin-ready data structure
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";

    /* =====================================================
       CONFIG
    ===================================================== */

    const CONFIG = {
        whatsapp: "201003089153",

        storage: {
            language: "mindcare_language",
            bookings: "mindcare_bookings",
            availability: "mindcare_availability",
            specialists: "mindcare_specialists"
        }
    };


    /* =====================================================
       HELPERS
    ===================================================== */

    const $ = (selector, parent = document) =>
        parent.querySelector(selector);

    const $$ = (selector, parent = document) =>
        [...parent.querySelectorAll(selector)];

    const getStorage = (key, fallback = null) => {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : fallback;
        } catch {
            return fallback;
        }
    };

    const setStorage = (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    };

    const escapeHTML = (value = "") => {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };


    /* =====================================================
       LANGUAGE
    ===================================================== */

    let currentLanguage =
        localStorage.getItem(CONFIG.storage.language) || "ar";


    /* =====================================================
       TOPICS DATABASE
    ===================================================== */

    const topics = {

        anxiety: {
            icon: "fa-solid fa-wind",

            ar: {
                title: "القلق والتوتر",

                intro:
                    "القلق شعور طبيعي يمكن أن يظهر عند مواجهة ضغوط أو مواقف غير مؤكدة. لكن عندما يصبح القلق مستمرًا أو شديدًا ويؤثر في الحياة اليومية، فقد يكون من المفيد التحدث مع مختص.",

                what:
                    "اضطرابات القلق تتجاوز القلق العابر، وقد تتضمن شعورًا مستمرًا بالخوف أو التوتر وصعوبة في التحكم في القلق.",

                symptoms: [
                    "القلق أو التفكير الزائد بشكل متكرر",
                    "صعوبة التحكم في القلق",
                    "الشعور بالتوتر أو أنك على حافة الانفعال",
                    "صعوبة الاسترخاء",
                    "صعوبة التركيز",
                    "اضطرابات النوم",
                    "الإرهاق",
                    "توتر أو آلام عضلية",
                    "التعرق أو الدوخة أو ضيق التنفس في بعض الحالات"
                ],

                when:
                    "وجود عرض واحد لا يعني أنك مصاب باضطراب قلق. يصبح التقييم المهني أكثر أهمية عندما تستمر الأعراض أو تتكرر أو تؤثر بوضوح على الدراسة أو العمل أو النوم أو العلاقات.",

                advice:
                    "إذا كانت الأعراض مستمرة أو تؤثر على حياتك، تحدث مع طبيب أو أخصائي نفسي مؤهل بدلًا من محاولة تشخيص نفسك.",

                sourceName: "National Institute of Mental Health (NIMH)",
                sourceUrl:
                    "https://www.nimh.nih.gov/health/publications/generalized-anxiety-disorder-gad"
            },

            en: {
                title: "Anxiety & Stress",

                intro:
                    "Anxiety is a normal emotional response that can appear during stressful or uncertain situations. When anxiety becomes persistent, intense, or disruptive to daily life, professional support may be helpful.",

                what:
                    "Anxiety disorders involve more than occasional worry and may include persistent fear, nervousness, and difficulty controlling worry.",

                symptoms: [
                    "Excessive or repeated worry",
                    "Difficulty controlling worry",
                    "Feeling restless or on edge",
                    "Difficulty relaxing",
                    "Difficulty concentrating",
                    "Sleep problems",
                    "Fatigue",
                    "Muscle tension or aches",
                    "Sweating, dizziness, or shortness of breath in some cases"
                ],

                when:
                    "Having one symptom does not mean that you have an anxiety disorder. Professional evaluation becomes more important when symptoms persist, recur, or interfere with work, study, sleep, or relationships.",

                advice:
                    "If symptoms continue or interfere with your life, consider speaking with a qualified mental-health professional rather than self-diagnosing.",

                sourceName: "National Institute of Mental Health (NIMH)",
                sourceUrl:
                    "https://www.nimh.nih.gov/health/publications/generalized-anxiety-disorder-gad"
            }
        },


        depression: {
            icon: "fa-regular fa-cloud",

            ar: {
                title: "الاكتئاب",

                intro:
                    "الاكتئاب ليس مجرد حزن عابر. قد يتضمن تغيرات مستمرة في المزاج أو الاهتمام بالأنشطة والطاقة والتركيز والنوم والشهية.",

                what:
                    "الاكتئاب اضطراب يمكن أن يؤثر في المشاعر والتفكير والسلوك والقدرة على أداء الأنشطة اليومية.",

                symptoms: [
                    "مزاج حزين أو فارغ أو منخفض لفترة مستمرة",
                    "فقدان الاهتمام أو المتعة في الأنشطة",
                    "الشعور باليأس أو عدم القيمة",
                    "التعب أو انخفاض الطاقة",
                    "صعوبة التركيز أو اتخاذ القرارات",
                    "تغيرات في النوم",
                    "تغيرات في الشهية أو الوزن",
                    "الانسحاب من الآخرين",
                    "زيادة التهيج أو الغضب",
                    "أفكار عن الموت أو الانتحار"
                ],

                when:
                    "التشخيص لا يعتمد على عرض واحد. وفقًا لـNIMH، يتطلب تشخيص الاكتئاب تقييمًا للأعراض ومدتها وتأثيرها، وقد تكون هناك أسباب طبية أخرى لأعراض مشابهة.",

                advice:
                    "إذا استمرت الأعراض أو أثرت في حياتك اليومية، تحدث مع طبيب أو أخصائي صحة نفسية.",

                sourceName: "National Institute of Mental Health (NIMH)",
                sourceUrl:
                    "https://www.nimh.nih.gov/health/publications/depression"
            },

            en: {
                title: "Depression",

                intro:
                    "Depression is more than temporary sadness. It can involve persistent changes in mood, interest, energy, concentration, sleep, and appetite.",

                what:
                    "Depression is a condition that can affect emotions, thoughts, behavior, and the ability to carry out everyday activities.",

                symptoms: [
                    "Persistent sad, empty, or low mood",
                    "Loss of interest or pleasure",
                    "Hopelessness or feelings of worthlessness",
                    "Fatigue or low energy",
                    "Difficulty concentrating or making decisions",
                    "Changes in sleep",
                    "Changes in appetite or weight",
                    "Social withdrawal",
                    "Increased irritability or anger",
                    "Thoughts of death or suicide"
                ],

                when:
                    "Diagnosis is not based on one symptom. A professional assessment considers symptoms, duration, impact, and possible medical causes.",

                advice:
                    "If symptoms persist or interfere with daily life, consider speaking with a qualified healthcare or mental-health professional.",

                sourceName: "National Institute of Mental Health (NIMH)",
                sourceUrl:
                    "https://www.nimh.nih.gov/health/publications/depression"
            }
        },


        panic: {
            icon: "fa-solid fa-heart-pulse",

            ar: {
                title: "نوبات الهلع",

                intro:
                    "نوبة الهلع هي فترة مفاجئة من الخوف أو الانزعاج الشديد قد يصاحبها عدد من الأعراض الجسدية والنفسية.",

                what:
                    "قد تحدث نوبات الهلع بشكل مفاجئ، وقد يشعر الشخص خلالها بأنه يفقد السيطرة أو أن شيئًا خطيرًا سيحدث.",

                symptoms: [
                    "خفقان أو تسارع ضربات القلب",
                    "التعرق",
                    "الارتجاف",
                    "ضيق التنفس",
                    "الدوخة أو الضعف",
                    "ألم في الصدر",
                    "الغثيان أو ألم المعدة",
                    "الشعور بالخوف الشديد",
                    "الشعور بفقدان السيطرة",
                    "الخوف من حدوث نوبة أخرى"
                ],

                when:
                    "نوبة هلع واحدة لا تعني بالضرورة وجود اضطراب هلع. التقييم المهني مهم إذا تكررت النوبات أو أصبح الخوف منها يؤثر على حياتك.",

                advice:
                    "بعض أعراض نوبة الهلع يمكن أن تشبه أعراض حالات طبية أخرى. إذا كانت الأعراض شديدة أو غير معتادة أو لديك ألم صدر أو صعوبة تنفس، اطلب تقييمًا طبيًا مناسبًا.",

                sourceName: "National Institute of Mental Health (NIMH)",
                sourceUrl:
                    "https://www.nimh.nih.gov/health/publications/panic-disorder-when-fear-overwhelms"
            },

            en: {
                title: "Panic Attacks",

                intro:
                    "A panic attack is a sudden period of intense fear or discomfort that may involve several physical and emotional symptoms.",

                what:
                    "Panic attacks can occur unexpectedly and may make a person feel out of control or afraid that something terrible is happening.",

                symptoms: [
                    "Racing or pounding heart",
                    "Sweating",
                    "Trembling",
                    "Difficulty breathing",
                    "Dizziness or weakness",
                    "Chest pain",
                    "Nausea or stomach discomfort",
                    "Intense fear",
                    "Feeling out of control",
                    "Fear of another attack"
                ],

                when:
                    "One panic attack does not necessarily mean panic disorder. Professional evaluation is useful when attacks recur or fear of another attack interferes with daily life.",

                advice:
                    "Some panic symptoms can resemble medical emergencies. Seek appropriate medical care for severe, unusual, or concerning symptoms.",

                sourceName: "National Institute of Mental Health (NIMH)",
                sourceUrl:
                    "https://www.nimh.nih.gov/health/publications/panic-disorder-when-fear-overwhelms"
            }
        },


        ocd: {
            icon: "fa-solid fa-arrows-rotate",

            ar: {
                title: "الوسواس القهري",

                intro:
                    "الوسواس القهري يتضمن أفكارًا أو دوافع متكررة وغير مرغوبة، وقد يتضمن سلوكيات متكررة يشعر الشخص بأنه مضطر للقيام بها.",

                what:
                    "الأفكار الوسواسية قد تكون مزعجة ومتكررة، بينما الأفعال القهرية هي سلوكيات أو طقوس متكررة قد يقوم بها الشخص لتخفيف القلق.",

                symptoms: [
                    "أفكار متكررة وغير مرغوبة",
                    "الخوف الشديد من التلوث أو الجراثيم",
                    "الفحص المتكرر",
                    "الترتيب أو التنظيم بشكل مفرط",
                    "العد أو تكرار كلمات أو أفعال",
                    "الحاجة إلى التأكد من الأشياء بشكل متكرر",
                    "الشعور بصعوبة التحكم في الأفكار أو السلوكيات",
                    "استغراق هذه الأعراض وقتًا كبيرًا",
                    "تأثير الأعراض على الحياة اليومية"
                ],

                when:
                    "وجود أفكار متكررة أو عادة معينة لا يعني تلقائيًا الإصابة بالوسواس القهري. يصبح الأمر أكثر أهمية عندما تكون الأفكار أو الأفعال صعبة التحكم وتسبب ضيقًا أو تعطل الحياة اليومية.",

                advice:
                    "إذا كانت هذه الأفكار أو السلوكيات تستهلك وقتًا كبيرًا أو تسبب ضيقًا واضحًا، تحدث مع مختص بالصحة النفسية.",

                sourceName: "National Institute of Mental Health (NIMH)",
                sourceUrl:
                    "https://www.nimh.nih.gov/health/publications/obsessive-compulsive-disorder-when-unwanted-thoughts-and-repetitive-behaviors-take-over"
            },

            en: {
                title: "Obsessive-Compulsive Disorder",

                intro:
                    "OCD involves recurring unwanted thoughts, urges, or images and/or repetitive behaviors that a person feels driven to perform.",

                what:
                    "Obsessions are intrusive thoughts or urges, while compulsions are repetitive behaviors or mental acts that may temporarily reduce anxiety.",

                symptoms: [
                    "Recurring unwanted thoughts",
                    "Fear of contamination",
                    "Repeated checking",
                    "Excessive ordering or arranging",
                    "Counting or repeating words or actions",
                    "Repeatedly seeking certainty",
                    "Difficulty controlling the thoughts or behaviors",
                    "Symptoms taking significant time",
                    "Interference with daily life"
                ],

                when:
                    "Having repeated thoughts or habits does not automatically mean OCD. It becomes more concerning when symptoms are difficult to control, distressing, or disruptive.",

                advice:
                    "If symptoms take significant time or cause distress, consider speaking with a qualified mental-health professional.",

                sourceName: "National Institute of Mental Health (NIMH)",
                sourceUrl:
                    "https://www.nimh.nih.gov/health/publications/obsessive-compulsive-disorder-when-unwanted-thoughts-and-repetitive-behaviors-take-over"
            }
        },


        trauma: {
            icon: "fa-solid fa-feather",

            ar: {
                title: "الصدمات النفسية",

                intro:
                    "بعد تجربة مؤلمة أو خطيرة، قد تظهر مجموعة من الاستجابات النفسية والجسدية. كثير من الناس يتحسنون تدريجيًا مع الوقت.",

                what:
                    "قد تشمل الاستجابات بعد الصدمة الخوف أو الحزن أو الغضب وصعوبة النوم والتركيز والتفكير المتكرر في الحدث.",

                symptoms: [
                    "ذكريات أو أحلام مزعجة مرتبطة بالحدث",
                    "تجنب أماكن أو مواقف تذكر بالحدث",
                    "الشعور بالتوتر أو الحذر الشديد",
                    "سهولة الفزع",
                    "صعوبة التركيز",
                    "مشكلات النوم",
                    "مشاعر الخوف أو الغضب أو الذنب",
                    "العزلة عن الآخرين",
                    "فقدان الاهتمام ببعض الأنشطة"
                ],

                when:
                    "ليس كل من يمر بتجربة صادمة يصاب باضطراب ما بعد الصدمة. يصبح طلب المساعدة أكثر أهمية عندما تستمر الأعراض وتؤثر على العلاقات أو العمل أو الحياة اليومية.",

                advice:
                    "إذا لم تتحسن الأعراض مع الوقت أو أصبحت تعيق حياتك، تحدث مع مختص بالصحة النفسية.",

                sourceName: "National Institute of Mental Health (NIMH)",
                sourceUrl:
                    "https://www.nimh.nih.gov/health/publications/post-traumatic-stress-disorder-ptsd"
            },

            en: {
                title: "Trauma & PTSD",

                intro:
                    "After a traumatic or dangerous experience, people may experience emotional and physical reactions. Many people gradually recover over time.",

                what:
                    "Post-trauma reactions may include fear, sadness, anger, sleep difficulties, concentration problems, and repeated thoughts about what happened.",

                symptoms: [
                    "Distressing memories or dreams",
                    "Avoiding reminders of the event",
                    "Feeling tense or constantly alert",
                    "Being easily startled",
                    "Difficulty concentrating",
                    "Sleep problems",
                    "Fear, anger, guilt, or shame",
                    "Social withdrawal",
                    "Loss of interest in activities"
                ],

                when:
                    "Not everyone who experiences trauma develops PTSD. Professional support is particularly important when symptoms persist and interfere with work, relationships, or daily life.",

                advice:
                    "If symptoms do not improve over time or interfere with your life, consider speaking with a qualified mental-health professional.",

                sourceName: "National Institute of Mental Health (NIMH)",
                sourceUrl:
                    "https://www.nimh.nih.gov/health/publications/post-traumatic-stress-disorder-ptsd"
            }
        },


        sleep: {
            icon: "fa-regular fa-moon",

            ar: {
                title: "النوم والصحة النفسية",

                intro:
                    "النوم الجيد جزء مهم من الصحة العامة. قلة النوم قد تؤثر على التركيز والتعلم والمزاج والقدرة على التعامل مع الضغوط.",

                what:
                    "النوم غير الكافي أو غير الجيد قد يؤثر في الأداء اليومي والقدرة على التركيز واتخاذ القرارات وتنظيم المشاعر.",

                symptoms: [
                    "التعب أثناء النهار",
                    "صعوبة التركيز",
                    "ضعف الانتباه",
                    "مشكلات في التعلم أو الذاكرة",
                    "تغيرات في المزاج",
                    "صعوبة التعامل مع الضغوط",
                    "الشعور بعدم الانتعاش بعد الاستيقاظ"
                ],

                when:
                    "إذا كانت مشكلات النوم مستمرة أو تؤثر بوضوح على حياتك اليومية، فقد يكون من المفيد مناقشتها مع مختص.",

                advice:
                    "لا تفترض أن كل مشكلة نوم سببها نفسي؛ بعض اضطرابات النوم أو الحالات الطبية تحتاج إلى تقييم متخصص.",

                sourceName: "National Heart, Lung, and Blood Institute (NHLBI)",
                sourceUrl:
                    "https://www.nhlbi.nih.gov/health/sleep-deprivation/health-effects"
            },

            en: {
                title: "Sleep & Mental Health",

                intro:
                    "Quality sleep is an important part of overall health. Sleep deficiency can affect concentration, learning, mood, and the ability to cope with stress.",

                what:
                    "Insufficient or poor-quality sleep can affect daily performance, attention, decision-making, and emotional regulation.",

                symptoms: [
                    "Daytime fatigue",
                    "Difficulty concentrating",
                    "Reduced attention",
                    "Learning or memory problems",
                    "Mood changes",
                    "Difficulty coping with stress",
                    "Not feeling refreshed after waking"
                ],

                when:
                    "If sleep problems persist or clearly affect your daily life, discussing them with a qualified professional may be helpful.",

                advice:
                    "Not every sleep problem is psychological; some sleep disorders and medical conditions require professional evaluation.",

                sourceName: "National Heart, Lung, and Blood Institute (NHLBI)",
                sourceUrl:
                    "https://www.nhlbi.nih.gov/health/sleep-deprivation/health-effects"
            }
        },


        addiction: {
            icon: "fa-solid fa-link",

            ar: {
                title: "الإدمان واستخدام المواد",

                intro:
                    "اضطراب استخدام المواد قد يجعل الشخص يستمر في استخدام مادة رغم المشكلات أو الأضرار المرتبطة بها.",

                what:
                    "قد يؤثر اضطراب استخدام المواد على الصحة والعلاقات والدراسة والعمل والقدرة على التحكم في الاستخدام.",

                symptoms: [
                    "صعوبة التحكم في الاستخدام",
                    "الرغبة الشديدة في استخدام المادة",
                    "استمرار الاستخدام رغم الأضرار",
                    "تأثر الدراسة أو العمل",
                    "تأثر العلاقات",
                    "إهمال مسؤوليات مهمة",
                    "محاولات غير ناجحة للتقليل أو التوقف"
                ],

                when:
                    "لا تحتاج إلى انتظار حدوث أزمة حتى تطلب المساعدة. إذا كان الاستخدام يسبب مشكلات أو يصعب التحكم فيه، يمكن التحدث مع مختص.",

                advice:
                    "طلب المساعدة لا يعني الضعف. العلاج والدعم المتخصصان يمكن أن يساعدا في التعامل مع اضطرابات استخدام المواد.",

                sourceName: "National Institute on Drug Abuse (NIDA)",
                sourceUrl:
                    "https://nida.nih.gov/research-topics/addiction-science"
            },

            en: {
                title: "Addiction & Substance Use",

                intro:
                    "Substance use disorder can make it difficult for a person to stop using a substance despite problems or harm related to its use.",

                what:
                    "Substance use problems can affect health, relationships, education, work, and the ability to control use.",

                symptoms: [
                    "Difficulty controlling use",
                    "Strong cravings",
                    "Continued use despite harm",
                    "Problems at school or work",
                    "Relationship problems",
                    "Neglecting important responsibilities",
                    "Unsuccessful attempts to cut down or stop"
                ],

                when:
                    "You do not have to wait for a crisis before seeking help. If use causes problems or feels difficult to control, professional support can be appropriate.",

                advice:
                    "Asking for help is not a sign of weakness. Professional treatment and support can help people manage substance-use disorders.",

                sourceName: "National Institute on Drug Abuse (NIDA)",
                sourceUrl:
                    "https://nida.nih.gov/research-topics/addiction-science"
            }
        },


        "self-esteem": {
            icon: "fa-regular fa-heart",

            ar: {
                title: "الثقة بالنفس وتقدير الذات",

                intro:
                    "تقدير الذات يرتبط بالطريقة التي ينظر بها الشخص إلى نفسه وقيمته وقدرته على التعامل مع التحديات.",

                what:
                    "قد يظهر انخفاض تقدير الذات في صورة نقد مستمر للنفس أو مقارنة مفرطة بالآخرين أو خوف شديد من الفشل.",

                symptoms: [
                    "النقد المستمر للنفس",
                    "الشعور بعدم الكفاية",
                    "الخوف الشديد من الفشل",
                    "المقارنة المستمرة بالآخرين",
                    "صعوبة وضع الحدود",
                    "الحاجة المستمرة إلى قبول الآخرين"
                ],

                when:
                    "إذا أثرت هذه الأنماط على علاقاتك أو دراستك أو عملك أو قراراتك، فقد يكون من المفيد مناقشتها مع مختص.",

                advice:
                    "تقدير الذات ليس تشخيصًا طبيًا، ولا توجد قائمة أعراض واحدة تحدد قيمتك أو شخصيتك.",

                sourceName: "MindCare Educational Content",
                sourceUrl:
                    "https://www.nimh.nih.gov/health"
            },

            en: {
                title: "Self-Esteem",

                intro:
                    "Self-esteem relates to how a person views their own value and ability to deal with challenges.",

                what:
                    "Low self-esteem may appear as persistent self-criticism, excessive comparison, or strong fear of failure.",

                symptoms: [
                    "Persistent self-criticism",
                    "Feeling inadequate",
                    "Strong fear of failure",
                    "Constant comparison with others",
                    "Difficulty setting boundaries",
                    "Strong need for approval"
                ],

                when:
                    "If these patterns affect relationships, study, work, or important decisions, professional support may be useful.",

                advice:
                    "Self-esteem is not a medical diagnosis, and no single symptom determines your value or personality.",

                sourceName: "MindCare Educational Content",
                sourceUrl:
                    "https://www.nimh.nih.gov/health"
            }
        },


        relationships: {
            icon: "fa-solid fa-heart",

            ar: {
                title: "العلاقات العاطفية",

                intro:
                    "العلاقات الصحية تحتاج إلى تواصل واضح وحدود واحترام متبادل.",

                what:
                    "يمكن أن تتأثر العلاقات بأنماط التواصل والخلافات المتكررة والغيرة والتعلق والخوف من الانفصال.",

                symptoms: [
                    "الخلافات المتكررة",
                    "صعوبة التعبير عن الاحتياجات",
                    "صعوبة وضع الحدود",
                    "الخوف الشديد من الانفصال",
                    "الغيرة المستمرة",
                    "مشكلات الثقة"
                ],

                when:
                    "عندما تصبح المشكلات متكررة أو تؤثر على الأمان النفسي أو الحياة اليومية، قد يكون الدعم المتخصص مفيدًا.",

                advice:
                    "الدعم النفسي لا يهدف إلى اتخاذ قرارات العلاقة بدلًا منك، بل يمكن أن يساعدك على فهم الأنماط والتواصل بشكل أفضل.",

                sourceName: "MindCare Educational Content",
                sourceUrl:
                    "https://www.nimh.nih.gov/health"
            },

            en: {
                title: "Romantic Relationships",

                intro:
                    "Healthy relationships often require clear communication, boundaries, and mutual respect.",

                what:
                    "Relationships can be affected by communication patterns, recurring conflicts, jealousy, attachment, and fear of separation.",

                symptoms: [
                    "Repeated conflicts",
                    "Difficulty expressing needs",
                    "Difficulty setting boundaries",
                    "Strong fear of separation",
                    "Persistent jealousy",
                    "Trust difficulties"
                ],

                when:
                    "When relationship difficulties become persistent or affect emotional safety or daily life, professional support may help.",

                advice:
                    "Mental-health support does not make relationship decisions for you. It can help you understand patterns and communicate more effectively.",

                sourceName: "MindCare Educational Content",
                sourceUrl:
                    "https://www.nimh.nih.gov/health"
            }
        },


        family: {
            icon: "fa-solid fa-house",

            ar: {
                title: "العلاقات الأسرية",

                intro:
                    "العلاقات الأسرية قد تتأثر بالاختلافات في التوقعات والتواصل والحدود والضغوط اليومية.",

                what:
                    "فهم طريقة التواصل ووضع الحدود والتعامل مع الخلافات يمكن أن يساعد في بناء علاقات أكثر وضوحًا.",

                symptoms: [
                    "خلافات متكررة",
                    "صعوبة التواصل",
                    "عدم وضوح الحدود",
                    "الشعور بعدم الفهم",
                    "توتر مستمر داخل الأسرة"
                ],

                when:
                    "إذا أصبح التوتر الأسري يؤثر في صحتك النفسية أو حياتك اليومية، يمكن التفكير في طلب دعم متخصص.",

                advice:
                    "المختص يمكنه مساعدتك على فهم الموقف ووضع حدود وتطوير طرق تواصل مناسبة.",

                sourceName: "MindCare Educational Content",
                sourceUrl:
                    "https://www.nimh.nih.gov/health"
            },

            en: {
                title: "Family Relationships",

                intro:
                    "Family relationships can be affected by differences in expectations, communication, boundaries, and daily stress.",

                what:
                    "Understanding communication patterns, boundaries, and conflict can support healthier relationships.",

                symptoms: [
                    "Repeated conflict",
                    "Communication difficulties",
                    "Unclear boundaries",
                    "Feeling misunderstood",
                    "Persistent family tension"
                ],

                when:
                    "If family tension affects your mental health or daily life, professional support may be worth considering.",

                advice:
                    "A qualified professional can help you understand the situation, establish boundaries, and develop healthier communication patterns.",

                sourceName: "MindCare Educational Content",
                sourceUrl:
                    "https://www.nimh.nih.gov/health"
            }
        },


        communication: {
            icon: "fa-solid fa-comments",

            ar: {
                title: "التواصل والحدود",

                intro:
                    "التواصل الواضح والحدود الصحية يساعدان على التعبير عن الاحتياجات وفهم احتياجات الآخرين.",

                what:
                    "الحدود هي قواعد أو احتياجات تساعدك على تحديد ما تقبله وما لا تقبله في علاقاتك.",

                symptoms: [
                    "صعوبة قول لا",
                    "الخوف من إزعاج الآخرين",
                    "الموافقة على أشياء لا تريدها",
                    "تجنب الحديث عن الاحتياجات",
                    "صعوبة التعامل مع الخلاف"
                ],

                when:
                    "إذا أصبحت هذه الأنماط سببًا مستمرًا للتوتر أو المشكلات في العلاقات، قد يكون من المفيد التحدث مع مختص.",

                advice:
                    "وضع الحدود لا يعني قطع العلاقات؛ الهدف هو بناء تواصل أكثر وضوحًا واحترامًا.",

                sourceName: "MindCare Educational Content",
                sourceUrl:
                    "https://www.nimh.nih.gov/health"
            },

            en: {
                title: "Communication & Boundaries",

                intro:
                    "Clear communication and healthy boundaries can help people express their needs and understand others.",

                what:
                    "Boundaries are limits or needs that help define what you are and are not comfortable accepting in relationships.",

                symptoms: [
                    "Difficulty saying no",
                    "Fear of upsetting others",
                    "Agreeing to things you do not want",
                    "Avoiding conversations about needs",
                    "Difficulty handling conflict"
                ],

                when:
                    "If these patterns repeatedly create stress or relationship problems, professional support may be useful.",

                advice:
                    "Setting boundaries does not automatically mean ending relationships. The goal is clearer and more respectful communication.",

                sourceName: "MindCare Educational Content",
                sourceUrl:
                    "https://www.nimh.nih.gov/health"
            }
        }
    };


    /* =====================================================
       SPECIALISTS
    ===================================================== */

    const defaultSpecialists = {

        tasbeh: {
            name: "Tasbeh Mohamed",
            initials: "T",
            label: "CLINICAL PSYCHOLOGY",

            ar: {
                title: "Tasbeh Mohamed",
                bio:
                    "حاصلة على دبلومة في علم النفس الإكلينيكي، وخريجة قسم علم النفس الإكلينيكي بكلية الآداب، مع اهتمام بالصحة النفسية والعلاقات والنمو الشخصي.",
                areas: [
                    "الصحة النفسية",
                    "العلاقات",
                    "النمو الشخصي",
                    "تقدير الذات",
                    "الدعم النفسي"
                ]
            },

            en: {
                title: "Tasbeh Mohamed",
                bio:
                    "Clinical psychology professional with a diploma in clinical psychology and a background in clinical psychology, with interests in mental wellbeing, relationships, and personal growth.",
                areas: [
                    "Mental wellbeing",
                    "Relationships",
                    "Personal growth",
                    "Self-esteem",
                    "Emotional support"
                ]
            }
        },

        mariam: {
            name: "Mariam Mahmoud",
            initials: "M",
            label: "CLINICAL PSYCHOLOGY",

            ar: {
                title: "Mariam Mahmoud",
                bio:
                    "حاصلة على دبلومة في علم النفس الإكلينيكي، وخريجة قسم علم النفس الإكلينيكي بكلية الآداب، مع اهتمام بالمشاعر والعلاقات والتحديات الشخصية.",
                areas: [
                    "المشاعر",
                    "العلاقات",
                    "التحديات الشخصية",
                    "النمو الشخصي",
                    "الدعم النفسي"
                ]
            },

            en: {
                title: "Mariam Mahmoud",
                bio:
                    "Clinical psychology professional with a diploma in clinical psychology and a background in clinical psychology, with interests in emotions, relationships, personal challenges, and personal growth.",
                areas: [
                    "Emotions",
                    "Relationships",
                    "Personal challenges",
                    "Personal growth",
                    "Emotional support"
                ]
            }
        }
    };


    /* =====================================================
       MODALS
    ===================================================== */

    const topicModal = $("#topicModal");
    const providerModal = $("#providerModal");
    const bookingModal = $("#bookingModal");
    const assessmentModal = $("#assessmentModal");

    const topicModalContent = $("#topicModalContent");
    const providerModalContent = $("#providerModalContent");


    function openModal(modal) {

        if (!modal) return;

        modal.classList.add("active");
        document.body.classList.add("modal-open");

        const box = $(".modal-box", modal);

        if (box) {
            box.scrollTop = 0;
        }
    }


    function closeModal(modal) {

        if (!modal) return;

        modal.classList.remove("active");

        if (!$(".modal.active")) {
            document.body.classList.remove("modal-open");
        }
    }


    function closeAllModals() {

        $$(".modal.active").forEach(modal => {
            modal.classList.remove("active");
        });

        document.body.classList.remove("modal-open");
    }


    $$("[data-close-modal]").forEach(element => {

        element.addEventListener("click", () => {

            const modal = element.closest(".modal");

            if (modal) {
                closeModal(modal);
            }
        });
    });


    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {
            closeAllModals();
        }
    });


    /* =====================================================
       TOPIC MODAL
    ===================================================== */

    function renderTopic(topicKey) {

        const topic = topics[topicKey];

        if (!topic || !topicModalContent) return;

        const data = topic[currentLanguage];

        const symptomsHTML = data.symptoms
            .map(symptom => `
                <li>
                    <i class="fa-solid fa-check"></i>
                    <span>${escapeHTML(symptom)}</span>
                </li>
            `)
            .join("");

        const sourceLabel =
            currentLanguage === "ar"
                ? "المصدر الموثوق"
                : "Trusted source";

        const sourceDescription =
            currentLanguage === "ar"
                ? "يمكنك قراءة التفاصيل الكاملة من المصدر الأصلي."
                : "Read the full information from the original source.";

        const closeText =
            currentLanguage === "ar"
                ? "إغلاق"
                : "Close";

        const bookingText =
            currentLanguage === "ar"
                ? "احجز موعدًا مع مختص"
                : "Book a session";

        topicModalContent.innerHTML = `

            <div class="topic-modal-header">

                <span class="topic-modal-icon">
                    <i class="${topic.icon}"></i>
                </span>

                <div>
                    <span class="section-kicker">
                        ${currentLanguage === "ar"
                            ? "معلومات تثقيفية"
                            : "Educational information"}
                    </span>

                    <h2>
                        ${escapeHTML(data.title)}
                    </h2>
                </div>

            </div>


            <div class="topic-modal-intro">

                <p>
                    ${escapeHTML(data.intro)}
                </p>

            </div>


            <div class="topic-content-grid">

                <section class="topic-info-block">

                    <span class="topic-block-number">
                        01
                    </span>

                    <h3>
                        ${currentLanguage === "ar"
                            ? "ما هو؟"
                            : "What is it?"}
                    </h3>

                    <p>
                        ${escapeHTML(data.what)}
                    </p>

                </section>


                <section class="topic-info-block">

                    <span class="topic-block-number">
                        02
                    </span>

                    <h3>
                        ${currentLanguage === "ar"
                            ? "أعراض وعلامات شائعة"
                            : "Common signs & symptoms"}
                    </h3>

                    <ul class="topic-symptoms">
                        ${symptomsHTML}
                    </ul>

                </section>


                <section class="topic-info-block">

                    <span class="topic-block-number">
                        03
                    </span>

                    <h3>
                        ${currentLanguage === "ar"
                            ? "كيف أعرف أنني أحتاج للمساعدة؟"
                            : "When should I seek help?"}
                    </h3>

                    <p>
                        ${escapeHTML(data.when)}
                    </p>

                </section>


                <section class="topic-info-block topic-advice-block">

                    <span class="topic-block-number">
                        04
                    </span>

                    <h3>
                        ${currentLanguage === "ar"
                            ? "ماذا أفعل؟"
                            : "What can I do?"}
                    </h3>

                    <p>
                        ${escapeHTML(data.advice)}
                    </p>

                </section>

            </div>


            <div class="topic-source">

                <div class="source-icon">
                    <i class="fa-solid fa-book-medical"></i>
                </div>

                <div class="source-content">

                    <strong>
                        ${escapeHTML(sourceLabel)}
                    </strong>

                    <p>
                        ${escapeHTML(data.sourceName)}
                    </p>

                    <small>
                        ${escapeHTML(sourceDescription)}
                    </small>

                </div>

                <a
                    href="${data.sourceUrl}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="source-link">

                    ${currentLanguage === "ar"
                        ? "زيارة المصدر"
                        : "Visit source"}

                    <i class="fa-solid fa-arrow-up-right-from-square"></i>

                </a>

            </div>


            <div class="topic-disclaimer">

                <i class="fa-solid fa-circle-info"></i>

                <p>
                    ${
                        currentLanguage === "ar"
                            ? "هذه المعلومات للتثقيف فقط ولا تُستخدم لتشخيص أي حالة. التشخيص يحتاج إلى تقييم من مختص مؤهل."
                            : "This information is educational only and is not intended to diagnose any condition. Diagnosis requires assessment by a qualified professional."
                    }
                </p>

            </div>


            <div class="topic-modal-actions">

                <button
                    type="button"
                    class="btn btn-primary"
                    data-topic-booking>

                    ${escapeHTML(bookingText)}

                    <i class="fa-solid fa-arrow-left"></i>

                </button>

                <button
                    type="button"
                    class="btn btn-soft"
                    data-close-topic>

                    ${escapeHTML(closeText)}

                </button>

            </div>
        `;


        const bookingButton = $("[data-topic-booking]", topicModalContent);

        if (bookingButton) {

            bookingButton.addEventListener("click", () => {

                closeModal(topicModal);

                setTimeout(() => {
                    openBooking();
                }, 150);
            });
        }


        const closeButton = $("[data-close-topic]", topicModalContent);

        if (closeButton) {

            closeButton.addEventListener("click", () => {
                closeModal(topicModal);
            });
        }
    }


    $$("[data-topic]").forEach(button => {

        button.addEventListener("click", event => {

            event.preventDefault();

            const key = button.dataset.topic;

            if (!key || !topics[key]) return;

            renderTopic(key);

            openModal(topicModal);
        });
    });


    /* =====================================================
       PROVIDER MODAL
    ===================================================== */

    function renderProvider(providerKey) {

        const provider = defaultSpecialists[providerKey];

        if (!provider || !providerModalContent) return;

        const data = provider[currentLanguage];

        const areasHTML = data.areas
            .map(area => `
                <li>
                    <i class="fa-solid fa-check"></i>
                    ${escapeHTML(area)}
                </li>
            `)
            .join("");

        providerModalContent.innerHTML = `

            <div class="provider-modal-header">

                <div class="provider-big-avatar">
                    ${escapeHTML(provider.initials)}
                </div>

                <div>

                    <span class="section-kicker">
                        ${escapeHTML(provider.label)}
                    </span>

                    <h2>
                        ${escapeHTML(data.title)}
                    </h2>

                </div>

            </div>


            <div class="provider-profile-body">

                <section>

                    <span class="profile-label">
                        ${
                            currentLanguage === "ar"
                                ? "نبذة"
                                : "Profile"
                        }
                    </span>

                    <p>
                        ${escapeHTML(data.bio)}
                    </p>

                </section>


                <section>

                    <span class="profile-label">
                        ${
                            currentLanguage === "ar"
                                ? "مجالات الاهتمام"
                                : "Areas of interest"
                        }
                    </span>

                    <ul class="provider-areas">
                        ${areasHTML}
                    </ul>

                </section>

            </div>


            <div class="provider-note">

                <i class="fa-solid fa-shield-heart"></i>

                <span>
                    ${
                        currentLanguage === "ar"
                            ? "يمكنك اختيار المختص المناسب لك أثناء الحجز."
                            : "You can choose your preferred specialist during booking."
                    }
                </span>

            </div>


            <div class="provider-actions">

                <button
                    class="btn btn-primary"
                    type="button"
                    data-provider-booking="${escapeHTML(provider.name)}">

                    ${
                        currentLanguage === "ar"
                            ? "احجز موعدًا"
                            : "Book appointment"
                    }

                    <i class="fa-solid fa-arrow-left"></i>

                </button>

            </div>
        `;


        const bookingButton =
            $("[data-provider-booking]", providerModalContent);

        if (bookingButton) {

            bookingButton.addEventListener("click", () => {

                const providerName =
                    bookingButton.dataset.providerBooking;

                closeModal(providerModal);

                setTimeout(() => {
                    openBooking(providerName);
                }, 150);
            });
        }
    }


    $$("[data-provider]").forEach(button => {

        button.addEventListener("click", event => {

            event.preventDefault();

            const providerKey =
                button.dataset.provider;

            renderProvider(providerKey);

            openModal(providerModal);
        });
    });


    /* =====================================================
       BOOKING
    ===================================================== */

    const bookingForm = $("#bookingForm");
    const bookingProvider = $("#bookingProvider");
    const bookingDate = $("#bookingDate");
    const bookingSuccess = $("#bookingSuccess");


    function getDefaultAvailability() {

        return {
            days: {
                saturday: true,
                sunday: true,
                monday: true,
                tuesday: true,
                wednesday: true,
                thursday: true,
                friday: false
            },

            slots: [
                {
                    time: "09:00",
                    label: "09:00 AM",
                    active: true
                },
                {
                    time: "10:30",
                    label: "10:30 AM",
                    active: true
                },
                {
                    time: "12:00",
                    label: "12:00 PM",
                    active: true
                },
                {
                    time: "02:30",
                    label: "02:30 PM",
                    active: true
                },
                {
                    time: "05:00",
                    label: "05:00 PM",
                    active: true
                },
                {
                    time: "07:30",
                    label: "07:30 PM",
                    active: true
                }
            ]
        };
    }


    function getAvailability() {

        return getStorage(
            CONFIG.storage.availability,
            getDefaultAvailability()
        );
    }


    function convert24To12(time) {

        const [hourString, minute] = time.split(":");

        let hour = parseInt(hourString, 10);

        const period = hour >= 12 ? "PM" : "AM";

        hour = hour % 12;

        if (hour === 0) {
            hour = 12;
        }

        return `${String(hour).padStart(2, "0")}:${minute} ${period}`;
    }


    function getDayName(dateString) {

        const date = new Date(`${dateString}T12:00:00`);

        const day = date.getDay();

        const names = [
            "sunday",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday"
        ];

        return names[day];
    }


    function ensureTimeField() {

        if (!bookingForm) return null;

        let group = $("#bookingTimeGroup");

        if (group) {
            return $("#bookingTime", group);
        }

        const dateGroup = bookingDate
            ? bookingDate.closest(".form-group")
            : null;

        if (!dateGroup) return null;

        group = document.createElement("div");

        group.className = "form-group";

        group.id = "bookingTimeGroup";

        group.innerHTML = `

            <label for="bookingTime">
                ${
                    currentLanguage === "ar"
                        ? "الساعة"
                        : "Time"
                }
            </label>

            <select
                id="bookingTime"
                name="time"
                required>

                <option value="">
                    ${
                        currentLanguage === "ar"
                            ? "اختر الساعة"
                            : "Choose a time"
                    }
                </option>

            </select>

        `;

        dateGroup.insertAdjacentElement("afterend", group);

        return $("#bookingTime", group);
    }


    function refreshTimeSlots() {

        const timeSelect = ensureTimeField();

        if (!timeSelect) return;

        const availability = getAvailability();

        const selectedDate =
            bookingDate ? bookingDate.value : "";

        timeSelect.innerHTML = `
            <option value="">
                ${
                    currentLanguage === "ar"
                        ? "اختر الساعة"
                        : "Choose a time"
                }
            </option>
        `;

        if (!selectedDate) return;

        const dayName = getDayName(selectedDate);

        if (
            availability.days &&
            availability.days[dayName] === false
        ) {

            const option = document.createElement("option");

            option.value = "";

            option.disabled = true;

            option.textContent =
                currentLanguage === "ar"
                    ? "لا توجد مواعيد متاحة في هذا اليوم"
                    : "No appointments available on this day";

            timeSelect.appendChild(option);

            return;
        }


        const slots = (availability.slots || [])
            .filter(slot => slot.active !== false);


        slots.forEach(slot => {

            const option = document.createElement("option");

            option.value = slot.time;

            option.textContent =
                slot.label ||
                convert24To12(slot.time);

            timeSelect.appendChild(option);
        });


        if (!slots.length) {

            const option = document.createElement("option");

            option.value = "";

            option.disabled = true;

            option.textContent =
                currentLanguage === "ar"
                    ? "لا توجد ساعات متاحة حاليًا"
                    : "No available times";

            timeSelect.appendChild(option);
        }
    }


    if (bookingDate) {

        const today = new Date();

        const yyyy = today.getFullYear();

        const mm = String(today.getMonth() + 1)
            .padStart(2, "0");

        const dd = String(today.getDate())
            .padStart(2, "0");

        bookingDate.min = `${yyyy}-${mm}-${dd}`;

        bookingDate.addEventListener(
            "change",
            refreshTimeSlots
        );
    }


    function openBooking(providerName = "") {

        if (!bookingModal) return;

        if (bookingProvider && providerName) {

            const option = [...bookingProvider.options]
                .find(
                    option =>
                        option.value === providerName
                );

            if (option) {
                bookingProvider.value = providerName;
            }
        }

        if (bookingSuccess) {
            bookingSuccess.innerHTML = "";
            bookingSuccess.className = "success-message";
        }

        refreshTimeSlots();

        openModal(bookingModal);
    }


    $$("[data-open-booking]").forEach(button => {

        button.addEventListener("click", event => {

            event.preventDefault();

            const provider =
                button.dataset.selectedProvider || "";

            openBooking(provider);
        });
    });


    /* =====================================================
       BOOKING SUBMIT
    ===================================================== */

    if (bookingForm) {

        bookingForm.addEventListener("submit", event => {

            event.preventDefault();

            const formData =
                new FormData(bookingForm);

            const name =
                String(formData.get("name") || "").trim();

            const phone =
                String(formData.get("phone") || "").trim();

            const provider =
                String(formData.get("provider") || "").trim();

            const date =
                String(formData.get("date") || "").trim();

            const time =
                String(formData.get("time") || "").trim();

            const message =
                String(formData.get("message") || "").trim();


            if (!name || !phone || !provider) {

                showBookingMessage(
                    currentLanguage === "ar"
                        ? "من فضلك أكمل البيانات الأساسية."
                        : "Please complete the required fields.",
                    "error"
                );

                return;
            }


            if (!date || !time) {

                showBookingMessage(
                    currentLanguage === "ar"
                        ? "من فضلك اختر التاريخ والساعة."
                        : "Please select a date and time.",
                    "error"
                );

                return;
            }


            const booking = {

                id:
                    `BK-${Date.now()}`,

                name,

                phone,

                provider,

                date,

                time,

                message,

                createdAt:
                    new Date().toISOString(),

                status:
                    "pending"
            };


            const bookings =
                getStorage(
                    CONFIG.storage.bookings,
                    []
                );

            bookings.push(booking);

            setStorage(
                CONFIG.storage.bookings,
                bookings
            );


            showBookingMessage(
                currentLanguage === "ar"
                    ? "تم تجهيز طلب الحجز بنجاح."
                    : "Your booking request has been prepared successfully.",
                "success"
            );


            const whatsappText =

                currentLanguage === "ar"

                    ? `مرحبًا MindCare، أريد إرسال طلب حجز:

الاسم: ${name}
الهاتف: ${phone}
المختص: ${provider}
التاريخ: ${date}
الساعة: ${convert24To12(time)}
الملاحظة: ${message || "لا توجد"}

رقم الطلب: ${booking.id}`

                    : `Hello MindCare, I would like to request an appointment:

Name: ${name}
Phone: ${phone}
Specialist: ${provider}
Date: ${date}
Time: ${convert24To12(time)}
Message: ${message || "None"}

Booking ID: ${booking.id}`;


            setTimeout(() => {

                window.open(
                    `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(whatsappText)}`,
                    "_blank"
                );

            }, 500);
        });
    }


    function showBookingMessage(message, type) {

        if (!bookingSuccess) return;

        bookingSuccess.textContent = message;

        bookingSuccess.className =
            `success-message ${type}`;
    }


    /* =====================================================
       FAQ
    ===================================================== */

    $$(".faq-item").forEach(item => {

        const question =
            $(".faq-question", item);

        if (!question) return;

        question.addEventListener("click", () => {

            const wasOpen =
                item.classList.contains("open");


            $$(".faq-item.open").forEach(openItem => {

                if (openItem !== item) {
                    openItem.classList.remove("open");
                }
            });


            item.classList.toggle(
                "open",
                !wasOpen
            );
        });
    });


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    const menuToggle = $("#menuToggle");
    const mainNav = $("#mainNav");


    if (menuToggle && mainNav) {

        menuToggle.addEventListener("click", () => {

            mainNav.classList.toggle("open");

            menuToggle.classList.toggle("active");

            document.body.classList.toggle(
                "nav-open"
            );
        });


        $$(".nav-link", mainNav).forEach(link => {

            link.addEventListener("click", () => {

                mainNav.classList.remove("open");

                menuToggle.classList.remove("active");

                document.body.classList.remove(
                    "nav-open"
                );
            });
        });
    }


    /* =====================================================
       ACTIVE NAVIGATION
    ===================================================== */

    const sections = $$(
        "main section[id], main section[id]"
    );

    const navLinks = $$(".nav-link");


    if ("IntersectionObserver" in window) {

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        navLinks.forEach(link => {

                            link.classList.remove(
                                "active"
                            );

                            if (
                                link.getAttribute("href") ===
                                `#${entry.target.id}`
                            ) {

                                link.classList.add(
                                    "active"
                                );
                            }
                        });
                    });

                },
                {
                    threshold: 0.25
                }
            );


        sections.forEach(section => {
            observer.observe(section);
        });
    }


    /* =====================================================
       LANGUAGE SYSTEM
    ===================================================== */

    const languageSwitch =
        $("#languageSwitch");


    const translations = {

        ar: {

            navHome: "الرئيسية",
            navHow: "كيف تعمل",
            navTopics: "الصحة النفسية",
            navSpecialists: "المختصون",
            navFaq: "الأسئلة الشائعة",

            booking: "ابدأ الحجز",

            exploreSpecialists:
                "استكشف المختصين",

            exploreTopics:
                "استكشف الموضوعات",

            footerLinks:
                "روابط",

            footerTopics:
                "الموضوعات"
        },

        en: {

            navHome: "Home",
            navHow: "How It Works",
            navTopics: "Mental Health",
            navSpecialists: "Specialists",
            navFaq: "FAQ",

            booking: "Start Booking",

            exploreSpecialists:
                "Explore Specialists",

            exploreTopics:
                "Explore Topics",

            footerLinks:
                "Links",

            footerTopics:
                "Topics"
        }
    };


    function translateStaticUI() {

        const t = translations[currentLanguage];


        const nav = $$(".nav-link");

        if (nav.length >= 5) {

            nav[0].textContent = t.navHome;

            nav[1].textContent = t.navHow;

            nav[2].textContent = t.navTopics;

            nav[3].textContent = t.navSpecialists;

            nav[4].textContent = t.navFaq;
        }


        if (languageSwitch) {

            languageSwitch.textContent =
                currentLanguage === "ar"
                    ? "EN"
                    : "AR";
        }


        $$("[data-open-booking]").forEach(button => {

            const icon =
                $("i", button);

            button.childNodes.forEach(node => {

                if (
                    node.nodeType ===
                    Node.TEXT_NODE
                ) {
                    node.textContent =
                        ` ${t.booking} `;
                }
            });

            if (!icon) {
                return;
            }
        });


        $$('a[href="#specialists"]').forEach(link => {

            link.textContent =
                t.exploreSpecialists;
        });


        $$('a[href="#topics"]').forEach(link => {

            if (
                link.classList.contains(
                    "text-link"
                )
            ) {
                const icon = $("i", link);

                link.textContent =
                    t.exploreTopics + " ";

                if (icon) {
                    link.appendChild(icon);
                }
            }
        });
    }


    function applyLanguage() {

        document.documentElement.lang =
            currentLanguage;

        document.documentElement.dir =
            currentLanguage === "ar"
                ? "rtl"
                : "ltr";


        $$("[data-ar][data-en]").forEach(element => {

            element.textContent =
                currentLanguage === "ar"
                    ? element.dataset.ar
                    : element.dataset.en;
        });


        translateStaticUI();

        refreshTimeSlots();


        /*
         * Re-render active modal content
         * so topic/provider language changes instantly.
         */

        if (
            topicModal &&
            topicModal.classList.contains("active") &&
            topicModalContent &&
            topicModalContent.dataset.topic
        ) {

            renderTopic(
                topicModalContent.dataset.topic
            );
        }
    }


    if (languageSwitch) {

        languageSwitch.addEventListener(
            "click",
            () => {

                currentLanguage =
                    currentLanguage === "ar"
                        ? "en"
                        : "ar";

                localStorage.setItem(
                    CONFIG.storage.language,
                    currentLanguage
                );

                applyLanguage();
            }
        );
    }


    /* =====================================================
       SAVE TOPIC KEY FOR LANGUAGE RE-RENDER
    ===================================================== */

    const originalRenderTopic =
        renderTopic;

    renderTopic = function(topicKey) {

        if (topicModalContent) {

            topicModalContent.dataset.topic =
                topicKey;
        }

        originalRenderTopic(topicKey);
    };


    /* =====================================================
       ASSESSMENT
    ===================================================== */

    const assessmentButton =
        $("#assessmentButton");

    const assessmentQuestions =
        $("#assessmentQuestions");

    const calculateAssessment =
        $("#calculateAssessment");

    const assessmentResult =
        $("#assessmentResult");


    const assessmentData = {

        ar: [

            "خلال الفترة الأخيرة، هل شعرت بالحزن أو انخفاض المزاج بشكل متكرر؟",

            "هل فقدت الاهتمام أو المتعة في أشياء كنت تستمتع بها؟",

            "هل شعرت بقلق أو توتر يصعب التحكم فيه؟",

            "هل أثرت مشاعرك أو أفكارك على نومك؟",

            "هل أثرت حالتك النفسية على الدراسة أو العمل أو العلاقات؟",

            "هل شعرت أن التعامل مع يومك أصبح أصعب من المعتاد؟"
        ],

        en: [

            "Recently, have you frequently felt sad or low?",

            "Have you lost interest or pleasure in things you usually enjoy?",

            "Have you
