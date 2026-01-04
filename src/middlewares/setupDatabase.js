const {connectDB} = require('../config/DbClient');
const mongoose = require('mongoose');

module.exports = async (req, res, next) => {
    await connectDB();

    // 0: disconnected, 1: connected, 2: connecting, 3: disconnecting
    const state = mongoose.connection.readyState;

    if (state === 1) {
        // Banco está pronto, segue para o controller
        return next();
    }

    if (state === 2) {
        // Banco ainda está conectando, podemos esperar um pouco ou retornar erro
        console.warn("[Middleware] Banco de dados ainda está conectando...");
        return res.status(503).json({ 
            error: "Servidor em inicialização. Tente novamente em instantes." 
        });
    }

    // Se estiver desconectado (0) ou desconectando (3)
    console.error("[Middleware] Erro: Sem conexão com MongoDB.");
    return res.status(500).json({ 
        error: "Erro de conexão com o banco de dados." 
    });
};