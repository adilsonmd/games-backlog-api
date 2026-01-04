const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Padrão "Bearer TOKEN"
    
    if (!token) return res.status(401).json({ error: "Acesso negado" });
    
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Adiciona os dados do usuário na requisição
        next();
    } catch (err) {
        console.log("Token inválido:", err);
        res.status(403).json({ error: "Token inválido" });
    }
};