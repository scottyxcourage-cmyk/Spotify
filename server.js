require('dotenv').config();

const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

async function getSpotifyToken() {

  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    'grant_type=client_credentials',
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' +
          Buffer.from(
            process.env.SPOTIFY_CLIENT_ID +
            ':' +
            process.env.SPOTIFY_CLIENT_SECRET
          ).toString('base64'),
      },
    }
  );

  return response.data.access_token;
}

app.get('/api/trending', async (req, res) => {

  try {

    const token = await getSpotifyToken();

    const response = await axios.get(
      'https://api.spotify.com/v1/browse/new-releases',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.json(response.data);

  } catch (err) {

    console.log(err.message);

    res.status(500).json({
      error: 'Spotify API error',
    });

  }

});

app.listen(PORT, () => {
  console.log(`BeatDrop running on port ${PORT}`);
});