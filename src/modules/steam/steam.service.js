const axios = require('axios');
require('dotenv').config();

const STEAM_ID = process.env.STEAM_ID;
const API_KEY = process.env.STEAM_API_KEY;
const BASE_URL = "http://api.steampowered.com";

exports.GetOwnedGames = async () => {
    try {
        const url = `${BASE_URL}/IPlayerService/GetOwnedGames/v0001/`;

        const params = {
            key: API_KEY,
            steamid: STEAM_ID,
            include_appinfo: true,
            include_extended_appinfo: false
        };

        const response = await axios.get(url, { params: params });
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar jogos da Steam:", error.message);
        console.error(error);
        throw new Error("Falha na comunicação com a API Steam.");
    }
};

exports.GetOwnedGameById = async (id) => {
    try {
        const url = `${BASE_URL}/IPlayerService/GetOwnedGames/v0001/`;

        const params = {
            key: API_KEY,
            steamid: STEAM_ID,
            include_appinfo: true,
            include_extended_appinfo: true,
            appids_filter: id
        };

        const response = await axios.get(url, { params: params });
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar jogos da Steam:", error.message);
        console.error(error);
        throw new Error("Falha na comunicação com a API Steam.");
    }
};

exports.getPlayerSummary = async () => {
    try {
        const url = `${BASE_URL}/ISteamUser/GetPlayerSummaries/v0001/`;

        const params = {
            key: API_KEY,
            steamids: STEAM_ID
        };

        const response = await axios.get(url, { params: params });
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar User stats for game da Steam:", error.message);
        throw new Error("Falha na comunicação com a API Steam.");
    }
};

exports.getRecentPlayedGame = async () => {
    try {
        const url = `${BASE_URL}/IPlayerService/GetRecentlyPlayedGames/v0001/`;

        const params = {
            count: 3,
            key: API_KEY,
            steamids: STEAM_ID
        };

        const response = await axios.get(url, { params: params });
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar dados de jogos recentes. ", error.message);
    }
};
