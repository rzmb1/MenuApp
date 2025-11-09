JG.repeat(32, {
    _id: JG.objectId(),
    createdBy: JG.objectId(),
    approvedBy: JG.objectId(),
    state: "published",
    days() {
        let valDays = _.uniq(JG.repeat(10, 10, JG.random("Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag")));
        let retValue = {};
        for (let day of valDays) {
            retValue[day] = (() => {
                //used for automatic test data generation
                vorspeisen = [
                    {
                        "name": "Chinakohlsalat mit Hanfmarinade",
                        "tags": [
                            "Vorspeise",
                            "Gesund",
                            "Chinakohl",
                            "Vegetarisch"
                        ],
                        image: "6453dd72265186d68cbd6bce"
                    },
                    {
                        "name": "Rote-Rüben-Suppe",
                        "tags": [
                            "Vorspeise",
                            "Rüben",
                            "Suppe",
                            "G (Milch)",
                            "Vegetarisch"
                        ],
                        image: "6453e09c265186d68cbd6be0"
                    },
                    {
                        "name": "Weiße Rübensuppe mit gerösteten Haselnüssen",
                        "tags": [
                            "Vorspeise",
                            "Suppe",
                            "G (Milch)"
                        ],
                        image: "6453e180265186d68cbd6be6"
                    },
                    {
                        "name": "Frühlingsrollen mit Krautsalat",
                        "tags": [
                            "Vorspeise",
                            "Gemüse",
                        ],
                        image: "6453e25d265186d68cbd6bec"
                    },
                    {
                        "name": "Ingwer-Karottensuppe mit Honig",
                        "tags": [
                            "Vorspeise",
                            "Suppe",
                            "Ingwer",
                            "Vegetarisch"
                        ],
                        image: "6453e2fb265186d68cbd6bf0"
                    },
                    {
                        "name": "Winterliche Gemüsesuppe",
                        "tags": [
                            "Vorspeise",
                            "Suppe",
                            "Gemüse",
                            "Vegetarisch"
                        ],
                        image: "6453e3d5265186d68cbd6bf4"
                    },
                    {
                        "name": "Vogerlsalat",
                        "tags": [
                            "Vorspeise",
                            "Vegetarisch",
                            "G (Milch)"
                        ],
                        image: "6609bcca1ff45a09aa90dc9f"
                    },
                    {
                        "name": "Salat mit Linsen und Gemüse",
                        "tags": [
                            "Vorspeise",
                            "Vegetarisch",
                            "Linsen",
                            "Gemüse"
                        ],
                        image: "6609bd91a7af788fd198a7d6"
                    },
                    {
                        "name": "Pasta mit Salat und Oliven",
                        "tags": [
                            "Vorspeise",
                            "Vegetarisch",
                            "Oliven",
                            "Pasta",
                            "C (Eier)",
                            "G (Milch)",
                            "A (Glutenhaltiges Getreide)",
                        ],
                        image: "6609be2d880f9e69154a2620"
                    },
                    {
                        "name": "Suppe mit Tofu",
                        "tags": [
                            "Vorspeise",
                            "Suppe",
                            "Tofu",
                            "A (Glutenhaltiges Getreide)",
                            "F (Sojabohnen)",
                        ],
                        image: "6609bec3ff9f5db682bfd706"
                    },
                    {
                        "name": "Kürbiscremesuppe",
                        "tags": [
                            "Vorspeise",
                            "Suppe",
                            "A (Glutenhaltiges Getreide)",
                            "G (Milch)",
                        ],
                        image: "6609c048e11e8d69543ed559"
                    },
                    {
                        "name": "Gemüsesuppe",
                        "tags": [
                            "Vorspeise",
                            "Suppe",
                        ],
                        image: "6609c0e0e3a7393139cd9734"
                    },
                    {
                        "name": "Kartoffelsuppe mit Karroten",
                        "tags": [
                            "Vorspeise",
                            "Suppe",
                            "Kartoffeln",
                            "Karroten",
                            "A (Glutenhaltiges Getreide)",
                            "G (Milch)",
                            "C (Eier)",
                        ],
                        image: "6609c154b09f53f5045ac911"
                    },
                    {
                        "name": "Zucchinisuppe mit Oregano",
                        "tags": [
                            "Vorspeise",
                            "Suppe",
                            "Zucchini",
                            "Karroten",
                            "A (Glutenhaltiges Getreide)",
                            "G (Milch)",
                        ],
                        image: "6609c1aefe3db849a380002a"
                    },
                ];

                hauptspeisen = [
                    {
                        "name": "Rindsfilet mit Kirschenragout, Romanescopüree und Schokomaiwipferln",
                        "tags": [
                            "Hauptspeise",
                            "Erdbeeren",
                            "G (Milch)",
                            "Alkohol"
                        ],
                        image: "6453da78d7155e9950293c2e"
                    },
                    {
                        "name": "Süßkartoffeln mit Forellen-Quinoa-Gemüse-Fülle",
                        "tags": [
                            "Hauptspeise",
                            "Kartoffeln",
                            "Fisch",
                            "D (Fische)",
                            "Vegetarisch"
                        ],
                        image: "6453dadad7155e9950293c30"
                    },
                    {
                        "name": "Seeforelle im Zucchinimantel",
                        "tags": [
                            "Hauptspeise",
                            "Fisch",
                            "Zucchini",
                            "D (Fische)"
                        ],
                        image: "6453dc72265186d68cbd6bc8"
                    },
                    {
                        "name": "Karreesteak vom Schwein à la Cordon bleu",
                        "tags": [
                            "Hauptspeise",
                            "Schwein",
                            "Steak"
                        ],
                        image: "6453dcb7265186d68cbd6bca"
                    },
                    {
                        "name": "Ragout vom Maibock",
                        "tags": [
                            "Hauptspeise",
                            "Ragout",
                            "Fleisch",
                        ],
                        image: "6453dcf6265186d68cbd6bcc"
                    },
                    {
                        "name": "Rosa gebratener Rehrücken mit Rote-Rüben-Risotto",
                        "tags": [
                            "Hauptspeise",
                            "Reh",
                            "Rote Rüben",
                            "Risotto"
                        ],
                        image: "6453de1f265186d68cbd6bd2"
                    },
                    {
                        "name": "Penne alla Pizza",
                        "tags": [
                            "Hauptspeise",
                            "Pizza",
                            "A (Glutenhaltiges Getreide)",
                            "Vegetarisch"
                        ],
                        image: "6453df88265186d68cbd6bda"
                    },
                    {
                        "name": "Grammelsterz",
                        "tags": [
                            "Hauptspeise",
                            "Grammel",
                        ],
                        image: "6453e019265186d68cbd6bdc"
                    },
                    {
                        "name": "Hühnerbrust mit Apfel-Topfen-Fülle",
                        "tags": [
                            "Hauptspeise",
                            "Huhn",
                            "Topfen",
                            "Apfel"
                        ],
                        image: "6453e053265186d68cbd6bde"
                    },
                    {
                        "name": "Zweierlei vom Rind mit Rote-Rüben-Knödeln",
                        "tags": [
                            "Hauptspeise",
                            "Rind",
                            "Rote Rüben",
                            "Alkohol"
                        ],
                        image: "6453e130265186d68cbd6be4"
                    },
                    {
                        "name": "Gebratenes Karpfenfilet auf Goldrübenpüree",
                        "tags": [
                            "Hauptspeise",
                            "Karpfen",
                            "D (Fische)"
                        ],
                        image: "6453e1c1265186d68cbd6be8"
                    },
                    {
                        "name": "Deftiger Erdäpfeleintopf",
                        "tags": [
                            "Hauptspeise",
                            "Kartoffeln",
                            "Vegetarisch"
                        ],
                        image: "6453e22d265186d68cbd6bea"
                    },
                    {
                        "name": "Schweinsfilet mit Waldhonig-Pfeffermarinade",
                        "tags": [
                            "Hauptspeise",
                            "Schwein",
                            "Honig"
                        ],
                        image: "6453e2be265186d68cbd6bee"
                    },
                    {
                        "name": "Lachsforellenfilet in Honig-Senf-Sauce",
                        "tags": [
                            "Hauptspeise",
                            "Lachs",
                            "Honig",
                            "M (Senf)"
                        ],
                        image: "6453e36e265186d68cbd6bf2"
                    },
                    {
                        "name": "Rahm-Kren-Suppe",
                        "tags": [
                            "Hauptspeise",
                            "Suppe",
                            "Kren",
                            "Vegetarisch"
                        ],
                        image: "6453e454265186d68cbd6bf8"
                    },
                    {
                        "name": "Kalbsbraten",
                        "tags": [
                            "Hauptspeise",
                            "Kalb",
                        ],
                        image: "6453e48d265186d68cbd6bfa"
                    },
                    {
                        "name": "Gespickter Rehrücken",
                        "tags": [
                            "Hauptspeise",
                            "Reh",
                        ],
                        image: "6453e409265186d68cbd6bf6"
                    },
                    {
                        "name": "Hamburger",
                        "tags": [
                            "Hauptspeise",
                            "Rindfleisch",
                            "A (Glutenhaltiges Getreide)",
                            "C (Eier)",
                            "G (Milch)",
                            "N (Sesamsamen)"
                        ],
                        image: "6609b87f8dc2eaa2638338fc"
                    },
                    {
                        "name": "Pasta mit Bärlauch und Tomaten",
                        "tags": [
                            "Hauptspeise",
                            "Pasta",
                            "Bärlauch",
                            "Tomaten",
                            "G (Milch)",
                            "C (Eier)"
                        ],
                        image: "6609b98db7bd27e3a4a22209"
                    },
                    {
                        "name": "Gefüllter Rollbraten",
                        "tags": [
                            "Hauptspeise",
                            "Schwein",
                            "Weißkraut",
                            "G (Milch)"
                        ],
                        image: "6609bb48c06cbe8c941f47b5"
                    },
                    {
                        "name": "Gebratenes Hähnchen mit Chili-Soße",
                        "tags": [
                            "Hauptspeise",
                            "Hänchen",
                            "A (Glutenhaltiges Getreide)",
                            "G (Milch)",
                        ],
                        image: "6609bf88a7063e6e33ac4afb"
                    },
                ];

                nachspeisen = [
                    {
                        "name": "Maiwipferparfait auf Erdberragout",
                        "tags": [
                            "Nachspeise",
                            "Erdbeeren",
                            "Vegetarisch"
                        ],
                        image: "6453d9c2d7155e9950293c2b"
                    },
                    {
                        "name": "Erdäpfel-Kaffee-Nusskipferln",
                        "tags": [
                            "Nachspeise",
                            "A (Glutenhaltiges Getreide)",
                            "G (Milch)",
                            "Kartoffeln",
                            "Vegetarisch"
                        ],
                        image: "6453db5ed7155e9950293c32"
                    },
                    {
                        "name": "Erdbeer-Holunderblüten-Schnitten",
                        "tags": [
                            "Nachspeise",
                            "Erdbeeren",
                            "G (Milch)",
                            "Vegetarisch"
                        ],
                        image: "6453dbc7d7155e9950293c34"
                    },
                    {
                        "name": "Topfenstrudel mit Osterbrot und Vanillesauce",
                        "tags": [
                            "Nachspeise",
                            "Topfen",
                            "Strudel",
                            "G (Milch)",
                            "A (Glutenhaltiges Getreide)"
                        ],
                        image: "6453ddc8265186d68cbd6bd0"
                    },
                    {
                        "name": "Marzipanschnitten",
                        "tags": [
                            "Nachspeise",
                            "Marzipan",
                            "Pflanzenöl"
                        ],
                        image: "6453dec0265186d68cbd6bd4"
                    },
                    {
                        "name": "Gebackenes Eis auf Beerenragout",
                        "tags": [
                            "Nachspeise",
                            "Eis",
                            "Beeren",
                            "Ragout",
                            "Vegetarisch"
                        ],
                        image: "6453df12265186d68cbd6bd6"
                    },
                    {
                        "name": "Karamelldessert mit Cantuccini",
                        "tags": [
                            "Nachspeise",
                            "Karamell",
                            "G (Milch)",
                        ],
                        image: "6453df51265186d68cbd6bd8"
                    },
                    {
                        "name": "Pink-Panna-Cotta auf Vanillecreme",
                        "tags": [
                            "Nachspeise",
                            "Vanille",
                            "G (Milch)",
                        ],
                        image: "6453e0e6265186d68cbd6be2"
                    },
                    {
                        "name": "Erdbeer-Rhabarber-Kuchen",
                        "tags": [
                            "Nachspeise",
                            "Erdbeeren",
                            "Rhabarber",
                            "Kuchen",
                            "Vegetarisch"
                        ],
                        image: "6453e4e1265186d68cbd6bfc"
                    },
                    {
                        "name": "Pfannkuchen mit Himbeeren",
                        "tags": [
                            "Nachspeise",
                            "Himbeeren",
                            "Mehlspeise",
                            "C (Eier)",
                            "A (Glutenhaltiges Getreide)",
                            "G (Milch)"
                        ],
                        image: "6609b720098e1ee1d367af65"
                    },
                    {
                        "name": "Erdbeer Eclairs",
                        "tags": [
                            "Nachspeise",
                            "Erdbeeren",
                            "Mehlspeise",
                            "C (Eier)",
                            "A (Glutenhaltiges Getreide)",
                            "F (Sojabohnen)",
                            "G (Milch)"
                        ],
                        image: "660a60a29c62ca50aa0930fe"
                    },
                    {
                        "name": "Joghurt mit Obst",
                        "tags": [
                            "Nachspeise",
                            "Joghurt",
                            "Walnüsse",
                            "G (Milch)"
                        ],
                        image: "660a618a3f709082d92a40a5"
                    },
                    {
                        "name": "Tiramisu",
                        "tags": [
                            "Nachspeise",
                            "G (Milch)",
                            "A (Glutenhaltiges Getreide)",
                            "C (Eier)",
                        ],
                        image: "660a61f927f27c193731ed09"
                    },
                    {
                        "name": "Creme Karamell",
                        "tags": [
                            "Nachspeise",
                            "Himbeeren",
                            "G (Milch)"
                        ],
                        image: "660a62c246ddcc360bf8293c"
                    },
                    {
                        "name": "Himbeersorbet",
                        "tags": [
                            "Nachspeise",
                            "Kaltspeise",
                            "Himbeeren",
                            "G (Milch)",
                            "A (Glutenhaltiges Getreide)",
                            "C (Eier)",
                        ],
                        image: "660a6380f3277c9a13704ac3"
                    },
                ]
                let createMeal = (selection, menu, veg, lMeals) => {
                    let meal;
                    do {
                        meal = JG.random(...selection);
                    } while (lMeals.find(m => m.name == meal.name) || veg && !meal.tags.includes("Vegetarisch"));
                    meal.tags.push("Menü " + String.fromCharCode(65 + menu));
                    /*let registered = JG.integer(50, 100);
                    let ordered = JG.integer(registered, Math.round(registered * 1.5));
                    let served = JG.integer(Math.round(ordered / 2), ordered);
                    let wasted = JG.integer(0, ordered - served);
                    meal.statistics = {
                        ordered: ordered,
                        served: served,
                        wasted: wasted
                    };*/
                    return meal;
                };
                let lMeals = [];
                lMeals.push({
                    name: "Salatbuffet",
                    tags: ["Salat", "Vorspeise"],
                    image: "6453eb746cc5e7c1534445f1"
                });
                let numMenus = JG.integer(2, 3);
                for (let i = 0; i < numMenus; i++) {
                    lMeals.push(createMeal(hauptspeisen, i, i == 0, lMeals));
                    if (JG.integer(0, 99) >= 30) lMeals.push(createMeal(vorspeisen, i, false, lMeals));
                    if (JG.integer(0, 99) >= 5) lMeals.push(createMeal(nachspeisen, i, false, lMeals));
                }
                return lMeals;
            })();
        }
        return retValue;
    },
    startDate() {
        return moment(new Date("2023-09-11")).add(JG.index() * 7, 'days').toISOString().split('T')[0];
    },
    endDate() {
        return moment(this.startDate).add(4, 'days').toISOString().split('T')[0];
    },
});
