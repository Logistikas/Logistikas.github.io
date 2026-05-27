const START_SCENE_ID = "start";
let totalScore = 0;

// Tai prototipo struktura, kuria galesi pildyti savu scenarijumi.
const scenes = {
  start: {
    title: "Žaidimo pradžia",
    text: "Pradedate darbą logistikos įmonėje. Jūsų užduotis – užtikrinti, kad krovinys būtų pristatytas laiku, saugiai ir kuo mažesniais kaštais.",
    image: "assets/images/projects-Girteka.jpg",
    imageAlt: "Logistikos įmonės aplinka",
    choices: [
      { text: "Pradėti žaidimą", next: "order_received", score: 0 }
    ]
  },

  order_received: {
    title: "1. Užsakymo gavimas",
    text: "Klientas pateikia skubų užsakymą. Krovinys turi būti pristatytas iki 16:00. Ką darote pirmiausia?",
    image: "assets/images/projects-Girteka.jpg",
    imageAlt: "Logistikos užsakymo gavimas",
    choices: [
      { text: "Patikrinti užsakymo detales, terminą ir krovinio reikalavimus", next: "cargo_check", score: 2 },
      { text: "Priimti užsakymą, bet detales pasitikslinti vėliau", next: "cargo_check", score: 0 },
      { text: "Iš karto pažadėti pristatymą iki 16:00 nieko netikrinus", next: "early_client_problem", score: -2 }
    ]
  },

  early_client_problem: {
    title: "Klientui pažadėta per anksti",
    text: "Klientas tikisi pristatymo iki 16:00, tačiau komanda dar nežino krovinio dydžio, maršruto apribojimų ir realaus išvykimo laiko.",
    image: "assets/images/projects-Girteka.jpg",
    imageAlt: "Skubotas pažadas klientui",
    choices: [
      { text: "Pripažinti, kad terminas dar turi būti patvirtintas", next: "cargo_check", score: 1 },
      { text: "Tęsti planavimą ir tikėtis, kad viskas pavyks", next: "cargo_check", score: -1 },
      { text: "Spausti komandą važiuoti kuo greičiau", next: "ending_pressure_mistake", score: -3 }
    ]
  },

  cargo_check: {
    title: "2. Krovinio informacijos tikrinimas",
    text: "Prieš planuojant transportą reikia įvertinti krovinį. Ką darote?",
    image: "assets/images/GIRTEKA-HR-2545-scaled-1.jpg",
    imageAlt: "Krovinio informacijos tikrinimas",
    choices: [
      { text: "Patikrinti krovinio svorį, matmenis ir dokumentus", next: "route_choice", score: 2 },
      { text: "Peržiūrėti tik pagrindinę informaciją", next: "route_choice", score: 0 },
      { text: "Praleisti krovinio patikrą, nes nėra laiko", next: "wrong_vehicle_risk", score: -2 }
    ]
  },

  wrong_vehicle_risk: {
    title: "Netinkamo transporto rizika",
    text: "Kadangi krovinys nebuvo patikrintas, kyla rizika pasirinkti netinkamą transporto priemonę arba turėti problemų terminale.",
    image: "assets/images/GIRTEKA-HR-2545-scaled-1.jpg",
    imageAlt: "Netinkamo transporto rizika",
    choices: [
      { text: "Grįžti ir patikrinti krovinio duomenis", next: "route_choice", score: 1 },
      { text: "Rinktis transportą pagal spėjimą", next: "vehicle_choice", score: -1 },
      { text: "Išsiųsti transportą nepatikrinus krovinio", next: "ending_document_error", score: -3 }
    ]
  },

  route_choice: {
    title: "3. Maršruto pasirinkimas",
    text: "Aistė planuoja maršrutą. Reikia pasirinkti kelią, kuris atitiktų laiką, saugumą ir kliento reikalavimus.",
    image: "assets/images/GIRTEKA-Volvo-Electric-1266-scaled-1.jpg",
    imageAlt: "Sunkvežimis kelyje",
    choices: [
      { text: "Patikrinti eismo sąlygas, kelių ribojimus ir kliento laiko langą", next: "backup_route", score: 2 },
      { text: "Rinktis pigiausią kelią", next: "backup_route", score: 0 },
      { text: "Viską palikti GPS navigacijai", next: "gps_problem", score: -2 }
    ]
  },

  gps_problem: {
    title: "GPS parinko netinkamą kelią",
    text: "Navigacija parinko trumpą kelią, bet jame yra apribojimų sunkiajam transportui. Komanda turi reaguoti.",
    image: "assets/images/GIRTEKA-Volvo-Electric-1266-scaled-1.jpg",
    imageAlt: "Netinkamas maršrutas",
    choices: [
      { text: "Sustabdyti maršrutą ir patikrinti alternatyvas", next: "backup_route", score: 1 },
      { text: "Bandytis apvažiuoti pagal GPS", next: "road_problem", score: -1 },
      { text: "Važiuoti toliau, nors kelias abejotinas", next: "ending_route_failure", score: -3 }
    ]
  },

  backup_route: {
    title: "4. Atsarginis maršrutas",
    text: "Pagrindiniame kelyje gali susidaryti spūstys. Ką darote?",
    image: "assets/images/GIRTEKA-Volvo-Electric-1266-scaled-1.jpg",
    imageAlt: "Atsarginio maršruto planavimas",
    choices: [
      { text: "Iš anksto pasiruošti atsarginį maršrutą", next: "data_analysis", score: 2 },
      { text: "Atsarginį maršrutą ruošti tik atsiradus problemai", next: "data_analysis", score: 0 },
      { text: "Nesvarstyti alternatyvų", next: "road_problem", score: -2 }
    ]
  },

  data_analysis: {
    title: "5. Duomenų analizė",
    text: "Rūta analizuoja duomenis. Reikia nuspręsti, kokia informacija remtis.",
    image: "assets/images/projects-Girteka.jpg",
    imageAlt: "Duomenų analizė logistikoje",
    choices: [
      { text: "Patikrinti istorinius duomenis ir perspėti komandą apie riziką", next: "weather_check", score: 2 },
      { text: "Žiūrėti tik į šiandienos užsakymą", next: "weather_check", score: 0 },
      { text: "Prognozuoti pagal intuiciją", next: "bad_prediction", score: -2 }
    ]
  },

  bad_prediction: {
    title: "Netiksli prognozė",
    text: "Sprendimas priimtas pagal nuojautą. Paaiškėja, kad šiame maršrute dažnai būna vėlavimų ir terminalo eilės.",
    image: "assets/images/projects-Girteka.jpg",
    imageAlt: "Netiksli prognozė",
    choices: [
      { text: "Perskaičiuoti planą pagal duomenis", next: "weather_check", score: 1 },
      { text: "Tęsti, bet perspėti klientą apie riziką", next: "weather_check", score: 0 },
      { text: "Nieko nekeisti", next: "ending_data_failure", score: -3 }
    ]
  },

  weather_check: {
    title: "6. Orų ir kelio sąlygų patikra",
    text: "Dalyje maršruto galimas stiprus lietus. Tai gali paveikti saugumą ir pristatymo laiką.",
    image: "assets/images/GIRTEKA-Volvo-Electric-1266-scaled-1.jpg",
    imageAlt: "Kelio ir oro sąlygos",
    choices: [
      { text: "Patikrinti orų prognozę ir kelio sąlygas", next: "vehicle_choice", score: 2 },
      { text: "Tik perspėti vairuotoją būti atsargesniam", next: "vehicle_choice", score: 0 },
      { text: "Ignoruoti oro sąlygas", next: "safety_risk", score: -2 }
    ]
  },

  safety_risk: {
    title: "Saugumo rizika kelyje",
    text: "Prasidėjo stiprus lietus. Vairuotojas praneša, kad matomumas prastas, o kelias slidus.",
    image: "assets/images/GIRTEKA-Volvo-Electric-1266-scaled-1.jpg",
    imageAlt: "Pavojingos kelio sąlygos",
    choices: [
      { text: "Leisti sulėtinti greitį ir atnaujinti ETA", next: "vehicle_choice", score: 1 },
      { text: "Liepti tęsti pagal planą", next: "road_problem", score: -1 },
      { text: "Spausti vairuotoją nevėluoti", next: "ending_safety_incident", score: -3 }
    ]
  },

  vehicle_choice: {
    title: "7. Transporto priemonės pasirinkimas",
    text: "Reikia nuspręsti, kokią transporto priemonę skirti šiam užsakymui.",
    image: "assets/images/GIRTEKA-HR-2545-scaled-1.jpg",
    imageAlt: "Transporto priemonės pasirinkimas",
    choices: [
      { text: "Parinkti transportą pagal krovinio dydį, svorį ir terminą", next: "vehicle_inspection", score: 2 },
      { text: "Naudoti artimiausią laisvą transportą", next: "vehicle_inspection", score: 0 },
      { text: "Imti pirmą pasitaikiusį sunkvežimį", next: "wrong_truck_problem", score: -2 }
    ]
  },

  wrong_truck_problem: {
    title: "Pasirinktas netinkamas transportas",
    text: "Paaiškėja, kad pasirinktas transportas nėra optimalus: gali trūkti vietos arba padidėti kaštai.",
    image: "assets/images/GIRTEKA-HR-2545-scaled-1.jpg",
    imageAlt: "Netinkamas sunkvežimis",
    choices: [
      { text: "Pakeisti transportą į tinkamesnį", next: "vehicle_inspection", score: 1 },
      { text: "Palikti tą patį transportą ir rizikuoti", next: "vehicle_inspection", score: -1 },
      { text: "Išvažiuoti nieko nekeičiant", next: "ending_costs", score: -3 }
    ]
  },

  vehicle_inspection: {
    title: "8. Transporto priemonės patikra",
    text: "Tomas tikrina transporto priemonę prieš išvykimą. Ką jis daro?",
    image: "assets/images/vairuotojas.jpeg",
    imageAlt: "Vairuotojas tikrina transporto priemonę",
    choices: [
      { text: "Atlikti pilną transporto priemonės ir dokumentų patikrą", next: "driver_briefing", score: 2 },
      { text: "Greitai apžiūrėti ir išvažiuoti", next: "driver_briefing", score: 0 },
      { text: "Pasitikėti, kad padanga laikys", next: "tire_problem", score: -2 }
    ]
  },

  tire_problem: {
    title: "Padangos problema",
    text: "Kelyje vairuotojas pajunta, kad transporto priemonė juda nestabiliai. Gali būti padangos problema.",
    image: "assets/images/vairuotojas.jpeg",
    imageAlt: "Padangos problema",
    choices: [
      { text: "Saugiai sustoti ir pranešti vadovui", next: "driver_briefing", score: 1 },
      { text: "Sumažinti greitį ir važiuoti toliau", next: "road_problem", score: -1 },
      { text: "Ignoruoti problemą", next: "ending_safety_incident", score: -3 }
    ]
  },

  driver_briefing: {
    title: "9. Vairuotojo instruktažas",
    text: "Prieš išvykimą vairuotojui reikia perduoti svarbią informaciją.",
    image: "assets/images/vairuotojas.jpeg",
    imageAlt: "Vairuotojo instruktažas",
    choices: [
      { text: "Paaiškinti maršrutą, ETA ir rizikos vietas", next: "road_problem", score: 2 },
      { text: "Išsiųsti tik adresą", next: "road_problem", score: 0 },
      { text: "Manyti, kad vairuotojas pats viską supras", next: "communication_problem", score: -2 }
    ]
  },

  communication_problem: {
    title: "Komunikacijos problema",
    text: "Vairuotojas nežino, kurioje vietoje gali būti ribojimai, ir vėliau prašo papildomos informacijos jau būdamas kelyje.",
    image: "assets/images/vairuotojas.jpeg",
    imageAlt: "Komunikacijos klaida",
    choices: [
      { text: "Greitai perduoti trūkstamą informaciją", next: "road_problem", score: 1 },
      { text: "Atsakyti tik trumpai", next: "road_problem", score: -1 },
      { text: "Nereaguoti iš karto", next: "ending_communication_failure", score: -3 }
    ]
  },

  road_problem: {
    title: "10. Netikėta situacija kelyje",
    text: "Kelyje įvyksta avarija, kelias užblokuotas. Komanda turi greitai reaguoti.",
    image: "assets/images/GIRTEKA-Volvo-Electric-1266-scaled-1.jpg",
    imageAlt: "Netikėta situacija kelyje",
    choices: [
      { text: "Susisiekti su Aiste ir atnaujinti ETA laiką", next: "detour_choice", score: 2 },
      { text: "Palaukti, gal situacija pagerės", next: "detour_choice", score: 0 },
      { text: "Važiuoti toliau nieko nepranešus", next: "client_update_problem", score: -2 }
    ]
  },

  client_update_problem: {
    title: "Klientas neinformuotas",
    text: "Klientas pats skambina ir klausia, kodėl krovinys vėluoja. Situacija tampa įtempta.",
    image: "assets/images/projects-Girteka.jpg",
    imageAlt: "Nepatenkintas klientas",
    choices: [
      { text: "Atsiprašyti ir pateikti realų ETA", next: "detour_choice", score: 1 },
      { text: "Pasakyti, kad situacija dar tikslinama", next: "detour_choice", score: 0 },
      { text: "Pasakyti, kad krovinys jau beveik vietoje, nors dar liko 40 km", next: "ending_trust_lost", score: -3 }
    ]
  },

  detour_choice: {
    title: "11. Sprendimas dėl apvažiavimo",
    text: "Reikia nuspręsti, ar rinktis ilgesnį, bet laisvą kelią.",
    image: "assets/images/GIRTEKA-Volvo-Electric-1266-scaled-1.jpg",
    imageAlt: "Apvažiavimo pasirinkimas",
    choices: [
      { text: "Pasirinkti patikrintą apvažiavimą", next: "terminal_arrival", score: 2 },
      { text: "Laukti, kol kelias atsilaisvins", next: "terminal_arrival", score: 0 },
      { text: "Važiuoti nepatikrintu keliu", next: "detour_failure", score: -2 }
    ]
  },

  detour_failure: {
    title: "Apvažiavimas nepavyko",
    text: "Nepatikrintas kelias pasirodo netinkamas sunkiajam transportui. Prarandama dar daugiau laiko.",
    image: "assets/images/GIRTEKA-Volvo-Electric-1266-scaled-1.jpg",
    imageAlt: "Nepavykęs apvažiavimas",
    choices: [
      { text: "Grįžti prie patikrinto maršruto", next: "terminal_arrival", score: 0 },
      { text: "Ieškoti kito nepatikrinto kelio", next: "ending_route_failure", score: -3 },
      { text: "Informuoti klientą apie vėlavimą", next: "terminal_arrival", score: 1 }
    ]
  },

  terminal_arrival: {
    title: "12. Atvykimas į terminalą",
    text: "Tomas atvyksta į terminalą. Reikia pasirinkti, kaip pradėti atvykimo procesą.",
    image: "assets/images/GIRTEKA-HR-2545-scaled-1.jpg",
    imageAlt: "Atvykimas į terminalą",
    choices: [
      { text: "Užsiregistruoti prie vartų ir pateikti dokumentus", next: "document_check", score: 2 },
      { text: "Iš anksto paskambinti klientui ir pasitikslinti rampą", next: "document_check", score: 2 },
      { text: "Važiuoti prie pirmos laisvos rampos", next: "terminal_conflict", score: -2 }
    ]
  },

  terminal_conflict: {
    title: "Terminalo taisyklių pažeidimas",
    text: "Terminalo darbuotojai sustabdo transportą, nes vairuotojas neatliko registracijos pagal taisykles.",
    image: "assets/images/GIRTEKA-HR-2545-scaled-1.jpg",
    imageAlt: "Problema terminale",
    choices: [
      { text: "Atsiprašyti ir atlikti registraciją pagal taisykles", next: "document_check", score: 0 },
      { text: "Bandytis ginčytis su terminalo darbuotojais", next: "ending_terminal_conflict", score: -3 },
      { text: "Skambinti vadybininkui ir prašyti pagalbos", next: "document_check", score: 1 }
    ]
  },

  document_check: {
    title: "13. Dokumentų neatitikimas",
    text: "Terminale pastebima, kad viename dokumente nurodytas netikslus krovinio kiekis.",
    image: "assets/images/projects-Girteka.jpg",
    imageAlt: "Dokumentų tikrinimas",
    choices: [
      { text: "Sustabdyti procesą ir patikslinti dokumentus su biuru", next: "final_result", score: 2 },
      { text: "Iškrauti krovinį ir dokumentus pataisyti vėliau", next: "final_result", score: -1 },
      { text: "Paprašyti terminalo darbuotojo praleisti šį kartą", next: "ending_document_error", score: -3 }
    ]
  },

  ending_excellent: {
    title: "Pabaiga 1 – Puiki logistika",
    text: "Krovinys pristatytas laiku. Klientas patenkintas, komanda dirbo koordinuotai, sprendimai buvo paremti duomenimis ir aiškia komunikacija.",
    image: "",
    imageAlt: "",
    choices: [],
    ending: true
  },

  ending_good: {
    title: "Pabaiga 2 – Pristatyta sėkmingai",
    text: "Krovinys pristatytas. Buvo keli smulkūs netikslumai, bet komanda laiku sureagavo ir išlaikė gerą rezultatą.",
    image: "",
    imageAlt: "",
    choices: [],
    ending: true
  },

  ending_risky: {
    title: "Pabaiga 3 – Pristatyta, bet buvo rizikų",
    text: "Krovinys pasiekė klientą, tačiau kai kurie sprendimai buvo rizikingi. Procesą reikėtų pagerinti, kad tokios situacijos nesikartotų.",
    image: "",
    imageAlt: "",
    choices: [],
    ending: true
  },

  ending_delay: {
    title: "Pabaiga 4 – Vėlavimas",
    text: "Krovinys pristatytas pavėluotai. Pagrindinės priežastys – nepakankamas planavimas, vėlyva komunikacija ir netikslus rizikų vertinimas.",
    image: "",
    imageAlt: "",
    choices: [],
    ending: true
  },

  ending_costs: {
    title: "Pabaiga 5 – Papildomi kaštai",
    text: "Krovinys pristatytas, bet dėl netinkamų sprendimų išaugo kaštai: reikėjo keisti maršrutą, spręsti terminalo problemas arba taisyti dokumentus.",
    image: "",
    imageAlt: "",
    choices: [],
    ending: true
  },

  ending_chaos: {
    title: "Pabaiga 6 – Logistikos chaosas",
    text: "Sprendimų grandinė buvo nesėkminga: vėlavo krovinys, klientas buvo nepatenkintas, o komanda turėjo taisyti kelias problemas vienu metu.",
    image: "",
    imageAlt: "",
    choices: [],
    ending: true
  },

  ending_pressure_mistake: {
    title: "Pabaiga 7 – Per didelis spaudimas komandai",
    text: "Komanda buvo spaudžiama vykdyti pažadą, kuris nebuvo pagrįstas realiais duomenimis. Tai sukėlė klaidų ir prastą kliento patirtį.",
    image: "",
    imageAlt: "",
    choices: [],
    ending: true
  },

  ending_document_error: {
    title: "Pabaiga 8 – Dokumentų klaida",
    text: "Dokumentų neatitikimai sukėlė problemų terminale. Krovinio procesas sustojo, o klientas liko nepatenkintas dėl netvarkingos dokumentacijos.",
    image: "",
    imageAlt: "",
    choices: [],
    ending: true
  },

  ending_route_failure: {
    title: "Pabaiga 9 – Maršruto nesėkmė",
    text: "Netinkamai pasirinktas arba nepatikrintas maršrutas sukėlė didelį vėlavimą. Krovinys nebuvo pristatytas pagal planą.",
    image: "",
    imageAlt: "",
    choices: [],
    ending: true
  },

  ending_data_failure: {
    title: "Pabaiga 10 – Bloga prognozė",
    text: "Sprendimai buvo priimti pagal intuiciją, o ne pagal duomenis. Dėl to komanda nepasiruošė rizikoms ir prarado laiką.",
    image: "",
    imageAlt: "",
    choices: [],
    ending: true
  },

  ending_safety_incident: {
    title: "Pabaiga 11 – Saugumo incidentas",
    text: "Saugumo rizikos buvo ignoruojamos. Transporto priemonė turėjo sustoti, o pristatymas buvo sutrikdytas. Logistikoje saugumas visada turi būti prioritetas.",
    image: "",
    imageAlt: "",
    choices: [],
    ending: true
  },

  ending_communication_failure: {
    title: "Pabaiga 12 – Komunikacijos klaida",
    text: "Vairuotojas ir komanda neturėjo tos pačios informacijos. Dėl prastos komunikacijos kilo vėlavimas ir papildomas stresas.",
    image: "",
    imageAlt: "",
    choices: [],
    ending: true
  },

  ending_trust_lost: {
    title: "Pabaiga 13 – Prarastas kliento pasitikėjimas",
    text: "Klientui buvo pateikta netiksli informacija. Net jei krovinys pasiekia tikslą, pasitikėjimą atkurti tampa sunku.",
    image: "",
    imageAlt: "",
    choices: [],
    ending: true
  },

  ending_terminal_conflict: {
    title: "Pabaiga 14 – Konfliktas terminale",
    text: "Terminalo taisyklių nesilaikymas sukėlė konfliktą ir papildomą vėlavimą. Procesai reikalingi tam, kad terminale darbas vyktų saugiai ir tvarkingai.",
    image: "",
    imageAlt: "",
    choices: [],
    ending: true
  }
};

const titleElement = document.getElementById("scene-title");
const textElement = document.getElementById("scene-text");
const imageElement = document.getElementById("scene-image");
const imagePlaceholderElement = document.getElementById("image-placeholder");
const choicesElement = document.getElementById("choices");
const progressElement = document.getElementById("scene-progress");
const restartButton = document.getElementById("restart-btn");
const sceneOrder = Object.keys(scenes);

function renderChoices(choices) {
  choicesElement.innerHTML = "";

  choices.forEach((choice) => {
    const button = document.createElement("button");
    button.textContent = choice.text;

    button.addEventListener("click", () => {
      totalScore += choice.score || 0;

      if (choice.next === "final_result") {
        showFinalResult();
      } else {
        showScene(choice.next);
      }
    });

    choicesElement.appendChild(button);
  });
}

function showScene(sceneId) {
  const scene = scenes[sceneId];
  if (!scene) {
    titleElement.textContent = "Klaida";
    textElement.textContent = `Scena "${sceneId}" nerasta. Patikrink scenes objektą.`;
    imageElement.style.display = "none";
    imagePlaceholderElement.style.display = "block";
    choicesElement.innerHTML = "";
    progressElement.textContent = "Scena ? / ?";
    restartButton.style.display = "inline-block";
    return;
  }

  titleElement.textContent = scene.title;
  textElement.textContent = scene.text;
  const sceneIndex = sceneOrder.indexOf(sceneId);
  progressElement.textContent = `Scena ${sceneIndex + 1} / ${sceneOrder.length}`;

  if (scene.image) {
    imageElement.src = scene.image;
    imageElement.alt = scene.imageAlt || scene.title;
    imageElement.style.display = "block";
    imagePlaceholderElement.style.display = "none";
  } else {
    imageElement.style.display = "none";
    imageElement.removeAttribute("src");
    imageElement.alt = "";
    imagePlaceholderElement.style.display = "block";
  }

  renderChoices(scene.choices || []);
  restartButton.style.display = scene.ending ? "inline-block" : "none";
}

restartButton.addEventListener("click", () => {
  totalScore = 0;
  showScene(START_SCENE_ID);
});

function showFinalResult() {
  if (totalScore >= 18) {
    showScene("ending_excellent");
  } else if (totalScore >= 13) {
    showScene("ending_good");
  } else if (totalScore >= 8) {
    showScene("ending_risky");
  } else if (totalScore >= 4) {
    showScene("ending_delay");
  } else if (totalScore >= 0) {
    showScene("ending_costs");
  } else {
    showScene("ending_chaos");
  }
}

showScene(START_SCENE_ID);
