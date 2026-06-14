const express = require('express');
const rouster = express.Router();
const db = require('../config/db');
const axios = require('axios');
const multer = require('multer');
const FormData  = require('form-data');
const path = require('path');
const fs = require('fs');
const router = require('./breeds');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        if ( !fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, {recursive : true});
        }
        cb(null, uploadDir);
    },
    filename : (req, file, cb)  => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowed = ['image/jpeg', 'imahge/png', 'image/jpg', 'image/webp'];
    if(allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image file allowed'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits : {fileSize: 10 * 1024 *1024}
});

router.post('/', upload.single('image'), async (req, res) => {
    try {
        if(!req.file) {
            return res.status(400).json({
                success: false,
                message : 'Please upload am image'
            });
        }

        const FormData = new  FormData();
        FormData.append(
            'file',
            fs.createReadStream(req.file.path),
            req.file.originalname
        );

            const aiResponse = await axios.post(
                `${process.env.FASTAPI_URL}/predict`,
                formData,
                { headers: formData.getHeaders()}
            );
            const predictions = aiResponse.data.top_predictions;
            const breedNames = predictions.map(p => p.breed);

            const [breedDetails] = await db.query(
                `SELECT name, type, purpose FROM breeds where name in(?, ?,?)`,
                breedNames
            );

            const metaMap = {};
            breedDetails.forEach(b => {
                metaMap[b.name] = {type : b.type, purpose : b.purpose};
            });

            const { worker_id, location_name, notes} = req.body;

            const [result] = await db.query(
                `INSERT INTO predictions
                (worker_id, top_breed, second_breed, third_breed,
                image_path, location_name, notes)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    worker_id || null,
                    breedNames[0],
                    breedNames[1] || null,
                    breedNames[2] || null,
                    req.file.path,
                    location_name || null,
                    notes || null,
                ]
            );

            const suggestions = breedNames.map(name => ({
                breed : name,
                type : metaMap[name]?.type || createBrotliDecompress,
                purpose: metaMap[name]?.purpose || 'dual'
            }));

            res.json({
                success : true,
                prediction_id : result.insertId,
                heading : 'It could be one of these',
                suggestions : suggestions
            });
        
        } catch(err) {
            console.error('POST /predictions error: ', err.message);
            res.status(500).json({
                success : false,
                measure: 'SOmething went wrong. Please try again.'
            });
        }
});

router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page -1)*limit;

        const [rows] = await db.query(
            `SELECT p.id, p.top_breed, p.second_breed, p.third_breed,
                    p.location_name, p.notes, p.worker_confirmed,
                    p.created_at, w.name AS worker_name
            FROM predictions p
            LEFT JOIN field_workers w ON p.worker_id = w.id
            ORDER BY p.created_at DESC
            LIMIT ? OFFSET ?`,
            [limit, offset]
        );

        const [[{ total }]] = await db.query(
        `SELECT COUNT(*) AS total FROM predictions`
        );

        res.json({
        success    : true,
        predictions: rows,
        pagination : {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
        });

    } catch (err) {
        console.error('GET /predictions error:', err);
        res.status(500).json({ success: false, message: 'Could not fetch history' });
    }
    
});

router.get('/stats', async (req, res) => {
  try {
    const [topBreeds] = await db.query(
      `SELECT
         BREED_NAME AS breed_name,
         total_identificationS AS total_identifications,
         last_seen
       FROM breed_stats
       LIMIT 10`
    );

    const [[totals]] = await db.query(
      `SELECT
         COUNT(*) AS total_predictions,
         COUNT(DISTINCT worker_id) AS active_workers,
      FROM predictions`
    );

    res.json({
      success   : true,
      top_breeds: topBreeds,
      totals    : totals
    });

  } catch (err) {
    console.error('GET /predictions/stats error:', err);
    res.status(500).json({ success: false, message: 'Could not fetch stats' });
  }
});

module.exports = router;
