const {
    exchangeNpssoForAccessCode,
    exchangeAccessCodeForAuthTokens,
    exchangeRefreshTokenForAuthTokens,

    getBasicPresence,
    makeUniversalSearch,
    getRecentlyPlayedGames,
    getProfileFromUserName,
    getProfileFromAccountId,
    getPurchasedGames,
} = require('psn-api');

require('dotenv').config();

const Token = require('../models/TokenSchema');

// Token gerado e obtido.
// Logar com conta em: https://www.playstation.com/pt-br/
// Abrir link: https://ca.account.sony.com/api/v1/ssocookie

async function getValidToken() {

    const tokenDoc = await Token.findOne({ provider: 'PSN' });

    if (tokenDoc && tokenDoc.authorization) {

        if (new Date(tokenDoc.authorization.expiresIn) > new Date())
            return tokenDoc.authorization;
        else {

            // Atribuímos o resultado a uma constante primeiro
            const refreshedAuth = await exchangeRefreshTokenForAuthTokens(tokenDoc.authorization.refreshToken);

            await Token.findOneAndUpdate(
                { provider: 'PSN' },
                { authorization: refreshedAuth }, // Usamos a constante criada acima
                { upsert: true }
            );

            return refreshedAuth;
        }
    }

    // Se expirou, renova (ou usa o refreshToken se a psn-api suportar)
    const NPSSO = process.env.NPSSO;
    const accessCode = await exchangeNpssoForAccessCode(NPSSO);
    const authorization = await exchangeAccessCodeForAuthTokens(accessCode);

    // Atualiza no banco
    await Token.findOneAndUpdate(
        { provider: 'PSN' },
        {
            authorization
        },
        { upsert: true }
    );

    return authorization;
}

// http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=XXXXXXXXXXXXXXXXX&steamid=76561197960434622&format=json
async function UniversalSearch(searchTerm) {
    try {

        const authorization = await getValidToken();

        const response = await makeUniversalSearch(authorization, searchTerm, 'SocialAllAccounts');

        return response;
    } catch (error) {
        console.error("Erro ao buscar dados da PSN:", error.message);
        console.error(error);
        // Em caso de erro, você pode lançar uma exceção ou retornar um objeto de erro
        throw new Error("Falha na comunicação com a API PSN.");
    }
}


async function getPlayerFromAccountId(accountId = 'me') {
    try {

        const authorization = await getValidToken();
        const response = await getProfileFromAccountId(authorization, accountId);

        return response;
    } catch (error) {
        console.error("Erro ao buscar User stats for game da PSN:", error.message);
        // Em caso de erro, você pode lançar uma exceção ou retornar um objeto de erro
        throw new Error("Falha na comunicação com a API PSN.");
    }
}

// Informações basicas
async function getPlayerPresence(accountId = 'me') {
    try {

        const authorization = await getValidToken();
        const response = await getBasicPresence(authorization, accountId);

        return response;
    } catch (error) {
        console.error("Erro ao buscar User stats for game da PSN:", error.message);
        // Em caso de erro, você pode lançar uma exceção ou retornar um objeto de erro
        throw new Error("Falha na comunicação com a API PSN.");
    }
}

async function getPlayerByUsername(username = 'dilsu_md') {
    try {
        const authorization = await getValidToken();

        const response = await getProfileFromUserName(authorization, username);

        return response;
    } catch (error) {
        console.log("Erro ao obter usuario. ", error);
    }
}
async function getRecentGames(limit, categories) {
    try {
        const authorization = await getValidToken();

        const response = await getRecentlyPlayedGames(authorization, {
            limit: limit ?? 10,
            categories: categories ?? ['ps5_native_game']
        });

        return response;
    } catch (error) {
        console.log("Erro ao obter jogos recentes. ", error);
    }
}

async function getOwnedGames(limit = 25, page = 0, sortBy = 'ACTIVE_DATE', sortDirection = 'desc') {
    try {
        const authorization = await getValidToken();



        const response = await getPurchasedGames(authorization, { size: limit, start: page * limit, sortBy: sortBy, sortDirection: sortDirection });

        return response
    } catch (error) {
        console.log("Erro ao obter jogos adquiridos. ", error);
    }
}

module.exports = {
    UniversalSearch,
    getPlayerFromAccountId,
    getPlayerPresence,
    getPlayerByUsername,
    getRecentGames,
    getOwnedGames
};