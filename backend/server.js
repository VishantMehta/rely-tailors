const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
connectDB();
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const measurementRoutes = require('./routes/measurementRoutes');
const app = express();

app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/measurements', measurementRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));