// src/controllers/SteamGameController.js
const SteamService = require('../services/SteamService');


const getPlayerSummary = async (req, res) => {
    try {
        const data = await SteamService.getPlayerSummary();
        
        res.status(200).json(data);
    }
    catch (error){
        res.status(500).json({
            error: "Ocorreu um erro",
            details: error.message
        });
    }
};

const SteamAllGames = async (req, res) => {
    // Uso direto do objeto:
    try {
        const data = await SteamService.GetOwnedGames(); 
        res.status(200).json(data);
    }
    catch (error) {
        res.status(500).json({
            error: "Ocorreu um erro",
            details: error.message
        });
    }
};

const getRecentPlayedGame = async (req, res) => {
    try {
        const data = await SteamService.getRecentPlayedGame();

        if (!data) {
            res.status(404).json({error: "Dados não encontrados"});
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            error: "Ocorreu um erro ao buscar jogos recentes",
            details: error.message
        })
    }
}

module.exports = {
    getPlayerSummary,
    SteamAllGames,
    getRecentPlayedGame
}