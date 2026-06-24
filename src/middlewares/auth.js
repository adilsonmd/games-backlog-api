import * as jose from 'jose'

export const verifyJWT = async (req, res, next) => {
    console.log("verificando");

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Padrão "Bearer TOKEN"
    
    if (!token) return res.status(401).json({ error: "Acesso negado" });
    
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload, protectedHeader } = await jose.jwtVerify(token, secret);

        req.user = payload;
        next();
    } catch (err) {
        console.log("Token inválido:", err);
        res.status(403).json({ error: "Token inválido" });
    }
}

export const signJWT = async (userId) => {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

     try {

         const token = await new jose.SignJWT({})
         .setProtectedHeader({ alg: 'HS256' })
         .setSubject(userId.toString())
         .setIssuedAt()
         .setExpirationTime('2h')
         .sign(secret);

         return token;
         
    } catch (ex) {
        console.log(ex);
        return null;
    }
}