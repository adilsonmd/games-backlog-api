
const autheliaAuth = (req, res, next) => {
  // O Authelia injeta estes headers automaticamente após o login com sucesso
  const username = req.headers['x-authelia-username'];
  const email = req.headers['x-authelia-email'];
  const groups = req.headers['x-authelia-groups']; // Lista de grupos do LLDAP (ex: "admin, users")

  // Garantia extra: Se por algum motivo bizarro o tráfego chegou sem isso, barra.
  if (!username) {
    return res.status(401).json({ error: 'Acesso não autorizado. Autenticação via Proxy necessária.' });
  }

  // Injeta os dados do usuário no objeto 'req' para suas rotas usarem
  req.user = {
    username: username,
    email: email,
    groups: groups ? groups.split(',') : [] // Transforma a string de grupos em Array
  };

  next();
};

module.exports = autheliaAuth;
