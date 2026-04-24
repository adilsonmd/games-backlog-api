const GameSchema = require('../../models/GameSchema');
const IGDBService = require('./igdb.service');

const searchGame = async (req, res) => {
    try {
        const gameTitle = req.query.titulo;
        console.log("Buscando jogo: " + gameTitle);

        const limit = req.query.limit || 1;

        const game = await GameSchema.findOne({ titulo: gameTitle });

        if (!game) {
            return res.status(404).json({ erro: "Jogo não encontrado." });
        }

        const igdbGame = await IGDBService.searchMainGame(gameTitle);

        console.log("Resposta IGDB: ", igdbGame);
        if (!igdbGame || igdbGame?.length === 0) {
            return res.status(404).json({ erro: "Jogo não encontrado na IGDB." });
        }
    } catch (error) {
        res.status(400).json({ erro: "Erro ao buscar jogo. " + error });
    }
};

const getPlayTimes = async (req, res) => {
    try {
        const gameId = req.params.id;
        const playTimes = await IGDBService.getGamePlayTime(gameId);
        res.status(200).json(playTimes);
    } catch (error) {
        res.status(400).json({ erro: "Erro ao buscar tempo de jogo. " + error });
    }
};

module.exports = {
    searchGame,
    getPlayTimes
};
