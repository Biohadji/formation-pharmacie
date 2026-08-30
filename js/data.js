const quizData = {
    seller: {
        ar: [
            {
                question: "ما هو المبدأ المستخدم في تنظيم الأدوية في الصيدلية لضمان بيع الأدوية القديمة أولاً؟",
                options: ["FIFO", "LIFO", "ABC", "JIT"],
                correct: 0,
                explanation: "FIFO (First In First Out) - الادخل أولاً يخرج أولاً، لضمان بيع الأدوية الأقرب لانتهاء الصلاحية أولاً"
            },
            {
                question: "أي من الأدوية التالية يتطلب وصفة طبية خاصة (Catégorie B)؟",
                options: ["Paracétamol", "Diazépam", "Vitamine C", "Ibuprofène"],
                correct: 1,
                explanation: "Diazépam (Valium) هو دواء من الفئة B (نفسية) يتطلب وصفة طبية خاصة"
            },
            {
                question: "ما معنى الاختصارMDB في الوصفات الطبية؟",
                options: ["مرة واحدة يومياً", "ثلاث مرات يومياً", "كل 24 ساعة", "مساءً فقط"],
                correct: 1,
                explanation: "MDB = Mane, Decuba, Bedtime = صباحاً، ظهراً، مساءً = ثلاث مرات يومياً"
            },
            {
                question: "ما هو التفاعل الدوائي بين Warfarine و Aspirine؟",
                options: ["تعزيز التأثير", "تقليل التأثير", "زيادة خطر النزيف", "لا توجد تفاعل"],
                correct: 2,
                explanation: "كلاهما يؤثر على تخثر الدم، مما يزيد خطر النزيف بشكل كبير"
            },
            {
                question: "أين يجب وضع الأدوية الأكثر طلباً في الصيدلية؟",
                options: ["الرف العلوي", "الرف السفلي", "مستوى العيون", "المخزن"],
                correct: 2,
                explanation: "يجب وضع الأدوية الأكثر طلباً على مستوى العيون لسهولة الوصول"
            },
            {
                question: "ما هو المعنى الطبي لل اختصار AC في الوصفات؟",
                options: ["بعد الأكل", "قبل الأكل", "مع الأكل", "بدون أكل"],
                correct: 1,
                explanation: "AC = Ante Cibum = قبل الوجبات"
            },
            {
                question: "أي من التالي ليس من أنواع الوصفات الطبية؟",
                options: ["الوصفة العادية", "الوصفة الخاصة", "الوصفة الإلكترونية", "الوصفة الشفهية"],
                correct: 3,
                explanation: "الوصفة الشفهية ليست نوعاً رسمياً من الوصفات الطبية"
            },
            {
                question: "ما هي الأدوية الخاضعة لرقابة صارمة في الصيدلية؟",
                options: ["مضادات الحموضة", "المهدئات والأدوية المخدرة", "الفيتامينات", "مسكنات الألم الخفيفة"],
                correct: 1,
                explanation: "المهدئات والأدوية المخدرة (الفئات A و B) خاضعة لرقابة صارمة"
            },
            {
                question: "ما هي درجة الحرارة المناسبة لتخزين الأدوية في الصيدلية؟",
                options: ["0-5 درجات", "15-25 درجة", "30-40 درجة", "أي درجة حرارة"],
                correct: 1,
                explanation: "درجة الحرارة المناسبة هي 15-25 درجة مئوية"
            },
            {
                question: "ما هو الفرق بين التفاعل الت>Additive والتفاعل المضاد؟",
                options: ["لا يوجد فرق", "الإضافة تزيد التأثير، المضاد يقلله", "كلاهما متساوي", "التفاعل المضاد أخطر"],
                correct: 1,
                explanation: "التفاعل>Additive يجمع التأثيرات، بينما التفاعل المضاد ي拮抗ها"
            }
        ],
        fr: [
            {
                question: "Quel principe est utilisé pour organiser les médicaments afin de vendre les plus anciens en premier ?",
                options: ["FIFO", "LIFO", "ABC", "JIT"],
                correct: 0,
                explanation: "FIFO (First In First Out) - Premier Entré, Premier Sorti"
            },
            {
                question: "Lequel de ces médicaments nécessite une ordonnance spéciale (Catégorie B) ?",
                options: ["Paracétamol", "Diazépam", "Vitamine C", "Ibuprofène"],
                correct: 1,
                explanation: "Le Diazépam (Valium) est un anxiolytique de catégorie B soumis à ordonnance spéciale"
            },
            {
                question: "Que signifie l'abréviation MDB sur une ordonnance ?",
                options: ["1 fois par jour", "3 fois par jour", "Toutes les 24h", "Le soir seulement"],
                correct: 1,
                explanation: "MDB = Mane, Decuba, Bedtime = Matin, Midi, Soir = 3 fois par jour"
            },
            {
                question: "Quelle est l'interaction entre Warfarine et Aspirine ?",
                options: ["Potentialisation", "Antagonisme", "Risque hémorragique accru", "Aucune interaction"],
                correct: 2,
                explanation: "Les deux affectent la coagulation, augmentant considérablement le risque de saignement"
            },
            {
                question: "Où placer les médicaments les plus demandés en pharmacie ?",
                options: ["Rayon supérieur", "Rayon inférieur", "À hauteur des yeux", "Au magasin"],
                correct: 2,
                explanation: "Les médicaments les plus demandés doivent être placés à hauteur des yeux pour un accès facile"
            },
            {
                question: "Que signifie l'abréviation AC sur une ordonnance ?",
                options: ["Après le repas", "Avant le repas", "Avec le repas", "Sans repas"],
                correct: 1,
                explanation: "AC = Ante Cibum = Avant les repas"
            },
            {
                question: "Lequel suivant n'est pas un type d'ordonnance médicale ?",
                options: ["Ordonnance simple", "Ordonnance spéciale", "Ordonnance électronique", "Ordonnance orale"],
                correct: 3,
                explanation: "L'ordonnance orale n'est pas un type officiel d'ordonnance médicale"
            },
            {
                question: "Quels médicaments sont soumis à contrôle strict en pharmacie ?",
                options: ["Antiacides", "Anxiolytiques et stupéfiants", "Vitamines", "Antalgiques légers"],
                correct: 1,
                explanation: "Les anxiolytiques et stupéfiants (catégories A et B) sont soumis à contrôle strict"
            },
            {
                question: "Quelle est la température de conservation appropriée pour les médicaments ?",
                options: ["0-5°C", "15-25°C", "30-40°C", "N'importe quelle température"],
                correct: 1,
                explanation: "La température appropriée est de 15 à 25 degrés Celsius"
            },
            {
                question: "Quelle est la différence entre interaction additive et antagoniste ?",
                options: ["Pas de différence", "Additive augmente, antagoniste diminue", "Égaux", "Antagoniste est plus dangereux"],
                correct: 1,
                explanation: "L'additive cumule les effets, l'antagoniste les oppose"
            }
        ]
    },
    preparator: {
        ar: [
            {
                question: "ما هو المستحضر الصيدلاني (préparation magistrale)؟",
                options: ["دواء جاهز من المصنع", "منتج يُحضر في الصيدلية بطلب الطبيب", "منتج تجميلي", "مكمل غذائي"],
                correct: 1,
                explanation: "المستحضر الصيدلاني هو منتج يُحضر في الصيدلية بطلب الطبيب للمريض"
            },
            {
                question: "ما هي المادة الفعالة في المستحضرات الصيدلانية؟",
                options: ["Excipient", "Substance active", "Conservateur", "Arôme"],
                correct: 1,
                explanation: "المادة الفعالة (Substance active) هي المسؤولة عن التأثير العلاجي"
            },
            {
                question: "ما هو المعد المستخدم في وزن المواد بدقة؟",
                options: ["الميزان", "الBalance de précision", "المتر", "الساعة"],
                correct: 1,
                explanation: "Balance de précision (الميزان الدقيق) يُستخدم لوزن المواد بدقة عالية"
            },
            {
                question: "ما هي تقنية Trituration؟",
                options: ["الذوبان", "ال嗑ط والخلط", "الرشح", "التعبئة"],
                correct: 1,
                explanation: "Trituration هي تقنية سحق المواد الصلبة و خلطها في المِörtier"
            },
            {
                question: "أي من التالي ليس من Excipients؟",
                options: ["Lactose", "Paracétamol", "Glycérine", "Vaseline"],
                correct: 1,
                explanation: "Paracétamol هو مادة فعالة (Substance active) و ليس Excipient"
            },
            {
                question: "ما هو القوام المناسب للمرهمات (pommades)؟",
                options: ["سائل", "صلب", "شبه صلب", "مسحوق"],
                correct: 2,
                explanation: "المرهمات لها قوام شبه صلب (demi-solide)"
            },
            {
                question: "ما هي خطوة التحضير الأولى؟",
                options: ["وزن المواد", "قراءة الوصفة وفهمها", "التعبئة", "الغسل"],
                correct: 1,
                explanation: "الخطوة الأولى هي قراءة الوصفة وفهم المتطلبات"
            },
            {
                question: "أي من التالي من Conservateurs (مواد حافظة)؟",
                options: ["Lactose", "Parabènes", "Amidon", "Eau"],
                correct: 1,
                explanation: "Parabènes هي مادة حافظة تمنع النمو البكتيري"
            },
            {
                question: "ما هي عملية Filtration؟",
                options: ["الخلط", "إزالة الشوائب", "الضغط", "التجفيف"],
                correct: 1,
                explanation: "Filtration هي عملية إزالة الشوائب من المحلول"
            },
            {
                question: "ما هي المادة المستخدمة لتطعيم القوام في المستحضرات الدهنية؟",
                options: ["Eau", "Vaseline", "Sucre", "Miel"],
                correct: 1,
                explanation: "Vaseline تُستخدم كقاعدة في المستحضرات شبه الصلبة الدهنية"
            }
        ],
        fr: [
            {
                question: "Qu'est-ce qu'une préparation magistrale ?",
                options: ["Médicament industriel", "Produit préparé en pharmacie sur prescription", "Produit cosmétique", "Complément alimentaire"],
                correct: 1,
                explanation: "La préparation magistrale est un produit élaboré en pharmacie sur prescription médicale"
            },
            {
                question: "Quelle est la substance responsable de l'effet thérapeutique ?",
                options: ["Excipient", "Substance active", "Conservateur", "Arôme"],
                correct: 1,
                explanation: "La substance active est responsable de l'effet thérapeutique"
            },
            {
                question: "Quel équipement utilise-t-on pour peser précisément ?",
                options: ["Balance de précision", "Mortier", "Règle", "Chronomètre"],
                correct: 0,
                explanation: "La balance de précision permet de peser avec grande exactitude"
            },
            {
                question: "Qu'est-ce que la technique de trituration ?",
                options: ["Dissolution", "Broyage et mélange", "Filtration", "Conditionnement"],
                correct: 1,
                explanation: "La trituration est le broyage et mélange des poudres au mortier"
            },
            {
                question: "Lequel n'est pas un excipient ?",
                options: ["Lactose", "Paracétamol", "Glycérine", "Vaseline"],
                correct: 1,
                explanation: "Le Paracétamol est une substance active, pas un excipient"
            },
            {
                question: "Quelle texture pour les pommades ?",
                options: ["Liquide", "Solide", "Semi-solide", "Poudre"],
                correct: 2,
                explanation: "Les pommades ont une texture demi-solide"
            },
            {
                question: "Quelle est la première étape de préparation ?",
                options: ["Peser les matières", "Lire et comprendre l'ordonnance", "Conditionner", "Se laver les mains"],
                correct: 1,
                explanation: "La première étape est de lire et comprendre l'ordonnance"
            },
            {
                question: "Lequel est un conservateur ?",
                options: ["Lactose", "Parabènes", "Amidon", "Eau"],
                correct: 1,
                explanation: "Les parabènes sont des conservateurs qui empêchent la croissance bactérienne"
            },
            {
                question: "Qu'est-ce que la filtration ?",
                options: ["Mélange", "Élimination des impuretés", "Pressage", "Séchage"],
                correct: 1,
                explanation: "La filtration est l'élimination des impuretés d'une solution"
            },
            {
                question: "Quelle matière sert de base grasse pour les préparations ?",
                options: ["Eau", "Vaseline", "Sucre", "Miel"],
                correct: 1,
                explanation: "La vaseline est utilisée comme base pour les préparations semi-solides grasses"
            }
        ]
    }
};