import mongoose from 'mongoose';

const SettingSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    value: { type: String },
    description: { type: String }
});

export default mongoose.model('Setting', SettingSchema);