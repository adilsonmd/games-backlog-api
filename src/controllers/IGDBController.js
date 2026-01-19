const GameSchema = require('../models/GameSchema');
const IGDBService = require('../services/IGDBService');
 
const searchGame = async (req, res) => {
    try {
        
        const gameTitle = req.query.titulo;
        console.log("Buscando jogo: " + gameTitle);

        const limit = req.query.limit || 1;

        const game = await GameSchema.findOne({ titulo: gameTitle });

        if (!game) {
            return res.status(404).json({ erro: "Jogo não encontrado." });
        }

        const igdbGame = await IGDBService.searchGame(gameTitle, limit);
        
        console.log("Resposta IGDB: ", igdbGame);
        if (!igdbGame || igdbGame?.length === 0) {
            return res.status(404).json({ erro: "Jogo não encontrado na IGDB." });
        }

        // TODO buscar 
        const gameWithPlatform = await getPlatformForGame(igdbGame)

        if (!gameWithPlatform) {
            res.status(400).json({erro: "Nao encontrou"});
        }
        else {
            console.log("Resultado: ", gameWithPlatform);
            res.status(200).json(gameWithPlatform);
        }
    } catch (error) {
        res.status(400).json({ erro: "Erro ao buscar jogo. " + error });
    }   
};

const getPlatformForGame = async (IgdbGames) => {
    try {
        if (!IgdbGames || IgdbGames.length === 0) {
            console.error("Sem 'ids' não pode seguir");
            return null;
        }

        // 1. Criar lista única de IDs de plataformas para a consulta
        let platformIds = [...new Set(IgdbGames.flatMap(item => item.platforms))];
        
        if (platformIds.length === 0) {
            return IgdbGames;
        }

        // 2. Buscar os detalhes das plataformas no IGDB
        const response = await IGDBService.getPlatforms(platformIds);
        
        if (!response || response.length === 0) {
            return IgdbGames;
        }

        // 3. O SEGREDO: Criar um mapa de ID -> Objeto da plataforma
        // Isso torna a busca muito mais rápida e organizada
        const platformMap = {};
        response.forEach(p => {
            platformMap[p.id] = p;
        });

        // 4. Associar as plataformas corretas a cada jogo
        const finalGames = IgdbGames.map(game => {
            return {
                ...game,
                // Transformamos o array de IDs [167, 48] em [{id: 167, name: 'PS5'}, {id: 48, name: 'PS4'}]
                platforms: game.platforms
                    .map(id => platformMap[id]) // Busca no mapa pelo ID
                    .filter(p => p !== undefined) // Remove caso algum ID não tenha retornado da API
            };
        });        
        return finalGames;

    } catch (error) {
        console.error("Erro na função getPlatformForGame: " + error);
        return null;
    }
}

const getPlatforms = async(req, res) => {
    try {

        const platforms = req.body.platforms;
        
        if (!platforms) {
            res.status(400).json({erro: "Informar 'platforms' para seguir."})
        }
        const response = await IGDBService.getPlatforms(platforms);
        
        if (!response || response?.length === 0) {
            return res.status(400).json({erro: "Não encontrado"});
        }
        
        res.status(200).json(response);
    }
    catch (error) {
        return res.status(500).json({erro: "Não foi possível recuperar. " + error});
    }
}

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
    getPlatformForGame,
    getPlatforms,
    getPlayTimes,
}