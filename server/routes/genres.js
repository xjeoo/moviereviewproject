const express = require("express");

const router = express.Router();

const pool = require("../db.js");

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM genre");
    if (rows.length === 0) return res.status(404).send("No genres found");
    return res.status(200).json(rows);
  } catch (err) {
    return res.status(500).send("Couldn't reach database");
  }
});

router.post("/search", async (req, res) => {
  const input = req.body.input;
  const genre = req.body.genre;

  const finalInput = input.toLowerCase() + "%";
  

  if (!genre || genre === "Any")
 {
    try {
      const [rows] = await pool.execute(
        "SELECT movie_id, movie_name, path, rating, description FROM movie WHERE LOWER(movie_name) LIKE ?",
        [finalInput]
      );
      return res.status(200).json(rows);
    } catch (err) {
      return res.status(500).send(err);
    }
  }
  try {
    const [rows] = await pool.execute(
      `
      SELECT DISTINCT m.movie_id, m.movie_name, m.path, m.rating, m.description FROM movie m 
      JOIN movie_genre mg ON m.movie_id = mg.movie_id 
      JOIN genre g ON mg.genre_id = g.genre_id 
      WHERE LOWER(m.movie_name) LIKE ? AND g.genre_name = ?`,

      [finalInput, genre]
    );
    return res.status(200).json(rows);
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = router;
