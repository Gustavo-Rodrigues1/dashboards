//Elementos do HTML
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
  statusTable: document.querySelector(".status-table"),
  driversChangeTable: document.querySelector(".drivers-change-table"),
  teamsChangeTable: document.querySelector(".teams-change-table"),
};

const teamsData = {
  name: String,
  position: Number,
  points: Number,
};

const dataRequest = async (year, type) => {
  const urlEndPoint = (type === 'driver') ? 'driverstandings' : 'constructorstandings';
  const jsonKey = (type === 'driver') ? 'DriverStandings' : 'ConstructorStandings';
  try {
    const url = `https://api.jolpi.ca/ergast/f1/${year}/${urlEndPoint}`;
    const response = await fetch(url);
    const jsonResponse = await response.json();

    const data = jsonResponse.MRData.StandingsTable.StandingsLists[0][jsonKey];

    const newData = [];

    for (let item of data) {
      let registro;

      if(type === 'driver'){
      registro = {
        name: `${item.Driver.givenName} ${item.Driver.familyName}`,
        abreviation: item.Driver.code || "",
        position: Number(item.position),
        points: Number(item.points),
        team: item.Constructors[0].name,
      };
    } else {
      registro = {
        name: item.Constructor.name,
        position: Number(item.position),
        points: Number(item.points),
      }
    }
      newData.push(registro);
    }

    console.log(newData);
    return newData;
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    return [];
  }
};
//
//função para construir a tabela de pilotos
const buildDriversTable = (data) => {
  _elements.statusTable.innerHTML = "";
  let row = `<tr>
              <th>Nome</th>
              <th>Abreviação</th>
              <th>Posição</th>
              <th>Pontos</th>
              <th>Time</th>
            </tr>`;
  _elements.statusTable.innerHTML = row;
  for (const driver of data) {
    let row = `<tr>
               <td>${driver.name}</td>
               <td>${driver.abreviation}</td>
               <td>${driver.position}</td>
               <td>${driver.points}</td>
               <td>${driver.team}</td>
             </tr>`;

    _elements.statusTable.innerHTML += row;
  }
};
//
//função para construir a tabela de construtores
const buildTeamsTable = (data) => {
  _elements.statusTable.innerHTML = "";
  let row = `<tr>
              <th>Nome</th>
              <th>Posição</th>
              <th>Pontos</th>
            </tr>`;
  _elements.statusTable.innerHTML = row;
  for (const team of data) {
    let row = `<tr>
               <td>${team.name}</td>
               <td>${team.position}</td>
               <td>${team.points}</td>
             </tr>`;

    _elements.statusTable.innerHTML += row;
  }
};
//
// botão de troca de tema
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
//
// botao de menu hamburguer
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
  item.addEventListener("click", async () => {
    let yearSelected = item.innerText;
    _elements.yearSelectToggleSelected.innerText = yearSelected;
    _elements.yearSelectToggle.dispatchEvent(new Event("click"));
    if(!(_elements.driversChangeTable.classList.contains("deep__change-table"))){
    const updatedDriversData = await dataRequest(yearSelected, 'driver');
    buildDriversTable(updatedDriversData);
    } else {
    const updatedTeamsData = await dataRequest(yearSelected, 'team');
    buildTeamsTable(updatedTeamsData);
    }
  });
});
//
//Botões para trocar de tabelas
_elements.teamsChangeTable.addEventListener("click", async () => {
  _elements.teamsChangeTable.classList.remove(
    "deep__change-table"
  );
  _elements.driversChangeTable.classList.add("deep__change-table");
  let yearSelected = _elements.yearSelectToggleSelected.innerText;
  const updatedTeamsData = await dataRequest(yearSelected, 'team');
  buildTeamsTable(updatedTeamsData);
})

_elements.driversChangeTable.addEventListener("click", async () => {
  _elements.teamsChangeTable.classList.add(
    "deep__change-table"
  );
  _elements.driversChangeTable.classList.remove("deep__change-table");
  let yearSelected = _elements.yearSelectToggleSelected.innerText;
  const updatedDriversData = await dataRequest(yearSelected, 'driver');
  buildDriversTable(updatedDriversData);
})
//
// Carrosel
const swiper = new Swiper(".card-wrapper", {
  // Optional parameters
  direction: "horizontal",
  loop: true,

  // If we need pagination
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },

  // Navigation arrows
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});
//
const init = async () => {
  const data = await dataRequest('2025', 'driver');
  buildDriversTable(data);
};

init();
