const { Router } = require('express');
const Client = require('../models/Client');

const router = Router();

const getLocalDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

router.post('/', async (req, res) => {
    try {
        const { name, age, gender, weight, height, goal, phone, activityLevel, targetCalories, sessionDays = [] } = req.body;
        const newClient = new Client({ name, age, gender, weight, height, goal, phone, activityLevel, targetCalories, sessionDays });
        const savedClient = await newClient.save();
        res.status(201).json(savedClient);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout", error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const clients = await Client.find();
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ message: "Erreur de récupération", error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { name, age, gender, weight, height, goal, activityLevel, targetCalories, sessionDays } = req.body;
        const client = await Client.findByIdAndUpdate(
            req.params.id,
            { name, age, gender, weight, height, goal, activityLevel, targetCalories, sessionDays },
            { new: true, runValidators: true }
        );

        if (!client) {
            return res.status(404).json({ message: "Client introuvable" });
        }

        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la modification du client", error: error.message });
    }
});

router.put('/:id/attendance', async (req, res) => {
    try {
        const attendanceDate = req.body?.attendanceDate || getLocalDateKey(new Date());
        const status = req.body?.status || 'attended';
        if (!/^\d{4}-\d{2}-\d{2}$/.test(attendanceDate) ||
            new Date(`${attendanceDate}T00:00:00.000Z`).toISOString().slice(0, 10) !== attendanceDate) {
            return res.status(400).json({ message: "La date de présence est invalide" });
        }
        if (!['attended', 'absent'].includes(status)) {
            return res.status(400).json({ message: "Le statut de présence est invalide" });
        }

        const update = status === 'attended'
            ? {
                $set: { lastAttendanceAt: new Date() },
                $addToSet: { attendanceDates: attendanceDate },
                $pull: { absentDates: attendanceDate }
            }
            : {
                $addToSet: { absentDates: attendanceDate },
                $pull: { attendanceDates: attendanceDate }
            };
        const client = await Client.findByIdAndUpdate(
            req.params.id,
            update,
            { new: true, runValidators: true }
        );

        if (!client) {
            return res.status(404).json({ message: "Client introuvable" });
        }

        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'enregistrement de la présence", error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const client = await Client.findByIdAndDelete(req.params.id);

        if (!client) {
            return res.status(404).json({ message: "Client introuvable" });
        }

        res.status(200).json({ message: "Client supprimé" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du client", error: error.message });
    }
});

module.exports = router;
