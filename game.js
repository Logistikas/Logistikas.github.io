const START_SCENE_ID = "start";

// Tai prototipo struktura, kuria galesi pildyti savu scenarijumi.
const scenes = {
  start: {
    title: "Žaidimo pradžia",
    text: "Pradėjote dirbti X įmonėje. Tai jūsų pirmoji darbo diena.",
    image: "assets/images/projects-Girteka.jpg",
    imageAlt: "Logistikos įmonės aplinka",
    choices: [{ text: "Pradėti žaidimą", next: "first_day" }]
  },

  first_day: {
    title: "Pirmoji darbo diena",
    text: "Atėjote prie savo transporto priemonės. Ką darote?",
    image: "assets/images/GIRTEKA-HR-2545-scaled-1.jpg",
    imageAlt: "Sunkvežimis prieš kelionę",
    choices: [
      { text: "Apžiūrėti transporto priemonę", next: "inspect_vehicle" },
      { text: "Iš karto važiuoti", next: "drive_now" },
      { text: "Paskambinti vadovui", next: "call_manager" }
    ]
  },

  inspect_vehicle: {
    title: "Transporto priemonės apžiūra",
    text: "Pastebite, kad viena padanga atrodo šiek tiek nuleista. Ką darote?",
    image: "assets/images/vairuotojas.jpeg",
    imageAlt: "Vairuotojas atlieka patikrą",
    choices: [
      { text: "Pranešti vadovui", next: "good_ending" },
      { text: "Ignoruoti problemą", next: "bad_ending" },
      { text: "Ieškoti atsarginės padangos", next: "neutral_ending" }
    ]
  },

  drive_now: {
    title: "Kelionės pradžia",
    text: "Pradedate važiuoti, bet netrukus pajuntate, kad transporto priemonė juda nestabiliai.",
    image: "assets/images/GIRTEKA-Volvo-Electric-1266-scaled-1.jpg",
    imageAlt: "Sunkvežimis kelyje",
    choices: [
      { text: "Sustoti šalikelėje", next: "good_ending" },
      { text: "Važiuoti toliau", next: "bad_ending" },
      { text: "Sumažinti greitį", next: "neutral_ending" }
    ]
  },

  call_manager: {
    title: "Skambutis vadovui",
    text: "Vadovas pasako, kad pirmiausia turėtumėte atlikti transporto priemonės patikrą.",
    image: "assets/images/vairuotojas.jpeg",
    imageAlt: "Skambutis vadovui dėl transporto",
    choices: [
      { text: "Atlikti patikrą", next: "inspect_vehicle" },
      { text: "Nepaisyti patarimo", next: "drive_now" }
    ]
  },

  good_ending: {
    title: "Geras sprendimas",
    text: "Priėmėte atsakingą sprendimą. Darbo diena prasideda sėkmingai.",
    image: "",
    imageAlt: "",
    choices: [],
    ending: true
  },

  neutral_ending: {
    title: "Neutralus sprendimas",
    text: "Situacija išsisprendžia, bet prarandate šiek tiek laiko.",
    image: "",
    imageAlt: "",
    choices: [],
    ending: true
  },

  bad_ending: {
    title: "Blogas sprendimas",
    text: "Sprendimas sukėlė problemų. Kitą kartą reikės būti atsargesniam.",
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
    button.addEventListener("click", () => showScene(choice.next));
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
  showScene(START_SCENE_ID);
});

showScene(START_SCENE_ID);
