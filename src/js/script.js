const form = document.getElementById("form");
const result = document.getElementById("result");
const startRecordingButton = document.getElementById("startRecording");
const trash = document.getElementById("trash");
const inputField = form.elements[0];
const suggestionsList = document.getElementById("suggestions");
const openHistory = document.getElementById("open");
const history = JSON.parse(localStorage.getItem("history")) || [];

let isRecording = false;
let recognition;
let timeoutId;

window.addEventListener("load", () => {
  const isGitInHistory = history.some((item) =>
    item.consult.includes("fab fa-github")
  );
  const isLinkedinInHistory = history.some((item) =>
    item.consult.includes("fab fa-linkedin-in")
  );
  if (!isGitInHistory && !isLinkedinInHistory) {
    history.push({
      consult: '<i class="fab fa-github"></i>',
      newDate: getCurrentDate(),
    });
    history.push({
      consult: '<i class="fab fa-linkedin-in"></i>',
      newDate: getCurrentDate(),
    });
    localStorage.setItem("history", JSON.stringify(history));
  }
});

function getCurrentDate() {
  return `tavaresslc`;
}

if (history.length === 0) {
  const isGitInHistory = history.some((item) =>
    item.consult.includes("fab fa-github")
  );
  const isLinkedinInHistory = history.some((item) =>
    item.consult.includes("fab fa-linkedin-in")
  );
  if (!isGitInHistory && !isLinkedinInHistory) {
    history.push({
      consult: '<i class="fab fa-github"></i>',
      newDate: getCurrentDate(),
    });
    history.push({
      consult: '<i class="fab fa-linkedin-in"></i>',
      newDate: getCurrentDate(),
    });
    localStorage.setItem("history", JSON.stringify(history));
  }
} else {
  result.innerHTML = "";
}

openHistory.addEventListener("click", () => {
  if (result.style.display !== "flex") {
    result.style.display = "flex";
  } else {
    result.style.display = "none";
  }
});

function loadHistory() {
  const history = JSON.parse(localStorage.getItem("history")) || [];

  history.forEach((item) => {
    update(item);
    const suggestionItem = document.createElement("li");
    suggestionItem.innerHTML = item.consult;
    suggestionItem.addEventListener("click", (e) => {
      e.preventDefault();
      inputField.value = item.consult;
      const consult = inputField.value;
      if (consult !== "") {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const newDate = `${day}/${month}/${date.getFullYear()} ${date.getHours()}h${date.getMinutes()}min`;
        submitText(consult, newDate);
        const googleSearchURL = `https://www.google.com/search?q=${encodeURIComponent(
          consult
        )}`;
        window.location.href = googleSearchURL;
      }
    });
    suggestionsList.appendChild(suggestionItem);
  });
}

loadHistory();

trash.addEventListener("click", () => {
  localStorage.clear();
  inputField.value = "";
  location.reload();
});

startRecordingButton.addEventListener("click", () => {
  if (!isRecording) {
    startRecording();
    form.style.pointerEvents = "none";
    form.style.userSelect = "none";
  } else {
    stopRecording();
  }
});

function startRecording() {
  recognition = new webkitSpeechRecognition() || new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "pt-BR";
  inputField.value = "Ouvindo...";

  recognition.onstart = () => {
    isRecording = true;
  };

  recognition.onresult = (event) => {
    clearTimeout(timeoutId);
    const transcript = event.results[event.results.length - 1][0].transcript;
    inputField.value = transcript;
    timeoutId = setTimeout(stopRecording, 1000);
  };

  recognition.onerror = (event) => {
    console.error("Erro na gravação:", event.error);
  };

  recognition.onend = () => {
    isRecording = false;
  };

  recognition.start();
}

function stopRecording() {
  if (recognition) {
    recognition.stop();
  }
  form.style.pointerEvents = "auto";
  form.style.userSelect = "auto";

  setTimeout(() => {
    const consult = inputField.value;
    if (consult !== "") {
      const date = new Date();
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const newDate = `${day}/${month}/${date.getFullYear()} ${date.getHours()}h${date.getMinutes()}min`;
      submitText(consult, newDate);
    }
    const googleSearchURL = `https://www.google.com/search?q=${encodeURIComponent(
      consult
    )}`;
    window.location.href = googleSearchURL;
  }, 1000);
}

function sendAudioToWatson(audioData) {
  const apiKey = "API_KEY";
  const url = "API_URL";
  const formData = new FormData();
  formData.append("audio", audioData);

  fetch(url, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + apiKey,
    },
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      const transcript = data.results[0].alternatives[0].transcript;
      update({ consult: transcript });
    })
    .catch((error) => {
      console.error(
        "Erro ao se conectar com o IBM Watson Speech to Text:",
        error
      );
    });
}

function submitText(consult, newDate) {
  if (consult !== "") {
    const data = { consult, newDate };
    update(data);

    const history = JSON.parse(localStorage.getItem("history")) || [];
    history.push(data);
    localStorage.setItem("history", JSON.stringify(history));
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  inputField.blur();

  location.reload();

  const isGitInHistory = history.some((item) =>
    item.consult.includes("fab fa-github")
  );
  const isLinkedinInHistory = history.some((item) =>
    item.consult.includes("fab fa-linkedin-in")
  );
  if (!isGitInHistory && !isLinkedinInHistory) {
    history.push({
      consult: '<i class="fab fa-github"></i>',
      newDate: getCurrentDate(),
    });
    history.push({
      consult: '<i class="fab fa-linkedin-in"></i>',
      newDate: getCurrentDate(),
    });
    localStorage.setItem("history", JSON.stringify(history));
  }

  const consult = e.target.elements[0].value;
  if (consult !== "") {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    const newDate = `${day}/${month}/${date.getFullYear()} ${hours}h${min}min`;

    submitText(consult, newDate);

    const googleSearchURL = `https://www.google.com/search?q=${encodeURIComponent(
      consult
    )}`;
    window.location.href = googleSearchURL;
  }
});

function showLastHistoryItems() {
  suggestionsList.innerHTML = "";

  const history = JSON.parse(localStorage.getItem("history")) || [];
  const uniqueItems = new Set();

  for (let i = history.length - 1; i >= 0 && uniqueItems.size < 5; i--) {
    const item = history[i];
    const itemLowerCase = item.consult.toLowerCase();

    if (!uniqueItems.has(itemLowerCase)) {
      uniqueItems.add(itemLowerCase);

      const suggestionItem = document.createElement("li");

      const searchIcon = document.createElement("img");
      searchIcon.src = "./src/img/search.png";
      searchIcon.alt = "Ícone de pesquisa";
      searchIcon.classList.add("search2");

      suggestionItem.appendChild(searchIcon);
      const itemText = document.createElement("span");
      itemText.innerHTML = item.consult;
      suggestionItem.appendChild(itemText);

      suggestionItem.addEventListener("click", (e) => {
        e.preventDefault();
        inputField.value = item.consult;
        const consult = inputField.value;
        if (consult !== "") {
          const date = new Date();
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const newDate = `${day}/${month}/${date.getFullYear()} ${date.getHours()}h${date.getMinutes()}min`;
          submitText(consult, newDate);
          if (consult === '<i class="fab fa-github"></i>') {
            const googleSearchURL = `https://github.com/tavaresslc`;
            window.location.href = googleSearchURL;
            inputField.value = "github.com/tavaresslc";
          } else if (consult === '<i class="fab fa-linkedin-in"></i>') {
            const googleSearchURL = `https://www.linkedin.com/in/tavaresslc/`;
            window.location.href = googleSearchURL;
            inputField.value = "linkedin.com/in/tavaresslc/";
          } else {
            const googleSearchURL = `https://www.google.com/search?q=${encodeURIComponent(
              consult
            )}`;
            window.location.href = googleSearchURL;
          }
        }
      });

      suggestionsList.appendChild(suggestionItem);
    }
  }
}

inputField.addEventListener("input", () => {
  const inputValue = inputField.value.toLowerCase();
  suggestionsList.innerHTML = "";

  if (inputValue.trim() !== "") {
    const history = JSON.parse(localStorage.getItem("history")) || [];
    const uniqueSuggestions = new Set();

    let suggestionsAdd = 0;

    history.forEach((item) => {
      const itemLowerCase = item.consult.toLowerCase();
      if (
        itemLowerCase.includes(inputValue) &&
        !uniqueSuggestions.has(itemLowerCase) &&
        suggestionsAdd < 4
      ) {
        uniqueSuggestions.add(itemLowerCase);

        const suggestionItem = document.createElement("li");

        const searchIcon = document.createElement("img");
        searchIcon.src = "./src/img/search.png";
        searchIcon.alt = "Ícone de pesquisa";
        searchIcon.classList.add("search2");

        suggestionItem.appendChild(searchIcon);

        const itemText = document.createElement("span");
        itemText.innerHTML = item.consult;
        suggestionItem.appendChild(itemText);

        suggestionItem.addEventListener("click", (e) => {
          e.preventDefault();
          inputField.value = item.consult;
          const consult = inputField.value;
          if (consult !== "") {
            const date = new Date();
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const newDate = `${day}/${month}/${date.getFullYear()} ${date.getHours()}h${date.getMinutes()}min`;
            submitText(consult, newDate);
            if (consult === '<i class="fab fa-github"></i>') {
              const googleSearchURL = `https://github.com/tavaresslc`;
              window.location.href = googleSearchURL;
              inputField.value = "github.com/tavaresslc";
            } else if (consult === '<i class="fab fa-linkedin-in"></i>') {
              const googleSearchURL = `https://www.linkedin.com/in/tavaresslc/`;
              window.location.href = googleSearchURL;
              inputField.value = "linkedin.com/in/tavaresslc/";
            } else {
              const googleSearchURL = `https://www.google.com/search?q=${encodeURIComponent(
                consult
              )}`;
              window.location.href = googleSearchURL;
            }
          }
        });

        suggestionsList.appendChild(suggestionItem);
        suggestionsAdd++;
      }
    });

    const currentInputItem = document.createElement("li");
    currentInputItem.classList.add("currentInputItem");
    currentInputItem.innerHTML = `<img src="./src/img/search.png" alt="Ícone de pesquisa" class="search2"><span>${inputValue}<a> - Pesquisa do Google</a></span>`;
    suggestionsList.insertBefore(currentInputItem, suggestionsList.firstChild);
    currentInputItem.addEventListener("click", (e) => {
      e.preventDefault();
      const consult = inputField.value;
      if (consult !== "") {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const newDate = `${day}/${month}/${date.getFullYear()} ${date.getHours()}h${date.getMinutes()}min`;
        submitText(consult, newDate);

        const googleSearchURL = `https://www.google.com/search?q=${encodeURIComponent(
          consult
        )}`;
        window.location.href = googleSearchURL;
      }
    });
  } else {
    showLastHistoryItems();
  }
});

inputField.addEventListener("focus", () => {
  if (history.length === 0) {
    inputField.style.borderRadius = "50px";
    suggestionsList.style.display = "none";
  } else {
    inputField.style.borderRadius = "24px 24px 0 0";
    suggestionsList.style.display = "flex";
  }

  const inputValue = inputField.value.trim();
  if (inputValue === "") {
    showLastHistoryItems();
  }
});

inputField.addEventListener("blur", () => {
  setTimeout(() => {
    inputField.style.borderRadius = "50px";
    suggestionsList.style.display = "none";
  }, 150);
});

function update(msg) {
  const res = document.getElementById("result");
  if (res.innerHTML === `<p>Nenhum histórico encontrado</p>`) {
    res.innerHTML = "";
  }

  res.innerHTML += `<p><b>${msg.consult}</b> - ${msg.newDate}</p>`;

  const suggestionItem = document.createElement("li");
  suggestionItem.innerHTML = msg.consult;

  suggestionItem.addEventListener("click", (e) => {
    e.preventDefault();
    if (msg.consult === '<i class="fab fa-github"></i>') {
      window.location.href = "https://github.com/tavaresslc";
      inputField.value = "github.com/tavaresslc";
    } else if (msg.consult === '<i class="fab fa-linkedin-in"></i>') {
      window.location.href = "https://www.linkedin.com/in/tavaresslc/";
      inputField.value = "linkedin.com/in/tavaresslc/";
    } else {
      inputField.value = msg.consult;
      const consult = inputField.value;
      if (consult !== "") {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const newDate = `${day}/${month}/${date.getFullYear()} ${date.getHours()}h${date.getMinutes()}min`;
        submitText(consult, newDate);

        const googleSearchURL = `https://www.google.com/search?q=${encodeURIComponent(
          consult
        )}`;
        window.location.href = googleSearchURL;
      }
    }
  });
  suggestionsList.appendChild(suggestionItem);
  inputField.style.borderRadius = "50px";
  suggestionsList.style.display = "none";
}

suggestionsList.innerHTML = "";
