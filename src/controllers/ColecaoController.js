const ColecaoSchema = require('../models/ColecaoSchema');

const getAll = async (req, res) => {
     try {
        const colecoes = await ColecaoSchema.find().sort({ nome: 1 }).exec();

        if (!colecoes) {
            res.status(400).json({});
        }

        for (let cc in colecoes) {
            if (!cc.games) {
                continue;
            }

            let numeroJogos = cc.games.length;
            let finalizados = cc.games.reduce((acc, game) => {
                if (game.status == 'Finalizado')
                    return acc + 1
                return acc;
            }, 0);
            

            let valor = (finalizados / numeroJogos) * 100;

            cc.progresso = valor;
        }

        res.status(200).json(colecoes);
    } catch (error) {
        res.status(400).json({ erro: "Erro ao listar coleções. " + error });
    }   
}
const getId = async (req, res) => {
    try {
        const colecaoId = req.params._id;

        const colecao = await ColecaoSchema.findById(colecaoId).exec();

        res.status(200).json(colecao);
    } catch (error) {
        res.status(400).json({ erro: "Erro ao listar comentários do jogo. " + error });
    }   
};
const create = async (req, res) => {
    try {
        console.log("Create", req.body);

        const colecao = await ColecaoSchema.create(req.body);
        res.status(201).json(colecao);
    }
    catch (error) {
        res.status(400).json({ erro: "Erro ao cadastrar coleção. " + error });
    }   
};

const update = async(req, res) => {
    try {

        const colecaoId = req.params.colecaoId;

         
        const colecaoDeletada = await ColecaoSchema.findByIdAndUpdate(colecaoId);

        if (!colecaoDeletada) {
            return res.status(404).json({ erro: "Coleção não encontrada." });
        }
        res.status(200).json({ mensagem: "Coleção deletada com sucesso." });
    }
    catch (error) {
        res.status(400).json({ erro: "Erro ao deletar coleção. " + error });
    }
}

const remove = async (req, res) => {
    try {
        const colecaoId = req.params.colecaoId;
        
        const colecaoDeletada = await ColecaoSchema.findByIdAndDelete(colecaoId);

        if (!colecaoDeletada) {
            return res.status(404).json({ erro: "Coleção não encontrada." });
        }
        res.status(200).json({ mensagem: "Coleção deletada com sucesso." });
    } catch (error) {
        res.status(400).json({ erro: "Erro ao deletar coleção. " + error });
    }
};

module.exports = {
    getAll,
    getId,
    create,
    update,
    remove
}