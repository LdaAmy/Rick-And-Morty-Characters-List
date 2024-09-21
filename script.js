let currentPage = 1;
let isLoading = false;
const cardContainer = document.getElementById('card-container');
const searchInput = document.querySelector('input[type="text"]');

async function getRickAndMortyCharacters(page = 1, name = '') {
  try {
    if (isLoading) return;
    isLoading = true;

    let url = `https://rickandmortyapi.com/api/character?page=${page}`;
    if (name) {
      url += `&name=${encodeURIComponent(name)}`;
    }

    let response = await fetch(url);
    let data = await response.json();

    if (page === 1) {
      cardContainer.innerHTML = '';
    }

    if (data.error) {
      cardContainer.innerHTML = '<p class="m-4">No characters found</p>';
      isLoading = false;
      return;
    }

    data.results.forEach(character => {
      const card = `
        <div class="card m-4 shadow d-flex">
          <div>
            <img src="${character.image}" height="299px" class="w-75"
              style="object-fit: cover; border-top-left-radius: 4px; border-bottom-left-radius: 4px;">
          </div>
          <div class="card-text">
            <p id="name">${character.name}</p>
            <p id="status">${character.status.toUpperCase()} - ${character.species.toUpperCase()}</p>
            <p>LAST KNOWN LOCATION:</p>
            <p id="location">${character.location.name}</p>
            <p>FIRST SEEN IN:</p>
            <p id="seen">${character.origin.name}</p>
          </div>
        </div>
      `;

      cardContainer.innerHTML += card;
    });

    isLoading = false;

    if (!data.info.next) {
      window.removeEventListener('scroll', handleScroll);
    }
  } catch (error) {
    console.error("Erro ao buscar personagens:", error);
    cardContainer.innerHTML = '<p class="m-4">No characters found</p>';
    isLoading = false;
  }
}

function handleScroll() {
  const scrollTop = window.scrollY;
  const windowHeight = window.innerHeight;
  const fullHeight = document.documentElement.scrollHeight;

  if (scrollTop + windowHeight >= fullHeight * 0.9 && !searchInput.value) {
    currentPage++;
    getRickAndMortyCharacters(currentPage); 
  }
}


function searchCharacters(event) {
  const searchTerm = event.target.value.trim();
  currentPage = 1;
  getRickAndMortyCharacters(currentPage, searchTerm);
}
document.addEventListener('DOMContentLoaded', () => {
  getRickAndMortyCharacters();
  window.addEventListener('scroll', handleScroll);
  searchInput.addEventListener('input', searchCharacters);
});