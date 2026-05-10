const GameSchema = require('../../models/GameSchema');
const IGDBService = require('./igdb.service');
const ResponseHelper = require('../../helpers/ResponseHelper');

const searchGame = async (req, res) => {
    try {
        const gameTitle = req.query.titulo;
        const filterCover = req.query.filterCover == 'true';

        console.log("Buscando jogo: " + gameTitle);

        const limit = req.query.limit || 1;

        const game = await GameSchema.findOne({ titulo: gameTitle });

        if (!game) {
            return res.status(404).json({ erro: "Jogo não encontrado." });
        }

        const igdbGame = await IGDBService.searchMainGame(gameTitle, filterCover);

        console.log("Resposta IGDB: ", igdbGame);
        if (!igdbGame || igdbGame?.length === 0) {
            return res.status(404).json({ erro: "Jogo não encontrado na IGDB." });
        }
        
        //ResponseHelper.sendSuccess(res, igdbGame, 200);
        res.status(200).json({status: 'success', data: igdbGame});
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
}

const getGameCover = async (req, res) => {
    try {
        const gameName = req.query.gameName;

        if (!gameName) {
            ResponseHelper.sendBadRequest(res, "Titulo do jogo não informado");
        }

        const gameCover = await IGDBService.getGameCover(gameName);

        ResponseHelper.sendSuccess(res, gameCover);
    } catch (error) {
        ResponseHelper.sendError(res, error, 500);
    }
}

module.exports = {
    searchGame,
    getPlayTimes
};
