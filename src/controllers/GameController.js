const GameSchema = require('../models/GameSchema');
const { connectDB } = require('../config/DbClient')

exports.getAll = async (req, res) => {
    try {
        const page = Number(req.query.page) || 0;
        const limit = Number(req.query.limit) || 25;

        const q = req.query.q || null;

        console.log("[GameController] busca jogos. q=" + q);

        await connectDB();

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
        console.log(`[GameController] Listando jogos. queryMongo=${JSON.stringify(queryMongo)} Page: ${page} Limit: ${limit}`);

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
        res.status(200).json(json);
    } catch (error) {
        res.status(400).json({ erro: "Erro ao listar jogos. " + error });
    }
};

exports.getById = async (req, res) => {
    try {
        await connectDB();

        const response = await GameSchema.findById(req.params.id);

        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ erro: "Erro ao listar jogos" });
    }
};

exports.create = async (req, res) => {
    try {
        await connectDB();

        const novoJogo = await GameSchema.create(req.body);
        res.status(201).json(novoJogo);
    } catch (error) {
        res.status(400).json({ erro: "Erro ao cadastrar jogo. " + error });
    }
};

exports.update = async (req, res) => {
    try {
        await connectDB();

        const game = await GameSchema.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        if (!game) {
            res.status(404).json({ erro: "Jogo não encontrado" });
        }
        res.status(200).json(game);
    } catch (error) {
        res.status(500).json({ erro: "Erro ao cadastrar jogo" });
    }
};

exports.getWishlist = async (req, res) => {
    try {
        await connectDB();

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

        console.log(`[GameController] Lista Wishlist: ${response.length} jogos encontrados.`);

        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ erro: "Erro ao listar jogos da wishlist", details: error });
    }
};