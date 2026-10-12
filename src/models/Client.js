const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['male', 'female'] },
    weight: { type: Number, required: true },
    height: { type: Number, required: true },
    activityLevel: { type: Number, min: 0 },
    targetCalories: { type: Number, min: 0 },
    goal: { 
        type: String, 
        enum: [
            'Prise de masse',
            'Perte de gras',
            'Recomposition corporelle',
            'Maintien de la silhouette',
            'Force maximale',
            'Explosivité & Puissance',
            'Endurance musculaire',
            'Préparation physique spécifique',
            'Réathlétisation',
            'Remise en forme',
            'Posture & Mobilité',
            'Renforcement fonctionnel'
        ],
        required: true 
    },
    phone: { type: String },
    coachId: { type: String },
    lastAttendanceAt: { type: Date },
    sessionDays: { type: [{ type: Number, min: 0, max: 6 }], default: [] },
    attendanceDates: { type: [String], default: [] },
    absentDates: { type: [String], default: [] }
}, {
    timestamps: true
});


module.exports = mongoose.model('Client', ClientSchema);
