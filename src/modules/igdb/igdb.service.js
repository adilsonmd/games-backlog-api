require('dotenv').config();
const axios = require('axios');

const TokenSchema = require('../../models/TokenSchema');
const SettingService = require('../setting/setting.service.js');

const baseURL = 'https://api.igdb.com/v4';

async function authenticateWithTwitch() {
    try {
        console.log("Tentando autenticar");

        const token = await TokenSchema.findOne({ provider: 'TWITCH' });

        if (token && token.authorization && token.authorization.expires_in) {
            const tokenCreationTime = token.created_at || Date.now();

            const currentTime = Math.floor(Date.now() / 1000);
            console.log('Current Time:', currentTime);
            console.log('Token Creation Time:', tokenCreationTime);
            console.log('Token Expiry Duration (seconds):', token.authorization.expires_in);

            if (currentTime < tokenCreationTime + token.authorization.expires_in) {
                return token.authorization;
            }
        }

        const twitchBody = new URLSearchParams();
        twitchBody.append('client_id', process.env.TWITCH_CLIENT_ID);
        twitchBody.append('client_secret', process.env.TWITCH_SECRET);
        twitchBody.append('grant_type', 'client_credentials');

        const response = await axios.post('https://id.twitch.tv/oauth2/token', twitchBody, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        TokenSchema.findOneAndUpdate(
            { provider: 'TWITCH' },
            { authorization: response.data, updated_at: Date.now() }
        );

        return response.data;
    } catch (error) {
        console.error('Error authenticating with Twitch:', error.response ? error.response.data : error.message);
        throw error;
    }
}

exports.searchMainGame = async (gameName, filterArtwork = true) => {
    try {
        const authData = await authenticateWithTwitch();
        const query = `search "${gameName}";
            fields id, name, artworks.image_id, artworks.url, artworks.artwork_type, platforms.abbreviation;
            where game_type = 0 & version_parent = null; `;

        const response = await axios.post(baseURL + '/games', query, {
            headers: {
                'Client-ID': process.env.TWITCH_CLIENT_ID,
                'Authorization': `Bearer ${authData.access_token}`
            }
        });

        let gameData = response.data;

        if (filterArtwork) {
            gameData.artworks = await getGameCover(gameData);
        }

        return gameData;
    } catch (error) {
        console.error('Error fetching game from IGDB:', error.response ? error.response.data : error.message);
        throw error;
    }
};

exports.getGamePlayTime = async (gameId) => {
    try {
        const authData = await authenticateWithTwitch();

        console.log("Buscando tempo do jogo: " + gameId);

        const query = `fields *; where id = ${gameId};`;

        const response = await axios.post(baseURL + '/game_time_to_beats', query, {
            headers: {
                'Client-ID': process.env.TWITCH_CLIENT_ID,
                'Authorization': `Bearer ${authData.access_token}`
            }
        });

        console.log("Resposta: ", response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching game play time from IGDB:', error.response ? error.response.data : error.message);
        throw error;
    }
};

/**
 * Estrutura do JSON:  
 * {
        "id": 110916,
        "image_id": "ar2dl0",
        "url": "//images.igdb.com/igdb/image/upload/t_thumb/ar2dl0.jpg",
        "artwork_type": 1
    },
 */
getGameCover = async (gameData) => {
    try {
        const baseImageUrl = await SettingService.getSetting("IGDB_IMAGE_URL");

        if (!baseImageUrl) {
            throw new Error("Setting IGDB_IMAGE_URL não encontrado");
            return;
        }

        if (!gameData) {
            console.log("gameData invalido", gameData);
        }

        let newGameData = gameData[0].artworks
            .filter((x) => x.artwork_type == 9)
            .map((x) => x.url = baseImageUrl.replace("${hash}", x.image_id));

        return newGameData;
    } catch (error) {
        console.error('Erro ao manipular dados da artwork', error.message);
        throw error;
    }
}