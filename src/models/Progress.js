const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    weight: { type: Number, required: true },
    height: { type: Number, required: true },
    bmi: { type: Number, required: true },
    dailyCalories: { type: Number, required: true }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Progress', ProgressSchema);
