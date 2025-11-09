

const imageFolder = './test-data/images';
const fs = require('fs');

let imageFiles = {
    "6453dd72265186d68cbd6bce":"Chinakohlsalat-Hanfmarinade-202301q-lp.jpg", //https://www.kochen-kueche.com/rezept/chinakohlsalat-mit-hanfmarinade
    "6453eb746cc5e7c1534445f1":"dan-gold-298710.jpg", //https://united-against-waste.at/vermeiden/garantiert-ohne-garnitur/
    "6453db5ed7155e9950293c32":"Erdaepfel-Kaffee-Nusskipferl-202301q-lp.jpg", //https://www.kochen-kueche.com/rezepte-liste
    "6453e22d265186d68cbd6bea":"Erdaepfeleintopf-202205q-lp.jpeg", //https://www.kochen-kueche.com/rezept/deftiger-erdaepfeleintopf
    "6453dbc7d7155e9950293c34":"Erdbeer-Holunderblueten-Schnitten-202303q-lp.jpeg", //https://www.kochen-kueche.com/rezept/erdbeer-holunderblueten-schnitten
    "6453e4e1265186d68cbd6bfc":"Erdbeer-Rhabarber-Kuchen-202203q-lp.jpeg", //https://www.kochen-kueche.com/rezept/erdbeer-rhabarber-kuchen
    "6453e25d265186d68cbd6bec":"food-3228057_640.jpg", //https://pixabay.com/de/photos/lebensmittel-erfrischung-teller-3228057/
    "6453df12265186d68cbd6bd6":"Gebackenes-Eis-Beerenragout-202206q-lp.jpg", //https://www.kochen-kueche.com/rezept/gebackenes-eis-beerenragout
    "6453e409265186d68cbd6bf6":"forest-house-2748328_640.jpg", //https://pixabay.com/de/photos/forsthaus-wild-rehr%C3%BCcken-usedom-2748328/
    "6453e019265186d68cbd6bdc":"Grammelsterz-202206q-lp.jpeg", //https://www.kochen-kueche.com/rezept/grammelsterz
    "6453e053265186d68cbd6bde":"Huehnerbrust-Apfel-Topfenfuelle-202206q-lp.jpeg", //https://www.kochen-kueche.com/rezept/huehnerbrust-apfel-topfen-fuelle
    "6453e2fb265186d68cbd6bf0":"Ingwer-Karottessuppe-Honig-202205h-lp.jpg", //https://www.kochen-kueche.com/rezept/ingwer-karottensuppe-mit-honig
    "6453e48d265186d68cbd6bfa":"kalbsbraten-mit-speck-semmelwuerfel-kruste.jpg", //https://www.kochen-kueche.com/rezept/kalbsbraten
    "6453df51265186d68cbd6bd8":"Karamelldessert-Cantuccini-202206q-lp.jpg", //https://www.kochen-kueche.com/rezept/karamelldessert-mit-cantuccini
    "6453e1c1265186d68cbd6be8":"Karpfenfilet-Goldruebenpueree-202206q-lp.jpeg", //https://www.kochen-kueche.com/rezept/gebratenes-karpfenfilet-auf-goldruebenpueree
    "6453dcb7265186d68cbd6bca":"Karreesteak-vom-Schwein-202204q1-lp.jpeg", //https://www.kochen-kueche.com/rezept/karreesteak-vom-schwein-la-cordon-bleu
    "6453e36e265186d68cbd6bf2":"Lachsforelle-Honig-Senf-Sauce-202205q2-lp.jpg", //https://www.kochen-kueche.com/rezept/lachsforellenfilet-honig-senf-sauce
    "6453d9c2d7155e9950293c2b":"Maiwipferlparfait-Erdbeerragout-202203q-lp.jpeg", //https://www.kochen-kueche.com/rezept/maiwipferlparfait-erdbeerragout-maiwipferlsirup
    "6453dec0265186d68cbd6bd4":"Marzipanschnitten-202206q-lp.jpg", //https://www.kochen-kueche.com/rezept/marzipanschnitten
    "6453df88265186d68cbd6bda":"Penne-alla-Pizza-202206q-lp.jpg", //https://www.kochen-kueche.com/rezept/penne-alla-pizza
    "6453e0e6265186d68cbd6be2":"Pink-Panna-cotta-Vanillecreme-202206q-lp.jpeg", //https://www.kochen-kueche.com/rezept/pink-panna-cotta-auf-vanillecreme
    "6453dcf6265186d68cbd6bcc":"Ragout-Maibock-202303q-lp.jpg", //https://www.kochen-kueche.com/rezept/ragout-vom-maibock
    "6453e454265186d68cbd6bf8":"Rahm-Kren-Suppe-Raeucherforelle-202106q-lp.jpeg", //https://www.kochen-kueche.com/rezept/rahm-kren-suppe
    "6453da78d7155e9950293c2e":"Rindsfilet-Kirschenragout-Romanescopueree-Schokomaiwipferl-202203q-lp.jpg", //https://www.kochen-kueche.com/rezept/rindsfilet-kirschenragout-romanescopueree-schokomaiwipferl
    "6453de1f265186d68cbd6bd2":"Rosa-gebratener-Rehruecken-Rote-Rueben-Risotto-202206q2-lp.jpg", //https://www.kochen-kueche.com/rezept/rosa-gebratener-rehruecken-rote-rueben-risotto
    "6453e09c265186d68cbd6be0":"beetroot-2740388_640.jpg", //https://pixabay.com/de/photos/rote-bete-suppe-essen-lebensmittel-2740388/
    "6453e2be265186d68cbd6bee":"Schweinsfilet-Waldhonig-Pfeffermarinade-202205q-lp.jpg", //https://www.kochen-kueche.com/rezept/schweinsfilet-waldhonig-pfeffermarinade
    "6453dc72265186d68cbd6bc8":"Seeforelle-im-Zucchinimantel-202204q-lp.jpg", //https://www.kochen-kueche.com/rezept/seeforelle-im-zucchinimantel
    "6453dadad7155e9950293c30":"Suesskartoffeln-Forelle-Quinoa-Fuelle-202301q-lp.jpg", //https://www.kochen-kueche.com/rezept/suesskartoffeln-forellen-quinoa-gemuese-fuelle
    "6453ddc8265186d68cbd6bd0":"Topfenstrudel-Vanillesauce-202302q-lp.jpg", //https://www.kochen-kueche.com/rezept/topfenstrudel-osterbrot-vanillesauce
    "6453e180265186d68cbd6be6":"Weiße-Ruebensuppe-Haselnuesse-202206q-lp.jpeg", //https://www.kochen-kueche.com/rezept/weisse-ruebensuppe-geroestete-haselnuesse
    "6453e3d5265186d68cbd6bf4":"soup-7083894_640.jpg", //https://pixabay.com/de/photos/suppe-kohlrabi-hei%C3%9Fes-essen-gericht-7083894/
    "6453e130265186d68cbd6be4":"Zweierlei-Rind-Rote-Rueben-Knoedel-202206q-lp.jpg", //https://www.kochen-kueche.com/rezept/zweierlei-rind-rote-rueben-knoedel
    "6609b720098e1ee1d367af65":"pancakes-1984716_640.jpg", //https://pixabay.com/de/photos/pfannkuchen-schaumomelette-omelette-1984716/
    "6609b87f8dc2eaa2638338fc":"hamburger-1238246_640.jpg", //https://pixabay.com/de/photos/hamburger-burger-barbeque-grillen-1238246/
    "6609b98db7bd27e3a4a22209":"pasta-2206601_640.jpg", //https://pixabay.com/de/photos/pasta-b%C3%A4rlauch-kr%C3%A4uter-tomaten-2206601/
    "6609bb48c06cbe8c941f47b5":"roll-roast-3470_640.jpg", //https://pixabay.com/de/photos/rollbraten-gef%C3%BCllt-fleisch-3470/
    "6609bcca1ff45a09aa90dc9f":"salad-2228890_640.jpg", //https://pixabay.com/de/photos/salat-fr%C3%BChling-radieschen-2228890/
    "6609bd91a7af788fd198a7d6":"salad-1804441_640.jpg", //https://pixabay.com/de/photos/salat-linsen-gem%C3%BCse-vegetarisch-1804441/
    "6609be2d880f9e69154a2620":"pasta-salad-1967501_640.jpg", //https://pixabay.com/de/photos/pasta-salat-oliven-feta-k%C3%A4se-rucola-1967501/
    "6609bec3ff9f5db682bfd706":"tofu-7249293_640.jpg", //https://pixabay.com/de/photos/tofu-suppe-vorspeise-lebensmittel-7249293/
    "6609bf88a7063e6e33ac4afb":"fried-2514932_640.jpg", //https://pixabay.com/de/photos/gebraten-h%C3%A4hnchen-so%C3%9Fe-chili-2514932/
    "6609c048e11e8d69543ed559":"pumpkin-soup-3645375_640.jpg", //https://pixabay.com/de/photos/k%C3%BCrbissuppe-suppe-lebensmittel-3645375/
    "6609c0e0e3a7393139cd9734":"soupe-1335168_640.jpg", //https://pixabay.com/de/photos/suppe-gem%C3%BCse-vegetarische-k%C3%BCche-1335168/
    "6609c154b09f53f5045ac911":"potato-soup-2152254_640.jpg", //https://pixabay.com/de/photos/kartoffelsuppe-kartoffel-suppe-2152254/
    "6609c1aefe3db849a380002a":"soupe-2705755_640.jpg", //https://pixabay.com/de/photos/kartoffelsuppe-kartoffel-suppe-2152254/
    "660a60a29c62ca50aa0930fe":"eclair-3366430_640.jpg", //https://pixabay.com/de/photos/eclair-erdbeerkuchen-erdbeeren-3366430/
    "660a618a3f709082d92a40a5":"dessert-1337294_640.jpg", //https://pixabay.com/de/photos/nachspeise-joghurt-obst-mandarinen-1337294/
    "660a61f927f27c193731ed09":"tiramisu-1033207_640.jpg", //https://pixabay.com/de/photos/tiramisu-nachtisch-essen-dessert-1033207/
    "660a62c246ddcc360bf8293c":"caramel-1958358_640.jpg", //https://pixabay.com/de/photos/karamell-creme-flan-milch-1958358/
    "660a6380f3277c9a13704ac3":"raspberries-2130729_640.jpg", //https://pixabay.com/de/photos/himbeeren-sorbet-himbeersorbet-2130729/
}

let images = Object.keys(imageFiles).map((_id) => {
    let filePath = `${imageFolder}/${imageFiles[_id]}`;
    let content = fs.readFileSync(filePath);
    let base64 = content.toString('base64');
    let saveData = "data:image/jpeg;base64,"+base64;
    return {
        _id:_id,
        image:saveData,
    }
});

module.exports = images;