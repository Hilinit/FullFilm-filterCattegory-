let toggle = document.getElementById("toggle-btn")
let sidebar = document.getElementById("sidebar");

toggle.addEventListener("click", () => { sidebar.classList.toggle("-translate-x-full"); });

let cards = document.getElementById("Cards")
let genre = document.getElementById("genre")
let display = document.getElementById("display")

let all = []

fetch("https://69b99a1ce69653ffe6a8318b.mockapi.io/genre")
  .then(response => response.json())
  .then(genreData => {
    genreData.forEach(item => {
      genre.innerHTML += `
        <li>
          <a href="javascript:void(0)" onclick="filtrData('${item.type}')"
             class="text-gray-300 text-sm font-medium block cursor-pointer ${item.type === 'all' ? 'bg-[#070b18]' : ''} hover:bg-[#0b1739] rounded-md px-3 py-2 transition-all duration-300">
            <span>${item.name}</span>
          </a>
        </li>
      `
    })
  });

fetch("https://69b99a1ce69653ffe6a8318b.mockapi.io/moveData")
  .then(response => response.json())
  .then(data => {
    all = data;
    getCards(all);
  });

function filtrData(type) {
  const filtered = (type === "all") ? all : all.filter(f => f.genre.includes(type));

  if (filtered.length === 0) {
    display.innerHTML =
      `<main class="grid min-h-full place-items-center bg-gray-900 px-6 py-24 sm:py-32 lg:px-8">
          <div class="text-center">
           
            <h1 class="mt-4 text-[50px] font-semibold tracking-tight text-balance text-white sm:text-7xl">404</h1>
            <p class="mt-6 text-lg text-[50px] text-pretty text-gray-400 sm:text-xl/8">Bu janrlı film/serial hələ ki bazada mövcud deyil!</p>
            
          </div>
        </main>`
    display.style.display = 'block'
    cards.style.display = 'none'
  }
  else {
    getCards(filtered);
    display.style.display = 'none'
    cards.style.display = 'grid'
  }

};

function getCards(show) {
  cards.innerHTML = "";
  show.map(item => {
    cards.innerHTML += `
      <div class="flex flex-col bg-[#0b1739] cursor-pointer rounded-sm overflow-hidden shadow-sm hover:scale-[1.03] transition-all duration-300">
        <div class="h-80 w-full object-center">
          <img src="${item.poster}" alt="${item.title}" class="w-full h-80 object-center" />
        </div>
        <div class="p-6">
          <h3 class="text-lg font-semibold text-slate-200">${item.title}</h3>
          <span class="text-sm block text-slate-400 font-medium mt-2"> Janr: ${item.genre} | IMDBRating ${item.imdbRating}</span>
          <p class="text-sm text-slate-300 mt-4 leading-relaxed line-clamp-3">${item.description}</p>
          <span class="text-sm block text-slate-400 font-medium mt-2">
            ${item.type} | ${item.type === "movie" ? `${item.details.duration} dəq` : `${item.details.seasons} sezon, ${item.details.episodes} bölüm`}
          </span>
        </div> 
      </div>
    `
  })
}