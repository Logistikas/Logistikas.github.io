const scenes = {
  start: {
    title: "Žaidimo pradžia",
    text: "Pradėjote dirbti X įmonėje. Tai jūsų pirmoji darbo diena.",
    image: "",
    choices: [
      {
        text: "Pradėti žaidimą",
        next: "first_day"
      }
    ]
  },

  first_day: {
    title: "Pirmoji darbo diena",
    text: "Atėjote prie savo transporto priemonės. Ką darote?",
    image: "",
    choices: [
      {
        text: "Apžiūrėti transporto priemonę",
        next: "inspect_vehicle"
      },
      {
        text: "Iš karto važiuoti",
        next: "drive_now"
      },
      {
        text: "Paskambinti vadovui",
        next: "call_manager"
      }
    ]
  },

  inspect_vehicle: {
    title: "Transporto priemonės apžiūra",
    text: "Pastebite, kad viena padanga atrodo šiek tiek nuleista. Ką darote?",
    image: "",
    choices: [
      {
        text: "Pranešti vadovui",
        next: "good_choice"
      },
      {
        text: "Ignoruoti problemą",
        next: "bad_choice"
      },
      {
        text: "Ieškoti atsarginės padangos",
        next: "neutral_choice"
      }
    ]
  },

  drive_now: {
    title: "Kelionės pradžia",
    text: "Pradedate važiuoti, bet netrukus pajuntate, kad transporto priemonė juda nestabiliai.",
    image: "",
    choices: [
      {
        text: "Sustoti šalikelėje",
        next: "good_choice"
      },
      {
        text: "Važiuoti toliau",
        next: "bad_choice"
      },
      {
        text: "Sumažinti greitį",
        next: "neutral_choice"
      }
    ]
  },

  call_manager: {
    title: "Skambutis vadovui",
    text: "Vadovas pasako, kad pirmiausia turėtumėte atlikti transporto priemonės patikrą.",
    image: "",
    choices: [
      {
        text: "Atlikti patikrą",
        next: "inspect_vehicle"
      },
      {
        text: "Nepaisyti patarimo",
        next: "drive_now"
      }
    ]
  },

  good_choice: {
    title: "Geras sprendimas",
    text: "Jūs priėmėte atsakingą sprendimą. Darbo diena prasideda sėkmingai.",
    image: "",
    choices: [
      {
        text: "Žaisti iš naujo",
        next: "start"
      }
    ]
  },

  neutral_choice: {
    title: "Neutralus sprendimas",
    text: "Situacija išsisprendžia, bet prarandate šiek tiek laiko.",
    image: "",
    choices: [
      {
        text: "Žaisti iš naujo",
        next: "start"
      }
    ]
  },

  bad_choice: {
    title: "Blogas sprendimas",
    text: "Sprendimas sukėlė problemų. Kitą kartą reikės būti atsargesniam.",
    image: "",
    choices: [
      {
        text: "Žaisti iš naujo",
        next: "start"
      }
    ]
  }
};

const titleElement = document.getElementById("scene-title");
const textElement = document.getElementById("scene-text");
const imageElement = document.getElementById("scene-image");
const choicesElement = document.getElementById("choices");
const restartButton = document.getElementById("restart-btn");

function showScene(sceneId) {
  const scene = scenes[sceneId];

  titleElement.textContent = scene.title;
  textElement.textContent = scene.text;

  choicesElement.innerHTML = "";

  if (scene.image) {
    imageElement.src = scene.image;
    imageElement.style.display = "block";
  } else {
    imageElement.style.display = "none";
  }

  scene.choices.forEach(choice => {
    const button = document.createElement("button");
    button.textContent = choice.text;

    button.addEventListener("click", () => {
      showScene(choice.next);
    });

    choicesElement.appendChild(button);
  });
}

restartButton.addEventListener("click", () => {
  showScene("start");
});

showScene("start");
