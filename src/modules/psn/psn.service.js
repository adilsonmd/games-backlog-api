const {
    exchangeNpssoForAccessCode,
    exchangeAccessCodeForAuthTokens,
    exchangeRefreshTokenForAuthTokens,
    getBasicPresence,
    makeUniversalSearch,
    getRecentlyPlayedGames,
    getProfileFromUserName,
    getProfileFromAccountId,
    getPurchasedGames
} = require('psn-api');

require('dotenv').config();

const Token = require('../../models/TokenSchema');

async function getValidToken() {
    // Busca "cache" do token no MongoDB
    const tokenDoc = await Token.findOne({ provider: 'PSN' });

    if (tokenDoc && tokenDoc.authorization) {

        // Se o token ainda é válido:
        if (new Date(tokenDoc.authorization.expiresIn) > new Date()) {
            return tokenDoc.authorization;
        }
        // Se o token tem refreshToken preenchido:
        else if (tokenDoc?.authorization?.refreshToken !== null) {
            const refreshedAuth = await exchangeRefreshTokenForAuthTokens(tokenDoc.authorization.refreshToken);

            await Token.findOneAndUpdate(
                { provider: 'PSN' },
                { authorization: refreshedAuth },
                { upsert: true }
            );

            return refreshedAuth;
        }
    }

    // Autenticação padrão
    const NPSSO = process.env.NPSSO;
    const accessCode = await exchangeNpssoForAccessCode(NPSSO);
    const authorization = await exchangeAccessCodeForAuthTokens(accessCode);

    await Token.findOneAndUpdate(
        { provider: 'PSN' },
        { authorization },
        { upsert: true }
    );

    return authorization;
}

async function UniversalSearch(searchTerm) {
    try {
        const authorization = await getValidToken();
        const response = await makeUniversalSearch(authorization, searchTerm, 'SocialAllAccounts');
        return response;
    } catch (error) {
        console.error("Erro ao buscar dados da PSN:", error.message);
        console.error(error);
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
        throw new Error("Falha na comunicação com a API PSN.");
    }
}

async function getPlayerPresence(accountId = 'me') {
    try {
        const authorization = await getValidToken();
        const response = await getBasicPresence(authorization, accountId);
        return response;
    } catch (error) {
        console.error("Erro ao buscar User stats for game da PSN:", error.message);
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

        return response;
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
