/** DEPRECATED - Agora autenticação é feita por Conteiner docker "Authelia" junto com LLDAP */
import * as jose from 'jose'

import UserSchema from '../../models/UserSchema.js';
import bcrypt from 'bcryptjs';
import { signJWT } from "../../middlewares/auth.js";

// const register = async (req, res) => {
//     const { username, password } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = new UserSchema({ username, password: hashedPassword });
//     await user.save();
//     res.status(201).json({ message: "Usuário criado!" });
// };

const login = async (req, res) => {
    const { username, password } = req.body;
    const user = await UserSchema.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Credenciais inválidas" });
    }
    
    const token = await signJWT(user._id);

    res.json({token});
};

export default {
    register,
    login
};
