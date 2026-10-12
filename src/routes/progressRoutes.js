const { Router } = require('express');
const Progress = require('../models/Progress');

const router = Router();

router.post('/', async (req, res) => {
    try {
        const { clientId, weight, height, age, gender } = req.body;

        const heightInMeters = height / 100;
        const bmi = parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(2));

        let dailyCalories = 0;
        if (gender === 'male') {
            dailyCalories = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
        } else {
            dailyCalories = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
        }
        dailyCalories = Math.round(dailyCalories);

        const newProgress = new Progress({
            clientId,
            weight,
            height,
            bmi,
            dailyCalories
        });

        const savedProgress = await newProgress.save();
        res.status(201).json(savedProgress);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors du calcul", error: error.message });
    }
});

router.get('/:clientId', async (req, res) => {
    try {
        const history = await Progress.find({ clientId: req.params.clientId }).sort({ createdAt: -1 });
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération", error: error.message });
    }
});

module.exports = router;
