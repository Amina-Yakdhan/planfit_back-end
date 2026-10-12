const { Router } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Coach = require('../models/Coach');
const JWT_SECRET = require('../config/jwt');

const router = Router();

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const exists = await Coach.findOne({ email });
        if (exists) return res.status(400).json({ message: "Email déjà utilisé !" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newCoach = new Coach({ name, email, password: hashedPassword });
        
        await newCoach.save();
        res.status(201).json({ message: "Coach créé avec succès !" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const coach = await Coach.findOne({ email });
        if (!coach) return res.status(400).json({ message: "Infos incorrectes !" });

        const isMatch = await bcrypt.compare(password, coach.password);
        if (!isMatch) return res.status(400).json({ message: "Infos incorrectes !" });

        const token = jwt.sign({ id: coach._id }, JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ token, coach: { name: coach.name, email: coach.email } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
