// src/controllers/SteamGameController.js
const SteamService = require('../services/SteamService');
const GameSchema = require("../models/GameSchema");
const connectDB = require("../config/DbClient");


exports.SteamPlayerInfo = async (req, res) => {
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

exports.SteamAllGames = async (req, res) => {
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

exports.SteamCreateGame = async (req, res) => {
    try {

        connectDB();

        const newGame = new GameSchema(req.body);
        console.log("Teste: ", newGame);
        await newGame.save();

        res.status(201).json({});
    }
    catch (erro) {
        res.status(500).json({
            error: "Ocorreu um erro ao cadastrar jogo.",
            details: erro.message,
        })
    }
};


