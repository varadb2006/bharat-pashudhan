const express = require("express");

const router = express.Router();
const db = require("../config/db");

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      `Select id, name, type, origin_state, purpose, description,physical_traits
            From breeds
            Order by type, name`,
    );

    res.json({
      success: true,
      count: rows.length,
      breeds: rows,
    });
  } catch (err) {
    console.error("GET /breeds error:", err);
    res.status(500).json({
      success: false,
      message: "Could not fetch breeds",
    });
  }
});

router.get("/:name", async (req, res) => {
  try {
    const breedName = req.params.name;
    const [rows] = await db.query(
      `SELECT * FROM breeds WHERE name = ? LIMIT 1`,
      [breedName],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Breed not found: ${breedName}`,
      });
    }

    const [sightings] = await db.query(
      `SELECT
         total_identificationS AS total_identifications,
         confirmed_correct,
         confirmed_wrong,
         last_seen
       FROM breed_stats
       WHERE BREED_NAME = ?`,
      [breedName],
    );

    res.json({
      success  : true,
      breed    : rows[0],
      sightings: sightings[0] || {
        total_identifications: 0,
        confirmed_correct: 0,
        confirmed_wrong: 0,
        last_seen: null
      }
  });

  } catch (err) {
    console.log("Get /breeds/:name error: ", err);
    res.status(500).json({
      success: false,
      message: "Could not fetch breed details",
    });
  }
});

module.exports = router;
