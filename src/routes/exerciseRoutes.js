const { Router } = require('express');
const Exercise = require('../models/Exercise');

const router = Router();

router.post('/', async (req, res) => {
    try {
        const { name, category, description, videoUrl } = req.body;
        const newExercise = new Exercise({ name, category, description, videoUrl });
        const savedExercise = await newExercise.save();
        res.status(201).json(savedExercise);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création", error });
    }
});

router.get('/', async (req, res) => {
    try {
        const exercises = await Exercise.find();
        res.status(200).json(exercises);
    } catch (error) {
        res.status(500).json({ message: "Erreur de récupération", error });
    }
});

module.exports = router;
