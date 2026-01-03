// DbClient.js
const mongoose = require('mongoose');

var isConnected = false;

const connectDB = async () => {
  try {
    
    if (isConnected)
      return;

    const uri = process.env.MONGODB_URL
    await mongoose.connect(uri);

    console.log("🟢 Mongodb conectado.")
    isConnected = true;
  } catch (erro) {
    console.error("Erro ao conectar", erro.message);
    process.exit(1);
  }
};

const disconnectDB = async() => {
  try {
    await mongoose.disconnect();
    console.log('Conexão com MongoDB fechada pelo sistema.');
    isConnected = false;
  } catch (erro) {
    console.log("Erro ao desconectar o MongoDB")
  }
}
module.exports = { connectDB, disconnectDB };