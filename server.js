const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const config = require('./config.json');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Discord Status Bot
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Status Bot Başladı - ${client.user.tag}`);
});

app.get('/status', (req, res) => {
  const member = client.guilds.cache.get(config.server).members.cache.get(config.discordID);

  if (!member) {
    res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
    return;
  }

  const presence = member.presence;

  res.json({
    userId: member.id,
    username: member.user.username,
    status: presence.status,
    activities: presence.activities.map(activity => ({
      name: activity.name,
      type: activity.type,
    })),
  });
});

// Spotify Status
const spoapi = 'https://api.spotify.com/v1/me/player/currently-playing';
app.use(async (req, res, next) => {
  try {
    const response = await axios.get(spoapi, {
      headers: {
        'Authorization': `Bearer ${config['spotify-token']}`,
      },
    });
    const spotifyStatus = response.data.item;
    res.locals.spotifyStatus = spotifyStatus;
  } catch (error) {
    console.error('SpotifyStatus Error -', error.message);
    res.locals.spotifyStatus = null;
  }
  next();
});

// Discord Status
const dcapi = `${config.url}/status`;
app.get('/', async (req, res) => {
  try {
    const response = await axios.get(dcapi);
    const discordStatus = response.data;
    res.render('index', { discordStatus });
  } catch (error) {
    console.error('DiscordStatus Error - :', error.message);
    res.render('index', { discordStatus: {} });
  }
});

// Main Page
app.get('/', (req, res) => {
  res.render('index');
});

client.login(config['discord-bot-token']);
app.listen(80);
