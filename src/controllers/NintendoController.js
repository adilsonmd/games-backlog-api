const NintendoService = require('../services/NintendoService');
const { connectDB } = require('../config/DbClient');
const SettingService = require('../services/SettingService');
exports.GetNSOLogin = (req, res) => {
    try {
        const response = NintendoService.getNSOLogin();

        res.status(200).json({ response});
    } catch (error) {
        res.status(500).json({
            error: "Ocorreu um erro",
            details: error.message
        });
    }
};

exports.getSessionTokenCode = (req, res) => {
    try {
        const url = req.body.url;
        const response = NintendoService.getSessionTokenCode(url);

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            error: "Ocorreu um erro",
            details: error.message
        });
    }
};

exports.getSessionToken = async (req, res) => {
    try {
        await connectDB();

        
        const session_token_code = req.body.session_token_code;
        const codeVerifier = req.body.state;

        const token = await NintendoService.getSessionToken(session_token_code, codeVerifier);
        res.status(200).json(token);
    } catch (error) {
        res.status(500).json({
            error: "Ocorreu um erro",
            details: error.message
        });
    }
}