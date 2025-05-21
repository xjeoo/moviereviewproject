const express = require("express");

const router = express.Router();

const pool = require("../db.js");

router.get("/movie", async (req, res) => { // get movie info by movie name(path)
  const name = req.query.name;
  if (!name) return res.status(400).send("Name query required");

  const [rows] = await pool.execute("SELECT * FROM movie WHERE path = ?", [
    name,
  ]);

  if (rows.length === 0) return res.status(404).send("Movie not found");

  const info = rows[0];

  const [genreRows] = await pool.execute( // get movie genres by movie id
    `SELECT g.genre_id, g.genre_name
     FROM genre g
     JOIN movie_genre mg ON g.genre_id = mg.genre_id
     WHERE mg.movie_id = ?`,
    [info.movie_id]
  );

  const genres = genreRows.length > 0 ? genreRows : null;

  const imgUrl = `/images/posters/${name}.jpg`;

  const fullUrl = req.protocol + "://" + req.get("host") + imgUrl;

  const completeInfo = genres
    ? { ...info, url: fullUrl, genres: genres }
    : { ...info, url: fullUrl };
  res.json(completeInfo);
});

router.get("/names", async (req, res) => { // get names by offset and limit for homepage
  let offset = parseInt(req.query.offset) || 0;
  let limit = parseInt(req.query.limit) || 5;
  let limitReached = false;
  try {
    const [rows] = await pool.execute("SELECT COUNT(*) AS total from movie");
    const totalMovies = rows[0].total;
    if (offset + limit > totalMovies) {
      limit = totalMovies - offset;
      limitReached = true;
    }
    if (offset >= totalMovies) limitReached = true;
    const [limitedRows] = await pool.execute(
      "SELECT movie_name, path, rating FROM  movie LIMIT ? OFFSET ?",
      [limit.toString(), offset.toString()]
    );
    res.json({ movies: limitedRows, limitReached: limitReached });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error fetching movies");
  }
});

module.exports = router;
