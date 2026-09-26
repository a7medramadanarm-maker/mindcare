/* =========================================================
   MindCare Mental Wellness
   Main JavaScript
   Prepared By: Eng Ahmad Ramadan
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       CONFIG
    ===================================================== */

    const WHATSAPP_NUMBER = "201003089153";

    let currentLanguage = localStorage.getItem("mindcare-language") || "ar";


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const languageSwitch = document.getElementById("languageSwitch");
    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");

    const topicModal = document.getElementById("topicModal");
    const providerModal = document.getElementById("providerModal");
    const bookingModal = document.getElementById("bookingModal");
    const assessmentModal = document.getElementById("assessmentModal");

    const topicModalContent =
        document.getElementById("topicModalContent");

    const providerModalContent =
        document.getElementById("providerModalContent");

    const bookingForm =
        document.getElementById("bookingForm");

    const bookingProvider =
        document.getElementById("bookingProvider");

    const bookingSuccess =
        document.getElementById("bookingSuccess");

    const assessmentButton =
        document.getElementById("assessmentButton");

    const assessmentQuestions =
        document.getElementById("assessmentQuestions");

    const assessmentResult =
        document.getElementById("assessmentResult");

    const calculateAssessment =
        document.getElementById("calculateAssessment");


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
    ===================================================== */

    const providers = {

        tasbeh: {

            name: "Tasbeh Mohamed",

            initials: "T",

            specialty: {
                ar: "علم النفس الإكلينيكي",
                en: "Clinical Psychology"
            },

            bio: {
                ar:
                    "متخصصة في مجال علم النفس الإكلينيكي، مع اهتمام بالصحة النفسية والعلاقات والنمو الشخصي. تركز المساحة العلاجية على الاستماع وفهم التجربة الشخصية وتقديم دعم مهني مناسب لاحتياجات الشخص.",

                en:
                    "A clinical psychology professional with an interest in mental wellbeing, relationships, and personal growth. The approach focuses on listening, understanding each person's experience, and providing professional support based on individual needs."
            },

            areas: {
                ar: [
                    "القلق والتوتر",
                    "العلاقات",
                    "تقدير الذات",
                    "النمو الشخصي",
                    "التحديات العاطفية"
                ],

                en: [
                    "Anxiety and stress",
                    "Relationships",
                    "Self-esteem",
                    "Personal growth",
                    "Emotional challenges"
                ]
            }

        },


        mariam: {

            name: "Mariam Mahmoud",

            initials: "M",

            specialty: {
                ar: "علم النفس الإكلينيكي",
                en: "Clinical Psychology"
            },

            bio: {
                ar:
                    "متخصصة في علم النفس الإكلينيكي، مع اهتمام بالمشاعر والعلاقات والتحديات الشخصية. تهدف الجلسات إلى توفير مساحة منظمة وآمنة لفهم التجربة الشخصية والعمل على الأهداف المناسبة.",

                en:
                    "A clinical psychology professional with an interest in emotions, relationships, and personal challenges. Sessions aim to provide a structured and supportive space to understand personal experiences and work toward meaningful goals."
            },

            areas: {
                ar: [
                    "المشاعر والضغوط",
                    "العلاقات",
                    "التواصل",
                    "الثقة بالنفس",
                    "التحديات الشخصية"
                ],

                en: [
                    "Emotions and stress",
                    "Relationships",
                    "Communication",
                    "Self-confidence",
                    "Personal challenges"
                ]
            }

        }

    };


    /* =====================================================
       LANGUAGE SYSTEM
    ===================================================== */

    function setLanguage(lang) {

        currentLanguage = lang;

        localStorage.setItem(
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
    }


    function updateStaticNavigation(lang) {

        const navLinks =
            document.querySelectorAll(".nav-link");

        const ar = [
            "الرئيسية",
            "كيف تعمل",
            "الصحة النفسية",
            "المختصون",
            "الأسئلة الشائعة"
        ];

        const en = [
            "Home",
            "How It Works",
            "Mental Health",
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

    function openModal(modal) {

        if (!modal) return;

        modal.classList.add("active");

        modal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "modal-open"
        );

    }


    function closeModal(modal) {

        if (!modal) return;

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

            }

        }
    );


    /* =====================================================
       TOPIC MODAL
    ===================================================== */

    function renderTopic(key) {

        const topic = topics[key];

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

                <div class="topic-modal-section">

                    <h3>
                        <i class="fa-solid fa-list-check"></i>
                        ${symptomsLabel}
                    </h3>

                    <ul class="modal-list">
                        ${symptomsHTML}
                    </ul>

                </div>

                <div class="help-box">

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

                <div class="source-box">

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

                <div class="modal-disclaimer">

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
       PROVIDER MODAL
    ===================================================== */

    function renderProvider(key) {

        const provider = providers[key];

        if (!provider || !providerModalContent) {
            return;
        }

        const areas =
            provider.areas[currentLanguage]
                .map(
                    area => `
                        <span class="provider-tag">
                            ${area}
                        </span>
                    `
                )
                .join("");

        const labels =
            currentLanguage === "ar"
                ? {
                    profile: "الملف المهني",
                    areas: "مجالات الاهتمام",
                    booking: "احجز موعدًا",
                    close: "عرض الملف"
                }
                : {
                    profile: "Professional Profile",
                    areas: "Areas of Interest",
                    booking: "Book an Appointment",
                    close: "Profile"
                };

        providerModalContent.innerHTML = `

            <div class="provider-modal-header">

                <div class="provider-large-avatar">
                    ${provider.initials}
                </div>

                <div>

                    <span class="modal-eyebrow">
                        ${provider.specialty[currentLanguage]}
                    </span>

                    <h2>
                        ${provider.name}
                    </h2>

                </div>

            </div>

            <div class="provider-modal-body">

                <h3>
                    ${labels.profile}
                </h3>

                <p>
                    ${provider.bio[currentLanguage]}
                </p>

                <h3>
                    ${labels.areas}
                </h3>

                <div class="provider-tags">
                    ${areas}
                </div>

                <button
                    class="btn btn-primary full-width provider-book-button"
                    type="button"
                    data-provider-book="${key}">

                    ${labels.booking}

                    <i class="fa-solid fa-arrow-left"></i>

                </button>

            </div>
        `;

        openModal(providerModal);


        const bookButton =
            providerModalContent.querySelector(
                "[data-provider-book]"
            );

        if (bookButton) {

            bookButton.addEventListener(
                "click",
                () => {

                    closeModal(providerModal);

                    openBooking(
                        provider.name
                    );

                }
            );

        }

    }


    document
        .querySelectorAll("[data-provider]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    renderProvider(
                        button.getAttribute(
                            "data-provider"
                        )
                    );

                }
            );

        });


    /* =====================================================
       BOOKING
    ===================================================== */

    function openBooking(providerName = "") {

        if (!bookingModal) {
            return;
        }

        if (bookingProvider) {

            bookingProvider.value =
                providerName || "";

        }

        if (bookingSuccess) {
            bookingSuccess.innerHTML = "";
        }

        openModal(bookingModal);
    }


    document
        .querySelectorAll("[data-open-booking]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const provider =
                        button.getAttribute(
                            "data-selected-provider"
                        ) || "";

                    openBooking(provider);

                }
            );

        });


    if (bookingForm) {

        bookingForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                const formData =
                    new FormData(bookingForm);

                const name =
                    formData.get("name");

                const phone =
                    formData.get("phone");

                const provider =
                    formData.get("provider");

                const date =
                    formData.get("date") ||
                    "غير محدد";

                const time =
                    formData.get("time") ||
                    "غير محدد";

                const message =
                    formData.get("message") ||
                    "لا توجد ملاحظة";

                const text =
                    `طلب حجز جديد - MindCare\n\n` +
                    `الاسم: ${name}\n` +
                    `الهاتف: ${phone}\n` +
                    `المختص: ${provider}\n` +
                    `التاريخ: ${date}\n` +
                    `الوقت: ${time}\n` +
                    `الملاحظة: ${message}`;

                const whatsappURL =
                    "https://wa.me/" +
                    WHATSAPP_NUMBER +
                    "?text=" +
                    encodeURIComponent(text);

                if (bookingSuccess) {

                    bookingSuccess.innerHTML = `
                        <div class="success-inner">

                            <i class="fa-solid fa-circle-check"></i>

                            <strong>
                                ${
                                    currentLanguage === "ar"
                                        ? "تم تجهيز طلب الحجز"
                                        : "Booking request prepared"
                                }
                            </strong>

                            <p>
                                ${
                                    currentLanguage === "ar"
                                        ? "سيتم تحويلك إلى WhatsApp لإرسال الطلب."
                                        : "You will be redirected to WhatsApp to send the request."
                                }
                            </p>

                            <a
                                href="${whatsappURL}"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="btn btn-primary">

                                ${
                                    currentLanguage === "ar"
                                        ? "إرسال عبر WhatsApp"
                                        : "Send via WhatsApp"
                                }

                                <i class="fa-brands fa-whatsapp"></i>

                            </a>

                        </div>
                    `;

                }

            }
        );

    }


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
       INITIALIZE
    ===================================================== */

    setLanguage(currentLanguage);

});
