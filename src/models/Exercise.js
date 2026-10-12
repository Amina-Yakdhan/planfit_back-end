const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    category: { 
        type: String, 
        enum: ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Abs', 'Cardio'], 
    },
    description: { type: String },
    videoUrl: { type: String }
});

module.exports = mongoose.model('Exercise', ExerciseSchema);
