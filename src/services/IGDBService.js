require('dotenv').config();
const axios = require('axios');

const TokenSchema = require("../models/TokenSchema");

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
            { authorization: response.data, updated_at: Date.now() });
            
            return response.data;
    } catch (error) {
        console.error('Error authenticating with Twitch:', error.response ? error.response.data : error.message);
        throw error;
    }
}


exports.searchGame = async (gameName, limit) => {
    try {
        const authData = await authenticateWithTwitch();

        const query = `fields id, name, platforms; where name = "${gameName}"; limit ${limit};`;
        
        const response = await axios.post(baseURL + '/games', query, {
            headers: {
                'Client-ID': process.env.TWITCH_CLIENT_ID,
                'Authorization': `Bearer ${authData.access_token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching game from IGDB:', error.response ? error.response.data : error.message);
        throw error;
    }
}

exports.getGamePlayTime = async (gameId) => {
    try {
        const authData = await authenticateWithTwitch();

        const query = `fields *; where id = ${gameId};`;

        const response = await axios.post(baseURL + '/game-time-to-beat', query, {
            headers: {
                'Client-ID': process.env.TWITCH_CLIENT_ID,
                'Authorization': `Bearer ${authData.access_token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching game play time from IGDB:', error.response ? error.response.data : error.message);
        throw error;
    }
}

exports.getPlatforms = async(platforms) => {
    try {
        const authData = await authenticateWithTwitch();

        const query = `fields id,abbreviation; where id = (${platforms.join(',')});`;

        const response = await axios.post(baseURL + '/platforms', query, {
            headers: {
                'Client-ID': process.env.TWITCH_CLIENT_ID,
                'Authorization': `Bearer ${authData.access_token}`
            }
        });

        return response.data;
    }
    catch (error) {
        console.error('Error fetching game play time from IGDB:', error.response ? error.response.data : error.message);
        throw error;
    }
}