const axios = require('axios'); // Importe o Axios
require('dotenv').config();

const STEAM_ID = process.env.STEAM_ID;
const API_KEY = process.env.STEAM_API_KEY;
const BASE_URL = "http://api.steampowered.com";

// http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=XXXXXXXXXXXXXXXXX&steamid=76561197960434622&format=json
exports.GetOwnedGames = async () => {
    try {
        // 1. Monta a URL completa para a chamada
        const url = `${BASE_URL}/IPlayerService/GetOwnedGames/v0001/`;
        
        // 2. Define os parâmetros da query (mais limpo que concatenar na URL)
        const params = {
            key: API_KEY,
            steamid: STEAM_ID,
            include_appinfo: true,
            include_extended_appinfo: false,
        };
        
        // 3. Faz a requisição GET
        const response = await axios.get(url, { params: params });
        
        // 4. Retorna os dados que vieram na resposta
        return response.data; 

    } catch (error) {
        console.error("Erro ao buscar jogos da Steam:", error.message);
        console.error(error);
        // Em caso de erro, você pode lançar uma exceção ou retornar um objeto de erro
        throw new Error("Falha na comunicação com a API Steam.");
    }
}


exports.GetOwnedGameById = async (id) => {
    try {
        // 1. Monta a URL completa para a chamada
        const url = `${BASE_URL}/IPlayerService/GetOwnedGames/v0001/`;
        
        // 2. Define os parâmetros da query (mais limpo que concatenar na URL)
        const params = {
            key: API_KEY,
            steamid: STEAM_ID,
            include_appinfo: true,
            include_extended_appinfo: true,
            appids_filter: id // AQUI QUE FAZ O FILTRO PARA UM UNICO JOGO.
        };
        
        // 3. Faz a requisição GET
        const response = await axios.get(url, { params: params });
        
        // 4. Retorna os dados que vieram na resposta
        return response.data; 

    } catch (error) {
        console.error("Erro ao buscar jogos da Steam:", error.message);
        console.error(error);
        // Em caso de erro, você pode lançar uma exceção ou retornar um objeto de erro
        throw new Error("Falha na comunicação com a API Steam.");
    }
}

// http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?appid=440&key=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX&steamid=76561197972495328
exports.getPlayerSummary = async () => {
    try {
        // 1. Monta a URL completa para a chamada
        
        const url = `${BASE_URL}/ISteamUser/GetPlayerSummaries/v0001/`;
        
        // 2. Define os parâmetros da query (mais limpo que concatenar na URL)
        const params = {
            key: API_KEY,
            steamids: STEAM_ID,
        };
        
        // 3. Faz a requisição GET
        const response = await axios.get(url, { params: params });
        
        // 4. Retorna os dados que vieram na resposta
        return response.data; 

    } catch (error) {
        console.error("Erro ao buscar User stats for game da Steam:", error.message);
        // Em caso de erro, você pode lançar uma exceção ou retornar um objeto de erro
        throw new Error("Falha na comunicação com a API Steam.");
    }
}

exports.getRecentPlayedGame = async () => {
    try {
        const url = `${BASE_URL}/IPlayerService/GetRecentlyPlayedGames/v0001/`;

        const params = {
            count: 3,
            key: API_KEY,
            steamids: STEAM_ID,
        };

        const response = await axios.get(url, { params: params });
        
        return response.data; 
    }
    catch (error) {
        console.error("Erro ao buscar dados de jogos recentes. ", error.message);
    }
}