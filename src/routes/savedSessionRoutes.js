const { Router } = require('express');
const mongoose = require('mongoose');
const Client = require('../models/Client');
const SavedSession = require('../models/SavedSession');

const router = Router();

router.post('/', async (req, res) => {
    try {
        const { clientId, programData } = req.body;

        if (!mongoose.isValidObjectId(clientId)) {
            return res.status(400).json({ message: 'Un client valide est requis.' });
        }
        if (!programData || typeof programData !== 'object' || Array.isArray(programData)) {
            return res.status(400).json({ message: 'Les données du programme doivent être un objet JSON.' });
        }
        if (!await Client.exists({ _id: clientId })) {
            return res.status(404).json({ message: 'Client introuvable.' });
        }

        const savedSession = await SavedSession.create({ clientId, programData });
        return res.status(201).json(savedSession);
    } catch (error) {
        console.error('Erreur lors de l’enregistrement de la séance', error);
        return res.status(500).json({ message: 'Impossible d’enregistrer la séance.' });
    }
});

router.put('/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { clientId, programData } = req.body;

        if (!mongoose.isValidObjectId(sessionId)) {
            return res.status(400).json({ message: 'Identifiant de séance invalide.' });
        }
        if (!mongoose.isValidObjectId(clientId)) {
            return res.status(400).json({ message: 'Un client valide est requis.' });
        }
        if (!programData || typeof programData !== 'object' || Array.isArray(programData)) {
            return res.status(400).json({ message: 'Les données du programme doivent être un objet JSON.' });
        }
        if (!await Client.exists({ _id: clientId })) {
            return res.status(404).json({ message: 'Client introuvable.' });
        }

        const savedSession = await SavedSession.findById(sessionId);
        if (!savedSession) {
            return res.status(404).json({ message: 'Séance introuvable.' });
        }

        savedSession.clientId = clientId;
        savedSession.programData = programData;
        await savedSession.save();
        return res.status(200).json(savedSession);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la séance', error);
        return res.status(500).json({ message: 'Impossible de mettre à jour la séance.' });
    }
});

router.delete('/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;
        if (!mongoose.isValidObjectId(sessionId)) {
            return res.status(400).json({ message: 'Identifiant de séance invalide.' });
        }

        const deletedSession = await SavedSession.findByIdAndDelete(sessionId);
        if (!deletedSession) {
            return res.status(404).json({ message: 'Séance introuvable.' });
        }

        return res.status(200).json({ message: 'Fiche récapitulative supprimée.' });
    } catch (error) {
        console.error('Erreur lors de la suppression de la séance', error);
        return res.status(500).json({ message: 'Impossible de supprimer cette fiche récapitulative.' });
    }
});

router.get('/count', async (req, res) => {
    try {
        const count = await SavedSession.countDocuments();
        return res.status(200).json({ count });
    } catch (error) {
        console.error('Erreur lors du comptage des séances enregistrées', error);
        return res.status(500).json({ message: 'Impossible de compter les séances enregistrées.' });
    }
});

router.get('/client/:clientId', async (req, res) => {
    try {
        const { clientId } = req.params;
        if (!mongoose.isValidObjectId(clientId)) {
            return res.status(400).json({ message: 'Identifiant client invalide.' });
        }

        const sessions = await SavedSession.find({ clientId })
            .select('_id clientId sessionDate')
            .sort({ sessionDate: -1 });
        return res.status(200).json(sessions);
    } catch (error) {
        console.error('Erreur lors de la récupération de l’historique des séances', error);
        return res.status(500).json({ message: 'Impossible de récupérer l’historique des séances.' });
    }
});

router.get('/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;
        if (!mongoose.isValidObjectId(sessionId)) {
            return res.status(400).json({ message: 'Identifiant de séance invalide.' });
        }

        const session = await SavedSession.findById(sessionId).populate('clientId', 'name goal');
        if (!session) {
            return res.status(404).json({ message: 'Séance introuvable.' });
        }
        return res.status(200).json(session);
    } catch (error) {
        console.error('Erreur lors de la récupération de la séance', error);
        return res.status(500).json({ message: 'Impossible de récupérer la séance.' });
    }
});

module.exports = router;
