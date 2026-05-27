/**
 * OBSOLETO / DEPRECATED
 * Este schema de usuário não é mais utilizado para autenticação local direta na API.
 * Toda a autenticação e controle de acessos são delegados ao Authelia + LLDAP no servidor.
 */
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

module.exports = mongoose.model('User', UserSchema);