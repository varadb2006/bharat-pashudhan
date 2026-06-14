require('dotenv').config();

const express = require('express');
const cors    = require('cors');

const breedRoutes      = require('./routes/breeds');
const predictionRoutes = require('./routes/predictions');

const app  = express();
const PORT = process.env.PORT || 5000;


app.use(cors({
  origin : ['http://localhost:3000', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/breeds',      breedRoutes);
app.use('/api/predictions', predictionRoutes);


app.get('/health', (req, res) => {
  res.json({
    status : 'online',
    service: 'Bharat Pashudhan Backend',
    version: '1.0.0'
  });
});


app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.url}`
  });
});


app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'An unexpected error occurred'
  });
});


app.listen(PORT, () => {
  console.log(`\n  Bharat Pashudhan Backend`);
  console.log(`  Running on http://localhost:${PORT}`);
  console.log(`  FastAPI at  ${process.env.FASTAPI_URL}\n`);
});