const START_SCENE_ID = "start";
let totalScore = 0;

// Tai prototipo struktura, kuria galesi pildyti savu scenarijumi.
const scenes = {
  start: {
    title: "Žaidimo pradžia",
    text: "Pradedate darbą logistikos įmonėje. Jūsų užduotis – užtikrinti, kad krovinys būtų pristatytas laiku, saugiai ir kuo mažesniais kaštais.",
    image: "assets/images/uzsakymas.png",
    imageAlt: "Logistikos įmonės aplinka",
    choices: [
      { text: "Pradėti žaidimą", next: "order_received", score: 0 }
    ]
  },

  order_received: {
    title: "1. Užsakymo gavimas",
    text: "Klientas pateikia skubų užsakymą. Krovinys turi būti pristatytas iki 16:00. Ką darote pirmiausia?",
    image: "assets/images/uzsakymas.png",
    imageAlt: "Logistikos užsakymo gavimas",
    choices: [
      { text: "Patvirtinti užsakymą ir iš karto pradėti transporto planavimą – kiekvienа minutė svarbi", next: "early_client_problem", score: -1 },
      { text: "Patikrinti terminus, krovinio reikalavimus ir specifikacijas prieš tvirtinant", next: "cargo_check", score: 2 },
      { text: "Perduoti užsakymą logistikos koordinatoriui ir grįžti prie kitų darbų", next: "early_client_problem", score: -2 }
    ]
  },

  early_client_problem: {
    title: "Detalės neaiškios",
    text: "Pradėtas planavimas, tačiau komanda nesutaria dėl krovinio svorio ir maršruto apribojimų – tikslūs duomenys nebuvo patikrinti iš anksto.",
    image: "assets/images/nepatenkintas_klientas.png",
    imageAlt: "Neaiški situacija",
    choices: [
      { text: "Skubiai susisiekti su klientu ir patikslinti trūkstamas detales", next: "cargo_check", score: 1 },
      { text: "Tęsti planavimą su turimais duomenimis – vėliau patikslinsime", next: "cargo_check", score: -1 },
      { text: "Spausti komandą vykdyti planą, nes terminas artėja", next: "ending_pressure_mistake", score: -3 }
    ]
  },

  cargo_check: {
    title: "2. Krovinio informacijos tikrinimas",
    text: "Prieš planuojant transportą reikia įvertinti krovinį. Ką darote?",
    image: "assets/images/krovinio_patikra.png",
    imageAlt: "Krovinio informacijos tikrinimas",
    choices: [
      { text: "Patikrinti svorį ir matmenis – to pakanka transporto parinkimui", next: "wrong_vehicle_risk", score: -1 },
      { text: "Paprašyti vairuotojo apžiūrėti krovinį ir pranešti, ar viskas atrodo gerai", next: "wrong_vehicle_risk", score: -2 },
      { text: "Patikrinti svorį, matmenis, specialius reikalavimus ir dokumentų atitikimą", next: "route_choice", score: 2 }
    ]
  },

  wrong_vehicle_risk: {
    title: "Krovinio patikra nepilna",
    text: "Pasirinktas transportas gali netikti: nebuvo įvertinti specialūs krovinio reikalavimai. Padėtis tampa rizikinga.",
    image: "assets/images/krovinio_patikra.png",
    imageAlt: "Netinkamo transporto rizika",
    choices: [
      { text: "Grįžti ir atlikti pilną krovinio tikrinimą su dokumentais", next: "route_choice", score: 1 },
      { text: "Rinktis didesnį transportą – visada geriau turėti atsargos", next: "vehicle_choice", score: -1 },
      { text: "Išsiųsti transportą ir tikėtis, kad krovinys telps", next: "ending_document_error", score: -3 }
    ]
  },

  route_choice: {
    title: "3. Maršruto pasirinkimas",
    text: "Aistė planuoja maršrutą. Reikia pasirinkti kelią, kuris atitiktų laiką, saugumą ir kliento reikalavimus.",
    image: "assets/images/marsruto_planavimas.png",
    imageAlt: "Maršruto planavimas",
    choices: [
      { text: "Patikrinti eismo sąlygas, kelių apribojimus sunkiajam transportui ir kliento laiko langą", next: "backup_route", score: 2 },
      { text: "Rinktis greičiausią maršrutą – klientas reikalauja pristatymo iki 16:00", next: "gps_problem", score: -1 },
      { text: "Pasirinkti optimalų maršrutą pagal kuro sąnaudas ir preliminarų laiką", next: "backup_route", score: 0 }
    ]
  },

  gps_problem: {
    title: "GPS parinko netinkamą kelią",
    text: "Navigacija parinko trumpą kelią, bet jame yra tonažo apribojimų sunkiajam transportui. Vairuotojas to nežinojo.",
    image: "assets/images/gps_navigacija.png",
    imageAlt: "GPS navigacijos problema",
    choices: [
      { text: "Nedelsiant sustabdyti ir ieškoti alternatyvaus, patikrinto maršruto", next: "backup_route", score: 1 },
      { text: "Bandyti rasti apvažiavimą pagal GPS – ji dažniausiai perskaičiuoja", next: "road_problem", score: -1 },
      { text: "Tęsti – kontrolieriai dažniausiai nekreipia dėmesio į sunkvežimius", next: "ending_route_failure", score: -3 }
    ]
  },

  backup_route: {
    title: "4. Atsarginis maršrutas",
    text: "Pagrindiniame kelyje gali susidaryti spūstys dėl remonto darbų. Ką darote?",
    image: "assets/images/atsarginis_marsrutas.png",
    imageAlt: "Atsarginio maršruto planavimas",
    choices: [
      { text: "Atsarginis maršrutas nereikalingas – pagrindinis yra patikrintas ir optimalus", next: "road_problem", score: -2 },
      { text: "Paruošti du alternatyvius maršrutus ir pažymėti saugias sustojimo vietas", next: "data_analysis", score: 2 },
      { text: "Atsarginio maršruto kryptį nurodyti vairuotojui žodžiu pakeliui, jei prireiks", next: "data_analysis", score: -1 }
    ]
  },

  data_analysis: {
    title: "5. Duomenų analizė",
    text: "Rūta analizuoja duomenis. Reikia nuspręsti, kokia informacija remtis planuojant pristatymo laiką.",
    image: "assets/images/duomenu_analize.png",
    imageAlt: "Duomenų analizė logistikoje",
    choices: [
      { text: "Remtis šios dienos realaus laiko duomenimis – istoriniai gali būti pasenę", next: "bad_prediction", score: -1 },
      { text: "Prognozuoti pagal komandos patirtį ir šios savaitės stebėjimus", next: "bad_prediction", score: -2 },
      { text: "Derinti istorinius eismo duomenis su šiandieniniais ir įvertinti sezoninius vėlavimus", next: "weather_check", score: 2 }
    ]
  },

  bad_prediction: {
    title: "Prognozė netiksli",
    text: "Duomenys buvo nepilni. Paaiškėja, kad šiame maršrute ketvirtadieniais dažnai spūstys ties terminalo įvažiavimu.",
    image: "assets/images/duomenu_analize.png",
    imageAlt: "Netiksli prognozė",
    choices: [
      { text: "Perskaičiuoti ETA pagal istorinius duomenis ir iš anksto perspėti klientą", next: "weather_check", score: 1 },
      { text: "Palaukti ir matyti – gal šiandien spūsčių nebus", next: "weather_check", score: -1 },
      { text: "Nieko nekeisti – planas jau patvirtintas", next: "ending_data_failure", score: -3 }
    ]
  },

  weather_check: {
    title: "6. Orų ir kelio sąlygų patikra",
    text: "Dalyje maršruto galimas stiprus lietus. Tai gali paveikti saugumą ir pristatymo laiką.",
    image: "assets/images/oru_prognoze.png",
    imageAlt: "Orų prognozė",
    choices: [
      { text: "Patikrinti orų prognozę ir kelio sąlygas, atnaujinti ETA ir informuoti vairuotoją", next: "vehicle_choice", score: 2 },
      { text: "Vairuotojas yra patyręs – jis pats spręs, kaip važiuoti blogame ore", next: "safety_risk", score: -2 },
      { text: "Tik perspėti vairuotoją, kad galimas lietus, ir rekomenduoti atsargumą", next: "vehicle_choice", score: 0 }
    ]
  },

  safety_risk: {
    title: "Saugumo rizika kelyje",
    text: "Prasidėjo stiprus lietus. Vairuotojas praneša, kad matomumas prastas, o kelias slidus. Skambina ir prašo nurodymų.",
    image: "assets/images/lietus_kelias.png",
    imageAlt: "Pavojingos kelio sąlygos",
    choices: [
      { text: "Leisti sulėtinti tempą, atnaujinti ETA ir informuoti klientą apie galimą vėlavimą", next: "vehicle_choice", score: 1 },
      { text: "Pasakyti, kad sprendimas vairuotojo – jis pats mato situaciją", next: "road_problem", score: -1 },
      { text: "Priminti apie terminą – jei vėluos, klientas bus nepatenkintas", next: "ending_safety_incident", score: -3 }
    ]
  },

  vehicle_choice: {
    title: "7. Transporto priemonės pasirinkimas",
    text: "Reikia nuspręsti, kokią transporto priemonę skirti šiam užsakymui.",
    image: "assets/images/transporto_pasirinkimas.png",
    imageAlt: "Transporto priemonės pasirinkimas",
    choices: [
      { text: "Parinkti ekonomiškiausią transportą, tinkamą tokio svorio kroviniui", next: "wrong_truck_problem", score: -1 },
      { text: "Parinkti transportą pagal krovinio dydį, svorį, specialius reikalavimus ir maršruto ypatumus", next: "vehicle_inspection", score: 2 },
      { text: "Naudoti artimiausią laisvą sunkvežimį – laikas bėga", next: "wrong_truck_problem", score: -2 }
    ]
  },

  wrong_truck_problem: {
    title: "Pasirinktas netinkamas transportas",
    text: "Paaiškėja, kad pasirinktas transportas neatitinka visų reikalavimų: maršruto apribojimai arba specialios krovinio sąlygos nebuvo įvertintos.",
    image: "assets/images/transporto_pasirinkimas.png",
    imageAlt: "Netinkamas sunkvežimis",
    choices: [
      { text: "Pakeisti transportą į tinkamesnį, net jei tai atims laiko", next: "vehicle_inspection", score: 1 },
      { text: "Palikti tą patį transportą – geriau pavėluoti nei gaišti keičiant", next: "vehicle_inspection", score: -1 },
      { text: "Išvažiuoti tuoj pat ir spręsti problemas kelyje", next: "ending_costs", score: -3 }
    ]
  },

  vehicle_inspection: {
    title: "8. Transporto priemonės patikra",
    text: "Tomas tikrina transporto priemonę prieš išvykimą. Techninė tarnyba ją tikrino prieš savaitę.",
    image: "assets/images/vairuotojas_patikra.png",
    imageAlt: "Vairuotojas tikrina transporto priemonę",
    choices: [
      { text: "Atlikti standartinę patikrą pagal čeklistą ir patikrinti transportavimo dokumentus", next: "driver_briefing", score: 2 },
      { text: "Greitai apžiūrėti akimis – techninė tarnyba viską tikrino prieš savaitę", next: "tire_problem", score: -2 },
      { text: "Patikrinti dokumentus, bet techninę dalį praleisti – skubame", next: "tire_problem", score: -1 }
    ]
  },

  tire_problem: {
    title: "Problema kelyje",
    text: "Po 40 km vairuotojas pajunta nestabilumą. Stabdžiai reaguoja lėčiau nei įprastai – praleista patikra neaptiko susidėvėjimo.",
    image: "assets/images/lietus_kelias.png",
    imageAlt: "Problema kelyje",
    choices: [
      { text: "Saugiai sustoti artimiausiai aikštelėje, pranešti vadovui ir įvertinti situaciją", next: "driver_briefing", score: 1 },
      { text: "Sumažinti greitį ir važiuoti toliau – iki tikslo nedaug liko", next: "road_problem", score: -1 },
      { text: "Ignoruoti – gali būti tiesiog blogas kelias", next: "ending_safety_incident", score: -3 }
    ]
  },

  driver_briefing: {
    title: "9. Vairuotojo instruktažas",
    text: "Prieš išvykimą vairuotojui reikia perduoti svarbią informaciją. Laikas ribotas.",
    image: "assets/images/instruktazas.png",
    imageAlt: "Vairuotojo instruktažas",
    choices: [
      { text: "Išsiųsti detalų maršrutą su GPS koordinatėmis – vairuotojas susigaudys pats", next: "communication_problem", score: -1 },
      { text: "Aptarti maršrutą, ETA, rizikos vietas ir susitarti dėl kontakto problemų atveju", next: "road_problem", score: 2 },
      { text: "Trumpai aptarti maršrutą ir pabrėžti, kad svarbu atvykti iki 16:00", next: "communication_problem", score: -2 }
    ]
  },

  communication_problem: {
    title: "Komunikacijos spragos",
    text: "Vairuotojas kelyje susiduria su nenumatytu ženklu ir nežino, ar tai liečia jo krovinį. Skambina – bet informacija nebuvo aptarta.",
    image: "assets/images/telefonas_kelias.png",
    imageAlt: "Komunikacijos klaida",
    choices: [
      { text: "Greitai surasti atsakymą ir perduoti tikslias instrukcijas vairuotojui", next: "road_problem", score: 1 },
      { text: "Pasakyti, kad sprendžia pats pagal savo patirtį", next: "road_problem", score: -1 },
      { text: "Prašyti palaukti – esate susitikime ir negalite atsakyti iš karto", next: "ending_communication_failure", score: -3 }
    ]
  },

  road_problem: {
    title: "10. Netikėta situacija kelyje",
    text: "Kelyje įvyksta avarija, kelias užblokuotas. Apytikslis vėlavimas – 45–60 minučių. Terminas 16:00 gali būti praleistas.",
    image: "assets/images/avarija_kelias.png",
    imageAlt: "Netikėta situacija kelyje",
    choices: [
      { text: "Pirma surasti alternatyvų kelią, tik tada informuoti klientą – geriau turėti sprendimą", next: "client_update_problem", score: -1 },
      { text: "Nedelsiant informuoti klientą apie situaciją, atnaujinti ETA ir pradėti ieškoti apvažiavimo", next: "detour_choice", score: 2 },
      { text: "Palaukti 15–20 min – daugelis avarijų greitai išvaloma", next: "client_update_problem", score: -2 }
    ]
  },

  client_update_problem: {
    title: "Klientas neinformuotas laiku",
    text: "Klientas pats skambina – jis stebi GPS sekimą ir mato, kad krovinys stovi vietoje jau 30 minučių.",
    image: "assets/images/nepatenkintas_klientas.png",
    imageAlt: "Nepatenkintas klientas",
    choices: [
      { text: "Atsiprašyti, paaiškinti situaciją ir pateikti realų atnaujintą ETA", next: "detour_choice", score: 1 },
      { text: "Pasakyti, kad situacija aktyviai sprendžiama ir netrukus bus atnaujinimas", next: "detour_choice", score: 0 },
      { text: "Pasakyti, kad vėlavimas mažas ir krovinys atvyks beveik laiku", next: "ending_trust_lost", score: -3 }
    ]
  },

  detour_choice: {
    title: "11. Sprendimas dėl apvažiavimo",
    text: "Reikia rinktis apvažiavimą. GPS siūlo du kelius: vienas trumpesnis, bet nepatikrintas sunkiajam transportui, kitas ilgesnis, bet žinomas.",
    image: "assets/images/apvaziavimas.png",
    imageAlt: "Apvažiavimo pasirinkimas",
    choices: [
      { text: "Rinktis trumpesnį GPS siūlomą kelią – sutaupysime 15 min", next: "detour_failure", score: -2 },
      { text: "Pasirinkti iš anksto parengtą atsarginį maršrutą, nors jis ilgesnis", next: "terminal_arrival", score: 2 },
      { text: "Susisiekti su Aiste biure ir prašyti realiu laiku patikrinti abu kelius", next: "terminal_arrival", score: 1 }
    ]
  },

  detour_failure: {
    title: "Apvažiavimas nepavyko",
    text: "Nepatikrintame kelyje – žemas tiltas. Sunkvežimis negali pravažiuoti. Prarandama dar 25 minutės grįžtant.",
    image: "assets/images/tiltas_problema.png",
    imageAlt: "Nepavykęs apvažiavimas",
    choices: [
      { text: "Grįžti ir rinktis patikrintą ilgesnį maršrutą", next: "terminal_arrival", score: 0 },
      { text: "Ieškoti dar kito nepatikrinto kelio – gal šis bus tinkamas", next: "ending_route_failure", score: -3 },
      { text: "Grįžti ir nedelsiant informuoti klientą apie papildomą vėlavimą", next: "terminal_arrival", score: 1 }
    ]
  },

  terminal_arrival: {
    title: "12. Atvykimas į terminalą",
    text: "Tomas atvyksta į terminalą. Jis skuba, nes vėluoja. Kaip pradeda atvykimo procesą?",
    image: "assets/images/terminalas.png",
    imageAlt: "Atvykimas į terminalą",
    choices: [
      { text: "Užsiregistruoti prie vartų, pateikti dokumentus ir patvirtinti rampą pagal tvarką", next: "document_check", score: 2 },
      { text: "Pranešti biurui apie atvykimą ir laukti tolesnių instrukcijų iš vadybininko", next: "terminal_conflict", score: -1 },
      { text: "Važiuoti prie pirmos laisvos rampos – registracija gali palaukti", next: "terminal_conflict", score: -2 }
    ]
  },

  terminal_conflict: {
    title: "Terminalo taisyklių pažeidimas",
    text: "Terminalo darbuotojai sustabdo transportą. Registracija nebuvo atlikta pagal tvarką – kiti sunkvežimiai eilėje.",
    image: "assets/images/terminalas.png",
    imageAlt: "Problema terminale",
    choices: [
      { text: "Atsiprašyti ir nedelsiant atlikti registraciją pagal nustatytą tvarką", next: "document_check", score: 0 },
      { text: "Paaiškinti, kad vėluojame, ir prašyti išimties – klientas laukia", next: "ending_terminal_conflict", score: -3 },
      { text: "Skambinti vadybininkui, kad jis susisiektų su terminalu ir pagreitintų procesą", next: "document_check", score: 1 }
    ]
  },

  document_check: {
    title: "13. Dokumentų neatitikimas",
    text: "Terminale pastebima, kad važtaraštyje nurodytas netikslus krovinio kiekis. Skirtumas – 50 kg.",
    image: "assets/images/dokumentai.png",
    imageAlt: "Dokumentų tikrinimas",
    choices: [
      { text: "Ištaisyti neatitikimą rankraščiu ir tęsti – biurą informuosime vėliau, skubame", next: "ending_document_error", score: -2 },
      { text: "Sustabdyti iškrovimą, susisiekti su biuru ir ištaisyti dokumentą oficialiai", next: "final_result", score: 2 },
      { text: "Pranešti klientui apie neatitikimą ir prašyti jo patvirtinti tęsti iškrovimą", next: "ending_document_error", score: -1 }
    ]
  },

  ending_excellent: {
    title: "Pabaiga 1 – Puiki logistika",
    text: "Krovinys pristatytas laiku. Klientas patenkintas, komanda dirbo koordinuotai, sprendimai buvo paremti duomenimis ir aiškia komunikacija.",
    image: "assets/images/pabaiga_gera.png",
    imageAlt: "Sėkmingas pristatymas",
    choices: [],
    ending: true
  },

  ending_good: {
    title: "Pabaiga 2 – Pristatyta sėkmingai",
    text: "Krovinys pristatytas. Buvo keli smulkūs netikslumai, bet komanda laiku sureagavo ir išlaikė gerą rezultatą.",
    image: "assets/images/pabaiga_gera.png",
    imageAlt: "Sėkmingas pristatymas",
    choices: [],
    ending: true
  },

  ending_risky: {
    title: "Pabaiga 3 – Pristatyta, bet buvo rizikų",
    text: "Krovinys pasiekė klientą, tačiau kai kurie sprendimai buvo rizikingi. Procesą reikėtų pagerinti, kad tokios situacijos nesikartotų.",
    image: "assets/images/pabaiga_bloga.png",
    imageAlt: "Rizikinga situacija",
    choices: [],
    ending: true
  },

  ending_delay: {
    title: "Pabaiga 4 – Vėlavimas",
    text: "Krovinys pristatytas pavėluotai. Pagrindinės priežastys – nepakankamas planavimas, vėlyva komunikacija ir netikslus rizikų vertinimas.",
    image: "assets/images/pabaiga_bloga.png",
    imageAlt: "Vėlavimas",
    choices: [],
    ending: true
  },

  ending_costs: {
    title: "Pabaiga 5 – Papildomi kaštai",
    text: "Krovinys pristatytas, bet dėl netinkamų sprendimų išaugo kaštai: reikėjo keisti maršrutą, spręsti terminalo problemas arba taisyti dokumentus.",
    image: "assets/images/pabaiga_bloga.png",
    imageAlt: "Papildomi kaštai",
    choices: [],
    ending: true
  },

  ending_chaos: {
    title: "Pabaiga 6 – Logistikos chaosas",
    text: "Sprendimų grandinė buvo nesėkminga: vėlavo krovinys, klientas buvo nepatenkintas, o komanda turėjo taisyti kelias problemas vienu metu.",
    image: "assets/images/pabaiga_bloga.png",
    imageAlt: "Logistikos chaosas",
    choices: [],
    ending: true
  },

  ending_pressure_mistake: {
    title: "Pabaiga 7 – Per didelis spaudimas komandai",
    text: "Komanda buvo spaudžiama vykdyti pažadą, kuris nebuvo pagrįstas realiais duomenimis. Tai sukėlė klaidų ir prastą kliento patirtį.",
    image: "assets/images/pabaiga_bloga.png",
    imageAlt: "Spaudimas komandai",
    choices: [],
    ending: true
  },

  ending_document_error: {
    title: "Pabaiga 8 – Dokumentų klaida",
    text: "Dokumentų neatitikimai sukėlė problemų terminale. Krovinio procesas sustojo, o klientas liko nepatenkintas dėl netvarkingos dokumentacijos.",
    image: "assets/images/dokumentai.png",
    imageAlt: "Dokumentų klaida",
    choices: [],
    ending: true
  },

  ending_route_failure: {
    title: "Pabaiga 9 – Maršruto nesėkmė",
    text: "Netinkamai pasirinktas arba nepatikrintas maršrutas sukėlė didelį vėlavimą. Krovinys nebuvo pristatytas pagal planą.",
    image: "assets/images/tiltas_problema.png",
    imageAlt: "Maršruto nesėkmė",
    choices: [],
    ending: true
  },

  ending_data_failure: {
    title: "Pabaiga 10 – Bloga prognozė",
    text: "Sprendimai buvo priimti pagal intuiciją, o ne pagal duomenis. Dėl to komanda nepasiruošė rizikoms ir prarado laiką.",
    image: "assets/images/duomenu_analize.png",
    imageAlt: "Bloga prognozė",
    choices: [],
    ending: true
  },

  ending_safety_incident: {
    title: "Pabaiga 11 – Saugumo incidentas",
    text: "Saugumo rizikos buvo ignoruojamos. Transporto priemonė turėjo sustoti, o pristatymas buvo sutrikdytas. Logistikoje saugumas visada turi būti prioritetas.",
    image: "assets/images/lietus_kelias.png",
    imageAlt: "Saugumo incidentas",
    choices: [],
    ending: true
  },

  ending_communication_failure: {
    title: "Pabaiga 12 – Komunikacijos klaida",
    text: "Vairuotojas ir komanda neturėjo tos pačios informacijos. Dėl prastos komunikacijos kilo vėlavimas ir papildomas stresas.",
    image: "assets/images/telefonas_kelias.png",
    imageAlt: "Komunikacijos klaida",
    choices: [],
    ending: true
  },

  ending_trust_lost: {
    title: "Pabaiga 13 – Prarastas kliento pasitikėjimas",
    text: "Klientui buvo pateikta netiksli informacija. Net jei krovinys pasiekia tikslą, pasitikėjimą atkurti tampa sunku.",
    image: "assets/images/nepatenkintas_klientas.png",
    imageAlt: "Prarastas pasitikėjimas",
    choices: [],
    ending: true
  },

  ending_terminal_conflict: {
    title: "Pabaiga 14 – Konfliktas terminale",
    text: "Terminalo taisyklių nesilaikymas sukėlė konfliktą ir papildomą vėlavimą. Procesai reikalingi tam, kad terminale darbas vyktų saugiai ir tvarkingai.",
    image: "assets/images/terminalas.png",
    imageAlt: "Konfliktas terminale",
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
