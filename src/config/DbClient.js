// DbClient.js
import mongoose from 'mongoose';

var isConnected = false;

export const connectDB = async () => {
  try {

    if (isConnected)
      return;

    const uri = process.env.MONGODB_URL
    await mongoose.connect(uri, {
      // --- CONFIGURAÇÕES DE POOLING ---

      // Número máximo de conexões simultâneas no pool (padrão é 5)
      // Aumente se esperar muito tráfego. Para um projeto médio, 10-20 é ótimo.
      maxPoolSize: 2,

      // Número mínimo de conexões que devem permanecer abertas
      minPoolSize: 1,

      // Tempo máximo (ms) que uma conexão pode ficar ociosa antes de ser fechada
      maxIdleTimeMS: 30000,

      // Tempo de espera para conseguir uma conexão do pool antes de dar erro
      waitQueueTimeoutMS: 5000,

      // --- CONFIGURAÇÕES DE TIMEOUT ---

      // Tempo de espera para estabelecer a conexão inicial
      serverSelectionTimeoutMS: 5000,

      // Tempo de espera por resposta de uma query
      socketTimeoutMS: 45000,
    });

    console.log("🟢 Mongodb conectado.")
    isConnected = true;
  } catch (erro) {
    console.error("Erro ao conectar", erro.message);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('Conexão com MongoDB fechada pelo sistema.');
    isConnected = false;
  } catch (erro) {
    console.log("Erro ao desconectar o MongoDB")
  }
}
