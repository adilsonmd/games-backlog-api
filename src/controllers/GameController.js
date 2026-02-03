const GameSchema = require('../models/GameSchema');

const getAll = async (req, res) => {
    try {
        const page = Number(req.query.page) || 0;
        const limit = Number(req.query.limit) || 25;

        const q = req.query.search || null;

        let queryMongo = {};

        // Supondo que 'q' seja seu req.query.titulo ou similar
        if (q && q.trim() !== "") {
            let tempQ = q; // Usar uma variável temporária para não sujar o original se precisar

            if (tempQ.includes('switch:')) {
                queryMongo.plataformaAdquirida = { $in: ["SWITCH"] };
                tempQ = tempQ.replace('switch:', '').trim();
            }

            else if (tempQ.includes('steam:')) {
                queryMongo.plataformaAdquirida = { $in: ["PC"] };
                tempQ = tempQ.replace('steam:', '').trim();
            }

            else if (tempQ.includes('psn:')) {
                queryMongo.plataformaAdquirida = { $in: ["PS5"] };
                tempQ = tempQ.replace('psn:', '').trim();
            }

            // SÓ adiciona a regex se ainda houver texto após remover os prefixos
            if (tempQ.length > 0) {
                // Use o nome do campo correto (no seu print era 'titulo', aqui você usou 'name')
                queryMongo.titulo = { $regex: tempQ, $options: 'i' };
            }
        }

        if (req.query.midia) {
            let midia = req.query.midia;

            if (midia == 'digital')
                queryMongo.midiaDigital = true;
            else if (midia == 'fisica')
                queryMongo.midiaFisica = true;
        }

        if (req.query.status) {            
            queryMongo.status = req.query.status;
        }

        if (req.query.statusCompra) {            
            queryMongo.statusCompra = req.query.statusCompra;
        }


        console.log("Query: ", queryMongo);
        const response =
            await GameSchema
                .find(queryMongo)
                .skip(page * limit)
                .limit(limit)
                .sort({ name: 1 })
                .exec();

        const total = await GameSchema.countDocuments();

        let json = {
            games: response,
            pageInfo: {
                lastPage: (page + 1) * limit >= total,
                page: page,
                limit: page,
                totalCount: total,
            }
        }

        console.log(json);
        res.status(200).json(json);
    } catch (error) {
        res.status(400).json({ erro: "Erro ao listar jogos. " + error });
    }
};

const getById = async (req, res) => {
    try {
        const response = await GameSchema.findById(req.params.id);

        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ erro: "Erro ao listar jogos" });
    }
};

const create = async (req, res) => {
    try {

        let data = req.body;

        if (data.psn_id) {
            data.psn_id = data.psn_id.replace('-', '');
        }

        const novoJogo = await GameSchema.create(req.body);
        res.status(201).json(novoJogo);
    } catch (error) {
        res.status(400).json({ erro: "Erro ao cadastrar jogo. " + error });
    }
};

const update = async (req, res) => {
    try {
        const game = await GameSchema.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        if (!game) {
            res.status(404).json({ erro: "Jogo não encontrado" });
        }
        res.status(200).json(game);
    } catch (error) {
        res.status(500).json({ erro: "Erro ao cadastrar jogo" });
    }
};

const getWishlist = async (req, res) => {
    try {
        const response = await GameSchema.aggregate([
            {
                $match: { statusCompra: 'Wishlist' }
            },
            {
                $lookup: {
                    from: "images",
                    let: { game_id: "$_id" }, // Define a variável do ID do jogo
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$gameId", "$$game_id"] }, // Join pelo ID
                                        { $eq: ["$isCover", true] }        // Filtra apenas a capa
                                    ]
                                }
                            }
                        },
                        { $limit: 1 } // Garante que trará apenas uma imagem no array
                    ],
                    as: "fotos"
                }
            },
            {
                $sort: { titulo: 1 }
            }
        ]);

        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ erro: "Erro ao listar jogos da wishlist", details: error });
    }
};

const removeDuplicates = async (req, res) => {
    try {
        const result = await GameSchema.aggregate([
            {
                $group: {
                    _id: { titulo: "$titulo" },      // Agrupa pelo campo duplicado
                    ids: { $push: "$_id" },          // Armazena todos os IDs desse grupo
                    count: { $sum: 1 }               // Conta as ocorrências
                }
            },
            {
                $match: {
                    count: { $gt: 1 }                // Filtra apenas o que está duplicado
                }
            }
        ]);

        const idsParaDeletar = [];

        result.forEach(doc => {
            // Remove o primeiro ID do array (ele será mantido no banco)
            // Os IDs restantes são duplicatas e vão para a lista de remoção
            const [, ...duplicatas] = doc.ids;
            idsParaDeletar.push(...duplicatas);
        });

        if (idsParaDeletar.length > 0) {
            const deleteResult = await GameSchema.deleteMany({ _id: { $in: idsParaDeletar } });

            res.status(200).json({ message: "Sucesso" });
        } else {
            res.status(204).json({ message: "Nenhum duplicado encontrado. " });
        }

    } catch (error) {
        res.status(500).json({ erro: "Erro ao remover", detail: error.message });
    }
}

const getDashboardData = async (req, res) => {
    try {
        const estatisticas = await GameSchema.aggregate([
            {
                $facet: {
                    totalJogos: [{ $count: "count" }],
                    finalizados: [
                        { $match: { status: "Finalizado" } },
                        { $count: "count" }
                    ],
                    wishlist: [
                        { $match: { statusCompra: "Wishlist" } },
                        { $count: "count" }
                    ]
                }
            },
            {
                $project: {
                    total: { $ifNull: [{ $arrayElemAt: ["$totalJogos.count", 0] }, 0] },
                    finalizados: { $ifNull: [{ $arrayElemAt: ["$finalizados.count", 0] }, 0] },
                    wishlist: { $ifNull: [{ $arrayElemAt: ["$wishlist.count", 0] }, 0] }
                }
            }
        ]);

        if (estatisticas) {
            res.status(200).json(estatisticas[0]);
        }
        else {
            res.status(400).json({ erro: "Não encontrados" });
        }
    }
    catch (error) {
        res.status(500).json({ erro: "Erro ao recuperar dados do dashboard", detail: error.message });
    }
}

const getPlayingGames = async (req, res) => {
    try {

        const response = await GameSchema.aggregate([
            {
                $match: { statusCompra: 'Adquirido', status: 'Jogando' }
            },
            {
                $lookup: {
                    from: "images",
                    let: { game_id: "$_id" }, // Define a variável do ID do jogo
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$gameId", "$$game_id"] }, // Join pelo ID
                                        { $eq: ["$isCover", true] }        // Filtra apenas a capa
                                    ]
                                }
                            }
                        },
                        { $limit: 1 } // Garante que trará apenas uma imagem no array
                    ],
                    as: "fotos"
                }
            },
            {
                $sort: { titulo: 1 }
            }
        ]);

        if (!response || response.length == 0) {
            res.status(400).json({ erro: "Não encontrado" });
        }
        else {
            res.status(200).json(response);
        }
    } catch (error) {
        res.status(500).json({ erro: "Nao foi possivel obter", detail: error.message });
    }
}
module.exports = {
    getAll,
    getById,
    create,
    update,
    getWishlist,
    removeDuplicates,
    getDashboardData,
    getPlayingGames,
}