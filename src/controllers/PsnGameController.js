// src/controllers/PsnGameController.js
const PsnService = require('../services/PsnService');

const UniversalSearch = async (req, res) => {
    try {
        const data = await PsnService.UniversalSearch(req.query.searchTerm);
        
        res.status(200).json(data);
    }
    catch (error){
        res.status(500).json({
            error: "Ocorreu um erro",
            details: error.message
        });
    }
};

const GetPlayerById = async (req, res) => {
    try {
        const accountId = req.params.userId;

        const response = await PsnService.getPlayerFromAccountId(accountId ?? null);

        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json(error);
    }
}

const GetPlayerByIdBasic = async (req, res) => {
    try {
        const accountId = req.params.userId;

        const response = await PsnService.getPlayerPresence(accountId ?? null);

        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json(error);
    }
}

const GetPlayerByUsername = async (req, res) => {
    try {
        const username = req.params.username;

        const response = await PsnService.getPlayerByUsername(username ?? null);

        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json(error);
    }
}

const GetRecentGames = async (req, res) => {
    try {
        const limit = req.query.limit;
        const categories = req.query.categories;

        let categoriesArray = null;
        if (categories) {
            categoriesArray = new Array(categories);

        }

        if (limit) {
            limit = parseInt(limit);
        }

        const response = await PsnService.getRecentGames(limit, categoriesArray);

        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json(error);
    }
}

const GetOwnedGames = async (req, res) => {
    try {
        let limit = 24;
        let page = 0;

        if (req.query.limit)
            limit = parseInt(req.query.limit);

        if (req.query.page)
            page = parseInt(req.query.page);

        const response = await PsnService.getOwnedGames(limit, page);

        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json(error);
    }
}

module.exports = {
    UniversalSearch,
    GetPlayerById,
    GetPlayerByIdBasic,
    GetPlayerByUsername,
    GetRecentGames,
    GetOwnedGames,
}
