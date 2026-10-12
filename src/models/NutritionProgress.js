const mongoose = require('mongoose');

const NutritionProgressSchema = new mongoose.Schema({
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true, index: true },
    planId: { type: mongoose.Schema.Types.ObjectId, ref: 'NutritionPlan', default: null },
    weight: { type: Number, required: true, min: 20, max: 400 },
    note: { type: String, default: '', maxlength: 1000 },
    recordedAt: { type: Date, default: Date.now, required: true }
}, { timestamps: true, collection: 'nutrition_progress' });

module.exports = mongoose.model('NutritionProgress', NutritionProgressSchema);
