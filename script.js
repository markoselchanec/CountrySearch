const homePage = document.getElementsByClassName("main-div")[0];
const title = document.getElementsByClassName("title")[0];
const searchBar = document.getElementsByClassName("search-bar")[0];
const searchContent = document.getElementsByClassName("search-content")[0];
const searchQuery = document.getElementsByClassName("search-query")[0];
const searchBtn = document.getElementById("country-search");
const randBtn = [...document.getElementsByClassName("random-btn")];
const link = "https://restcountries.com/v3.1/all";

const contentPage = document.getElementsByClassName("content-div")[0];
const bckBtn = document.getElementsByClassName("back-btn")[0];
const countryName = document.getElementById("country-name");
const countryFlag = document.getElementById("country-flag");
const countryCapital = document
  .getElementsByClassName("capital")[0]
  .getElementsByTagName("h2")[0];
const countryInfo = document
  .getElementsByClassName("country-info")[0]
  .getElementsByTagName("p");
const countryCurrency = document.getElementsByClassName("currency")[0];
const countryBorders = document.getElementsByClassName("borders-div")[0];

let data = [];

if (data.length == 0) {
  (async (link) => {
    const res = await fetch(link);

    const final = await res.json();

    final.forEach((e) => {
      data.push(e);
    });
  })(link);
}

// Home page

const search = () => {
  let tempData = [];
  let search = searchBar.value.toLowerCase();

  const tempQuery = document.createElement("p");

  search.length === 0
    ? searchContent.classList.add("hide")
    : searchContent.classList.remove("hide");
  for (const country of data) {
    if (country.name.official.toLowerCase().includes(search)) {
      tempData.push(country);
    }
  }
  searchQuery.innerHTML = "";
  if (tempData.length >= 8) {
    for (let i = 0; i < 7; i++) {
      searchBlockFill(tempData, i);
    }
  }
  if (tempData.length < 8) {
    for (let i = 0; i < tempData.length; i++) {
      searchBlockFill(tempData, i);
    }
  }
  if (event.keyCode === 13 && tempData.length === 1) {
    printContentPage(tempData[0]);
  }
  if (event.keyCode === 27) {
    searchQuery.innerHTML = "";
    searchContent.classList.add("hide");
    searchBar.value = "";
  }
};

const searchBlockFill = (tempArray, counter) => {
  const tempQuery = document.createElement("a");
  tempQuery.setAttribute("href", "#");
  tempQuery.classList.add("search-query-block");
  tempQuery.addEventListener("click", () => {
    printContentPage(tempArray[counter]);
  });
  tempQuery.innerText = tempArray[counter].name.official;
  searchQuery.appendChild(tempQuery);
};

const searchBtnClick = () => {
  let tempData = [];
  let search = searchBar.value.toLowerCase();
  for (const country of data) {
    if (country.name.official.toLowerCase().includes(search)) {
      tempData.push(country);
    }
  }
  if (tempData.length === 1) {
    printContentPage(tempData[0]);
  }
};

const randomPage = () => {
  printContentPage(data[getRandom(0, data.length)]);
};

searchBar.addEventListener("keyup", search);
searchBtn.addEventListener("click", searchBtnClick);
randBtn.forEach((e) => e.addEventListener("click", randomPage));

// Title

let titleLetters = [...document.getElementsByTagName("span")];
const colors = ["red", "green", "royalblue", "purple", "orange"];

const getRandom = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

titleLetters.map((e) => (e.style.color = colors[getRandom(0, colors.length)]));

// Content page

bckBtn.addEventListener("click", () => {
  homePage.classList.remove("hide");
  contentPage.classList.add("hide");
  searchBar.value = "";
  countryBorders.innerText = "";
  searchContent.classList.add("hide");
});

const printContentPage = (obj) => {
  homePage.classList.add("hide");
  contentPage.classList.remove("hide");
  if (obj.name.common !== undefined) countryName.innerHTML = obj.name.common;
  countryFlag.setAttribute("src", obj.flags.png);

  countryCapital.innerText = `Capital: ${obj.capital}`;

  countryInfo[2].innerText = "";
  countryInfo[2].innerText = "";

  countryInfo[0].innerHTML =
    "Native Name: " + Object.values(obj.name.nativeName)[0].official;
  countryInfo[1].innerHTML = "Population: " + obj.population.toLocaleString();
  countryInfo[2].innerText += `Region: ${obj.region}`;
  countryInfo[2].innerText += `\nSub-Region: ${obj.subregion}`;

  countryCurrency.innerHTML = "";
  const h3 = document.createElement("h3");
  h3.innerText = "Currencies: ";
  countryCurrency.appendChild(h3);
  for (const key in obj.currencies) {
    const div = document.createElement("div");
    const par = document.createElement("p");
    par.innerText = `${obj.currencies[key].name} ${
      obj.currencies[key].symbol === null ? "" : obj.currencies[key].symbol
    }`;
    div.appendChild(par);

    countryCurrency.appendChild(div);
  }

  document.getElementsByClassName("borders")[0].innerHTML = "";
  const bordersDiv = document.createElement("div");
  bordersDiv.classList.add("borders-div");
  document.getElementsByClassName("borders")[0].appendChild(bordersDiv);
  if (obj.borders === undefined) {
    const bordersH3 = document.createElement("h3");
    bordersH3.innerText = "Borders: ";
    document.getElementsByClassName("borders")[0].prepend(bordersH3);
    document
      .getElementsByClassName("borders")[0]
      .appendChild(document.createElement("p")).innerText =
      "This country doesn't have any neighbours!";
  } else {
    const bordersH3 = document.createElement("h3");
    bordersH3.innerText = "Borders: ";
    document.getElementsByClassName("borders")[0].prepend(bordersH3);
    obj.borders.forEach((e) => {
      data.forEach((x) => {
        if (e === x.cca3) {
          const mainDiv = document.getElementsByClassName("borders-div")[0];
          const div = document.createElement("div");
          const img = document.createElement("img");
          const par = document.createElement("p");

          img.classList.add("card-image");
          img.setAttribute("src", x.flags.png);

          par.classList.add("card-text");
          par.innerText = x.name.common;

          div.classList.add("card-content");
          div.addEventListener("click", () => {
            scrollTo(0, 0);
            mainDiv.innerHTML = "";
            printContentPage(x);
          });

          div.appendChild(img);
          div.appendChild(par);

          mainDiv.appendChild(div);
        }
      });
    });
  }
};
