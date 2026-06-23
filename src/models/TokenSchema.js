import mongoose from 'mongoose';

const TokenSchema = new mongoose.Schema({
    provider: { type: String, default: 'PSN' },
    authorization: { type: Object },
    updated_at: { type: Date, default: Date.now },
});

export default mongoose.model('Token', TokenSchema);