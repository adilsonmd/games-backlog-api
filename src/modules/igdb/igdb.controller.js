import GameSchema from '../../models/GameSchema.js';
import { searchMainGame, getGamePlayTime } from './igdb.service.js';
import ResponseHelper from '../../helpers/ResponseHelper.js';

const searchGame = async (req, res) => {
    try {
        const gameTitle = req.query.titulo;
        const filterCover = req.query.filterCover == 'true';

        console.log("Buscando jogo: " + gameTitle);

        const game = await GameSchema.findOne({ titulo: gameTitle });

        if (!game) {
            return res.status(404).json({ erro: "Jogo não encontrado." });
        }

        const igdbGame = await searchMainGame(gameTitle, filterCover);

        console.log("Resposta IGDB: ", igdbGame);
        if (!igdbGame || igdbGame?.length === 0) {
            return res.status(404).json({ erro: "Jogo não encontrado na IGDB." });
        }

        //ResponseHelper.sendSuccess(res, igdbGame, 200);
        res.status(200).json({ status: 'success', data: igdbGame });
    } catch (error) {
        res.status(400).json({ erro: "Erro ao buscar jogo. " + error });
    }
};

const getPlayTimes = async (req, res) => {
    try {
        const gameId = req.params.id;
        const playTimes = await getGamePlayTime(gameId);
        res.status(200).json(playTimes);
    } catch (error) {
        res.status(400).json({ erro: "Erro ao buscar tempo de jogo. " + error });
    }
}


export default {
    searchGame,
    getPlayTimes
}
