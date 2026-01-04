const UserSchema = require('../models/UserSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new UserSchema({ username, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "Usuário criado!" });
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    const user = await UserSchema.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
};