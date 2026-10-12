const mongoose = require('mongoose');

const ProgramSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
    routine: { type: String },
    routineDay: { type: String },
    exercises: [{
        exerciseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Exercise',
            required() { return !this.exerciseName; }
        },
        exerciseName: {
            type: String,
            required() { return !this.exerciseId; }
        },
        exerciseType: { type: String },
        targetMuscle: { type: String },
        routineDay: { type: String },
        sets: { type: Number, required: true },
        reps: { type: String, required: true },
        setDetails: [{
            order: { type: Number, required: true },
            reps: { type: Number, required: true },
            weight: { type: Number, required: true },
            weightLabel: { type: String }
        }],
        note: { type: String },
        calculated1RM: { type: Number },
        targetLoad: { type: String },
        targetPercent: { type: String },
        goal: { type: String },
        restTime: { type: String },
        focus: { type: String }
    }]
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Program', ProgramSchema);
