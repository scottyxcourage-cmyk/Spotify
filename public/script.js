const grid = document.getElementById('music-grid');
const searchInput = document.getElementById('searchInput');

const playerImage = document.getElementById('player-image');
const playerTitle = document.getElementById('player-title');
const playerArtist = document.getElementById('player-artist');
const audioPlayer = document.getElementById('audio-player');

async function loadTrending() {

  grid.innerHTML = "<h2>Loading music...</h2>";

  const response = await fetch('/api/trending');

  const data = await response.json();

  grid.innerHTML = "";

  data.albums.items.forEach(album => {

    const preview =
      album.artists[0]?.external_urls?.spotify || "";

    grid.innerHTML += `
    
      <div class="card">

        <img src="${album.images[0]?.url}" />

        <div class="card-content">

          <h3>${album.name}</h3>

          <p>${album.artists[0]?.name}</p>

          <button class="play-btn"
            onclick="playSong(
              '${album.images[0]?.url}',
              '${album.name}',
              '${album.artists[0]?.name}',
              '${preview}'
            )">
            Open
          </button>

        </div>

      </div>

    `;
  });
}

function playSong(image, title, artist, preview) {

  playerImage.src = image;

  playerTitle.innerText = title;

  playerArtist.innerText = artist;

  window.open(preview, '_blank');
}

searchInput.addEventListener('keypress', async (e) => {

  if (e.key === 'Enter') {

    const query = searchInput.value;

    grid.innerHTML = "<h2>Searching...</h2>";

    const response = await fetch(
      `https://itunes.apple.com/search?term=${query}&entity=song&limit=20`
    );

    const data = await response.json();

    grid.innerHTML = "";

    data.results.forEach(song => {

      grid.innerHTML += `

        <div class="card">

          <img src="${song.artworkUrl100}" />

          <div class="card-content">

            <h3>${song.trackName}</h3>

            <p>${song.artistName}</p>

            <button class="play-btn"
              onclick="previewSong(
                '${song.artworkUrl100}',
                '${song.trackName}',
                '${song.artistName}',
                '${song.previewUrl}'
              )">
              Play Preview
            </button>

          </div>

        </div>

      `;
    });
  }
});

function previewSong(image, title, artist, url) {

  playerImage.src = image;

  playerTitle.innerText = title;

  playerArtist.innerText = artist;

  audioPlayer.src = url;

  audioPlayer.play();
}

loadTrending();