const mongoose = require('mongoose');

const SavedSessionSchema = new mongoose.Schema({
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    sessionDate: { type: Date, default: Date.now, required: true },
    programData: { type: mongoose.Schema.Types.Mixed, required: true }
}, { collection: 'saved_sessions' });

module.exports = mongoose.model('SavedSession', SavedSessionSchema);
