const _elements = {
  themeSwitch: document.getElementById("theme-switch"),
  hamburguerMenu: document.querySelector(".mobile-nav-list"),
  sideBar: document.querySelector(".side-bar"),
  yearSelectToggle: document.querySelector(".year-select-toggle"),
  selectToggleIcon: document.querySelector(".year-select-toggle__icon"),
  yearSelectToggleSelected: document.querySelector(
    ".year-select-toggle__selected-year"
  ),
  yearSelectList: document.querySelector(".year-select-list"),
  selectOptions: document.querySelectorAll(".year-select-list__item"),
};

const driversData = [];

const teamsData = [
  {
    name: String,
    position: Number,
    points: Number,
  },
];

let darkmode = localStorage.getItem("darkmode");

const enableDarkmode = () => {
  document.body.classList.add("darkmode");
  document.documentElement.setAttribute("data-theme", "dark");
  localStorage.setItem("darkmode", "true");
};

if (darkmode === "true") enableDarkmode();

const disableDarkmode = () => {
  document.body.classList.remove("darkmode");
  document.documentElement.setAttribute("data-theme", "light");
  localStorage.setItem("darkmode", "false");
};

_elements.themeSwitch.addEventListener("click", () => {
  darkmode = localStorage.getItem("darkmode");
  darkmode !== "true" ? enableDarkmode() : disableDarkmode();
});

_elements.hamburguerMenu.addEventListener("click", () => {
  _elements.sideBar.classList.toggle("show");
});

_elements.yearSelectToggle.addEventListener("click", () => {
  _elements.selectToggleIcon.classList.toggle(
    "year-select-toggle__selected-year--rotate"
  );
  _elements.yearSelectList.classList.toggle("year-select-list--show");
});

_elements.selectOptions.forEach((item) => {
  item.addEventListener("click", () => {
    _elements.yearSelectToggleSelected.innerText = item.innerText;
    _elements.yearSelectToggle.dispatchEvent(new Event("click"));
  });
});

const dataRequest = async () => {
  try {
    const url = `https://api.jolpi.ca/ergast/f1/2025/last/results/`;
    const response = await fetch(url);
    const jsonResponse = await response.json();

    const dataDrivers = jsonResponse.MRData.RaceTable.Races[0].Results;

    for (let driver of dataDrivers) {
      const registro = {
        name: driver.Driver.givenName + " " + driver.Driver.familyName,
        abreviation: driver.Driver.code || "",
        position: Number(driver.position),
        points: Number(driver.points),
        team: driver.Constructor.name
      };

      driversData.push(registro);
    }

    console.log(driversData);

  } catch (error) {
    console.error("Erro ao buscar dados:", error);
  }
};

dataRequest();

const request = async (year) => {
  try {
    const urlDrivers = `https://api.jolpi.ca/ergast/f1/${year}/drivers/`;
    const urlTeams = `https://api.jolpi.ca/ergast/f1/${year}/teams/`;

    const dataDrivers = await fetch(urlDrivers);
    const dataTeams = await fetch(urlTeams);
    const jsonDrivers = await dataDrivers.json;
    const jsonTeams = await dataTeams.json;

    return jsonDrivers, jsonTeams;
  } catch (e) {
    console.log(e);
  }
};
