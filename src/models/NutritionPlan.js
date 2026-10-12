const mongoose = require('mongoose');

const NutritionPlanSchema = new mongoose.Schema({
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true, index: true },
    planData: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: true, collection: 'nutrition_plans' });

module.exports = mongoose.model('NutritionPlan', NutritionPlanSchema);
