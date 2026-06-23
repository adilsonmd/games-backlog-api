import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema({
    gameId: { type: mongoose.Types.ObjectId, required: true },
    url: { type: String, required: true },
    isCover: { type: Boolean, default: false },
});

export default mongoose.model('Image', ImageSchema);