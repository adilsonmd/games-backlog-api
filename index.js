const express = require('express');
const cors = require('cors'); // 1. Importa o CORS
const routes = require('./src/routes')

const { disconnectDB } = require('./src/config/DbClient');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV === 'production'){
    app.use('/', routes);
}
else {
    app.use('/api', routes);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log('Servidor pronto');
});

// Captura o sinal de interrupção (Ctrl + C)
process.on('SIGINT', async () => {
    await disconnectDB();
    process.exit(0);
});

// Captura o sinal de encerramento (usado por serviços de hospedagem)
process.on('SIGTERM', async () => {
    await disconnectDB();
    process.exit(0);
});