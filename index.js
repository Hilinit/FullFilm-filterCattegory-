let toggle = document.getElementById("toggle-btn")
let sidebar = document.getElementById("sidebar");

let Base_API = `https://69b99a1ce69653ffe6a8318b.mockapi.io/moveData`
let Genre_API = `https://69b99a1ce69653ffe6a8318b.mockapi.io/genre`

function openClose() {
  sidebar.classList.toggle("-translate-x-full");
  sidebar.classList.toggle("translate-x-0");
}
let title = document.getElementById("title");
let cards = document.getElementById("Cards")
let genre = document.getElementById("genre")
let display = document.getElementById("display")

let all = []

fetch(Genre_API)
  .then(response => response.json())
  .then(genreData => {
    genreData.map(item => {
      genre.innerHTML += `
        <li onclick="filtrData('${item.name}')" class="text-gray-300 text-sm font-medium block cursor-pointer ${item.name === 'Hamısı' ? 'bg-[#070b18]' : ''} hover:bg-[#0b1739] rounded-md px-3 py-2 transition-all duration-300">
            <span>${item.name}</span>
        </li>
      `
    })
  });

fetch(Base_API)
  .then(response => response.json())
  .then(data => {
    all = data;
    getCards(all);
  });

function filtrData(name) {
  const filtered = (name === "Hamısı") ? all : all.filter(f => f.genre.includes(name));

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
  title.innerHTML = name === "Hamısı" ? "Bütün Janrlar" : `${name} janrında filmlər/seriallar `;

};

function slugTitle(title) {
  return title
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
}
function getMore(name, title) {
  const slug = slugTitle(title)
  window.location.href = `detail.htm?name=${slug}`
}
function getCards(show) {
  cards.innerHTML = ""
  show.map(item => {
    const isBookmarked = bookmark.find(b => b.id == item.id);

    cards.innerHTML += `
    <div class="flex flex-col bg-[#0b1739] cursor-pointer rounded-sm overflow-hidden shadow-sm hover:scale-[1.03] transition-all duration-300">
    <div class="h-80 w-full object-center relative">
    <div onclick="addBookmark(${item.id})" class="absolute top-3 right-3 bg-black/50 backdrop-blur-md p-2 rounded-full z-10 hover:bg-[#0b1739]transition cursor-pointer">
    <i class="${isBookmarked ? 'fa-solid text-red-500' : 'fa-regular text-white'} fa-bookmark text-lg"></i>
    </div>
      <img src="${item.poster}" alt="${item.title}" class="w-full h-80 " />
    </div>
    <div class="p-6">
      <h3 class="text-lg font-semibold text-slate-200">${item.title}</h3>
      <span class="text-sm block text-slate-400 font-medium mt-2">
        Janr: ${item.genre} | IMDB ${item.imdbRating}
      </span>
      <p class="text-sm text-slate-300 mt-4 leading-relaxed line-clamp-3">
        ${item.description}
      </p>
      <span class="text-sm block text-slate-400 font-medium mt-2">
        ${item.type} |
        ${item.type === "film"
        ? `${item.details.duration} dəq`
        : `${item.details.seasons} sezon ${item.details.episodes} bölüm`}
      </span>
      <button type="button" onclick="getMore('${item.name}', '${item.title}')"
    class="px-6 py-2.5  mt-4 rounded-md text-white text-sm cursor-pointer tracking-wider font-medium border-0 outline-0 bg-gradient-to-tr hover:bg-gradient-to-tl from-orange-700 to-orange-400">Daha Çox Oxu</button>
    </div>
  </div>
    `
  })
}

//-----------------------------------------------Search filtr---------------------------------------------------------------------

let resultSearch = document.getElementById("resultSearch")
let searchInput = document.getElementById("search");
searchInput.addEventListener("input", (event) => {
  let input = event.target.value.toLowerCase();
  filtrGenre(input);
});
function filtrGenre(input) {
  const filtered = all.filter(f => f.title.toLowerCase().includes(input));
  resultSearch.innerHTML = ''
  if (filtered.length != 0) {
    filtered.map(item => {
      const isBookmarked = bookmark.find(b => b.id == item.id);
      resultSearch.innerHTML +=
        `<div class="bg-[#0b1739]sm:p-4 p-3 shadow-sm rounded-lg overflow-hidden cursor-pointer relative border border-orange-500">
          
          <div class="w-full aspect-[205/273] overflow-hidden mx-auto">
          <div onclick="addBookmark(${item.id})" class="absolute top-3 right-3 bg-black/50 backdrop-blur-md p-2 rounded-full z-10 hover:bg-[#0b1739]transition cursor-pointer">
            <i class="${isBookmarked ? 'fa-solid text-red-500' : 'fa-regular text-white'} fa-bookmark text-xl"></i>
        </div>
              <img src="${item.poster}" alt="${item.title}"
                  class="h-full w-full object-cover object-top rounded-lg" />
          </div>
          <div onclick="getMore('${item.name}', '${item.title}')" title="Klik et və ətraflı oxu" class="sm:mt-4 mt-3 text-center ">
              <h4  class="text-orange-500 lg:text-base text-sm font-semibold">${item.title}</h4>
          </div>
        </div>
      `})
  }
}

let searchPanel = document.getElementById("searchPanel")
searchInput.addEventListener("focus", () => {
  searchPanel.style.display = 'grid'
});
searchInput.addEventListener("blur", () => {
  setTimeout(() => { searchPanel.style.display = 'none'; }, 3000);
});

//----------------------------------------Bookmark-a atmaq-----------------------------------------------
let modal = document.getElementById("modal")
function openModal() { modal.style.display = (modal.style.display === 'block') ? 'none' : 'block'; }

let bookmark = []
let message = document.getElementById("message")

function addBookmark(id) {
  const index = bookmark.findIndex(n => n.id == id);

  if (index === -1) {
    const item = all.find(n => n.id == id);

    if (item) bookmark.push(item);
  }
  else { bookmark.splice(index, 1); }
  message.innerHTML = bookmark.length === 0 ? `Bəyəndiyiniz film/serialları əlavə edin` : `Bəyəndiyiniz film/seriallar`;
  getCards(all);
  showBookmarks();
}

let mark = document.getElementById('mark')

function showBookmarks() {
  mark.innerHTML = ''
  bookmark.map(item => {
    const isBookmarked = bookmark.find(b => b.id == item.id);
    mark.innerHTML +=
      `
    <div class="flex flex-wrap items-center gap-4 py-3 cursor-pointer">
    <img src='${item.poster}' class="w-20 h-20 rounded" />
    <div class=" text-white">
        <p class="text-sm font-semibold">${item.title}</p>
        <p class="text-xs mt-0.5">${item.type} |
        ${item.type === "film"
        ? `${item.details.duration} dəq`
        : `${item.details.seasons} sezon ${item.details.episodes} bölüm`}</p>
    </div>
    <p  onclick="addBookmark(${item.id})" class="text-xl text-slate-500 mt-0.5 ml-auto"><i  class="${isBookmarked ? 'fa-solid text-red-500' : 'fa-regular text-white'} fa-bookmark"></i></p>
</div>
    `})
}
console.log(bookmark)

//--------------------------------------------------------------


