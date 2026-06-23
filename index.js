import express from 'express';
import cors from 'cors'; // 1. Importa o CORS
import routes from './src/routes/index.js';

import { disconnectDB } from './src/config/DbClient.js';

const app = express();

const whiteListCors = ['https://games.athomushub.com.br'];

if (process.env.NODE_ENV == 'dev') {
  whiteListCors.push('http://localhost:5173');
}

const corsOptions = {
  origin: function (origin, callback) {
    // O '!origin' permite requisições server-to-server ou ferramentas como Postman (onde o origin é undefined)
    if (!origin || whiteListCors.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Bloqueado pelo CORS: Origem não permitida.'));
    }
  }
};

// Aplica o CORS com as opções configuradas para todas as rotas
app.use(cors(corsOptions));

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