const { Router } = require('express');
const mongoose = require('mongoose');
const Client = require('../models/Client');
const NutritionPlan = require('../models/NutritionPlan');
const NutritionProgress = require('../models/NutritionProgress');

const router = Router();

const isValidPositiveNumber = (value) => Number.isFinite(Number(value)) && Number(value) > 0;
const isValidPlanData = (planData) => (
    planData &&
    typeof planData === 'object' &&
    !Array.isArray(planData) &&
    isValidPositiveNumber(planData.calories) &&
    planData.macros &&
    ['protein', 'carbs', 'fat', 'fiber'].every((key) => (
        Number.isFinite(Number(planData.macros[key])) && Number(planData.macros[key]) >= 0
    )) &&
    Array.isArray(planData.meals)
);

router.get('/plans', async (req, res) => {
    try {
        const plans = await NutritionPlan.find().sort({ createdAt: -1 });
        return res.status(200).json(plans);
    } catch (error) {
        console.error('Erreur de récupération de tous les plans nutritionnels', error);
        return res.status(500).json({ message: 'Impossible de récupérer les plans nutritionnels.' });
    }
});

router.get('/clients/:clientId/plans', async (req, res) => {
    try {
        const { clientId } = req.params;
        if (!mongoose.isValidObjectId(clientId)) {
            return res.status(400).json({ message: 'Identifiant client invalide.' });
        }
        const plans = await NutritionPlan.find({ clientId }).sort({ createdAt: -1 });
        return res.status(200).json(plans);
    } catch (error) {
        console.error('Erreur de récupération des plans nutritionnels', error);
        return res.status(500).json({ message: 'Impossible de récupérer les plans nutritionnels.' });
    }
});

router.post('/plans', async (req, res) => {
    try {
        const { clientId, planData } = req.body || {};
        if (!mongoose.isValidObjectId(clientId)) {
            return res.status(400).json({ message: 'Un client valide est requis.' });
        }
        if (!isValidPlanData(planData)) {
            return res.status(400).json({ message: 'Les données du plan nutritionnel sont incomplètes ou invalides.' });
        }

        if (!await Client.exists({ _id: clientId })) {
            return res.status(404).json({ message: 'Client introuvable.' });
        }

        const savedPlan = await NutritionPlan.create({ clientId, planData });
        return res.status(201).json(savedPlan);
    } catch (error) {
        console.error('Erreur lors de la sauvegarde du plan nutritionnel', error);
        return res.status(500).json({ message: 'Impossible de sauvegarder le plan nutritionnel.' });
    }
});

router.put('/plans/:planId', async (req, res) => {
    try {
        const { planId } = req.params;
        const { clientId, planData } = req.body || {};
        if (!mongoose.isValidObjectId(planId)) {
            return res.status(400).json({ message: 'Identifiant de plan invalide.' });
        }
        if (!mongoose.isValidObjectId(clientId)) {
            return res.status(400).json({ message: 'Un client valide est requis.' });
        }
        if (!isValidPlanData(planData)) {
            return res.status(400).json({ message: 'Les données du plan nutritionnel sont incomplètes ou invalides.' });
        }

        if (!await Client.exists({ _id: clientId })) {
            return res.status(404).json({ message: 'Client introuvable.' });
        }

        const updatedPlan = await NutritionPlan.findByIdAndUpdate(
            planId,
            { clientId, planData },
            { new: true, runValidators: true },
        );
        if (!updatedPlan) {
            return res.status(404).json({ message: 'Plan nutritionnel introuvable.' });
        }
        return res.status(200).json(updatedPlan);
    } catch (error) {
        console.error('Erreur lors de la mise à jour du plan nutritionnel', error);
        return res.status(500).json({ message: 'Impossible de mettre à jour le plan nutritionnel.' });
    }
});

router.delete('/plans/:planId', async (req, res) => {
    try {
        const { planId } = req.params;
        if (!mongoose.isValidObjectId(planId)) {
            return res.status(400).json({ message: 'Identifiant de plan invalide.' });
        }

        const deletedPlan = await NutritionPlan.findByIdAndDelete(planId);
        if (!deletedPlan) {
            return res.status(404).json({ message: 'Plan nutritionnel introuvable.' });
        }
        await NutritionProgress.updateMany({ planId }, { $set: { planId: null } });
        return res.status(200).json({ message: 'Plan nutritionnel supprimé.' });
    } catch (error) {
        console.error('Erreur lors de la suppression du plan nutritionnel', error);
        return res.status(500).json({ message: 'Impossible de supprimer le plan nutritionnel.' });
    }
});

router.get('/clients/:clientId/progress', async (req, res) => {
    try {
        const { clientId } = req.params;
        if (!mongoose.isValidObjectId(clientId)) {
            return res.status(400).json({ message: 'Identifiant client invalide.' });
        }
        const entries = await NutritionProgress.find({ clientId }).sort({ recordedAt: -1 });
        return res.status(200).json(entries);
    } catch (error) {
        console.error('Erreur de récupération du suivi nutritionnel', error);
        return res.status(500).json({ message: 'Impossible de récupérer le suivi nutritionnel.' });
    }
});

router.post('/progress', async (req, res) => {
    try {
        const { clientId, planId, weight, note, recordedAt } = req.body || {};
        if (!mongoose.isValidObjectId(clientId)) {
            return res.status(400).json({ message: 'Un client valide est requis.' });
        }
        if (!Number.isFinite(Number(weight)) || Number(weight) < 20 || Number(weight) > 400) {
            return res.status(400).json({ message: 'Le poids doit être compris entre 20 et 400 kg.' });
        }
        if (note !== undefined && (typeof note !== 'string' || note.length > 1000)) {
            return res.status(400).json({ message: 'La note ne peut pas dépasser 1000 caractères.' });
        }
        if (planId && !mongoose.isValidObjectId(planId)) {
            return res.status(400).json({ message: 'Identifiant de plan invalide.' });
        }
        const parsedDate = recordedAt ? new Date(recordedAt) : new Date();
        if (Number.isNaN(parsedDate.getTime())) {
            return res.status(400).json({ message: 'La date de suivi est invalide.' });
        }
        if (!await Client.exists({ _id: clientId })) {
            return res.status(404).json({ message: 'Client introuvable.' });
        }
        if (planId && !await NutritionPlan.exists({ _id: planId, clientId })) {
            return res.status(404).json({ message: 'Plan nutritionnel introuvable pour ce client.' });
        }

        const entry = await NutritionProgress.create({
            clientId,
            planId: planId || null,
            weight: Number(weight),
            note: note || '',
            recordedAt: parsedDate,
        });
        return res.status(201).json(entry);
    } catch (error) {
        console.error('Erreur lors de l’enregistrement du suivi nutritionnel', error);
        return res.status(500).json({ message: 'Impossible d’enregistrer le suivi nutritionnel.' });
    }
});

module.exports = router;
