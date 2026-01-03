const { connectDB } = require("../config/DbClient");
const SettingSchema = require("../models/SettingSchema");

async function getAll() {
    try {
        const allSettings = await SettingSchema.find();
        
        console.log(allSettings);

        return allSettings;
    } catch (error) {
        console.log(error);
    }
}

async function getById(id) {
    try {
        const allSettings = await SettingSchema.findById(id);

        return allSettings;
    } catch (error) {
        console.log(error);
    }
}

async function create(setting) {
    try {
        const model = new SettingSchema(setting);

        const salvo = await model.save();

        return salvo;
    } catch(erro) {
        console.log(erro);
    }
}

async function update(id, body) {
    try {
        const setting = await SettingSchema.findByIdAndUpdate(id, body, { new: true, runValidators: true });

        return setting; 
    } catch(erro) {
        console.log(erro);
    }
}

async function getSetting(key) {
    try {
        await connectDB();
        const setting = await SettingSchema.findOne({ key: key });
        return setting?.value ?? null;
    }catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    getSetting
}