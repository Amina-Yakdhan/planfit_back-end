const dns = require('node:dns'); dns.setServers(['8.8.8.8', '1.1.1.1']);
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const { connectDB } = require('./config/db');
const clientRoutes = require('./routes/clientRoutes');
const progressRoutes = require('./routes/progressRoutes');   
const exerciseRoutes = require('./routes/exerciseRoutes');   
const programRoutes = require('./routes/programRoutes');     
const authRoutes = require('./routes/authRoutes');
const fitnessPlanRoutes = require('./routes/fitnessPlanRoutes');
const savedSessionRoutes = require('./routes/savedSessionRoutes');
const nutritionRoutes = require('./routes/nutritionRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

connectDB();

app.use('/api/clients', clientRoutes);
app.use('/api/progress', progressRoutes);   
app.use('/api/exercises', exerciseRoutes);   
app.use('/api/programs', programRoutes);     
app.use('/api/auth', authRoutes);
app.use('/api', fitnessPlanRoutes);
app.use('/api/saved-sessions', savedSessionRoutes);
app.use('/api/nutrition', nutritionRoutes);

app.get('/', (req, res) => {
    res.send('PlanFit API is running smoothly in JavaScript...');
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
