const { Router } = require('express');
const Program = require('../models/Program');

const router = Router();

router.post('/', async (req, res) => {
    try {
        const {
            title,
            description,
            difficulty,
            clientId,
            routine,
            routineDay,
            exercises
        } = req.body;
        const newProgram = new Program({
            title,
            description,
            difficulty,
            clientId,
            routine,
            routineDay,
            exercises
        });
        const savedProgram = await newProgram.save();
        res.status(201).json(savedProgram);
    } catch (error) {
        res.status(500).json({ message: "Erreur", error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const programs = await Program.find()
            .populate('clientId')
            .populate('exercises.exerciseId');
        res.status(200).json(programs);
    } catch (error) {
        res.status(500).json({ message: "Erreur", error: error.message });
    }
});

module.exports = router;
