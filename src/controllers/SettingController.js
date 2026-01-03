// src/controllers/PsnGameController.js
const SettingService = require('../services/SettingService');
const {connectDB} = require('../config/DbClient');

exports.getAll = async (req, res) => {
    try {
        await connectDB();

        const response = await SettingService.getAll();


        res.status(200).json(response);
    }
    catch (erro) {
        res.status(500).json({erro: "Erro ao realizar busca de settings", stack: erro });
        console.log("Erro ao realizar busca de settings");
    }
}

exports.getById = async (req, res) => {
    try {
        await connectDB();

        const response = await SettingService.getById(req.params.id);

        res.status(200).json(response);
    }
    catch (erro) {
        res.status(500).json({erro: "Erro ao realizar busca de settings", stack: erro });
        console.log("Erro ao realizar busca de settings");
    }
}

exports.create = async(req, res) => {
    try {
        await connectDB();

        await SettingService.create(req.body);
        res.status(201).json({});
    }
    catch (erro) {
        res.status(500).json({erro: "Erro ao cadastrar", stack: erro });
        console.log("Erro ao criar settings", erro);
    }
}

exports.update = async(req, res) => {
    try {
        await connectDB();

        const response  = await SettingService.update(req.params.id, req.body);
        if (!response)
            res.status(404).json({erro: "Setting não encontrada"});

        res.status(200).json(response);
    }
    catch (erro) {
        res.status(500).json({erro: "Erro ao atualizar", stack: erro });
        console.log("Erro ao criar settings", erro);
    }
}
