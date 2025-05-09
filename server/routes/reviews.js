const express = require("express");


const router = express.Router(); 

const pool = require("../db.js");

router.get("/", async (req, res)=>{
    const movieID = req.query.movieID;

    try {
        const [reviews] = await pool.execute("SELECT * FROM review WHERE movie_id = ?", [movieID]);
        res.status(200).send(reviews);
    } catch (err) {
        res.status(500).send("Error fetching reviews");
    }

})

router.post("/post", async (req, res)=>{
    const movieID = req.body.movie_id;
    const userID = req.body.user_id;
    const rating = req.body.rating;
    const text = req.body.text;

    if( movieID === undefined || userID === undefined) return res.status(400).send("Fields missing");
    if(rating === 0) return res.status(401).send("Rating must be 1-5");

    const [existsReview] = await pool.execute("SELECT * FROM review WHERE poster_id = ? AND movie_ID = ?", [userID, movieID]);
    const exists = existsReview.length > 0 ? existsReview[0] : false;
    if(exists) return res.status(403).send("Movie already reviewed");

    try {
    const [post] = await pool.execute("INSERT INTO review(poster_id, movie_id, rating, comment) VALUES (?, ?, ?, ?)", [userID, movieID, rating, text]);
    return res.status(201).send("Review posted");  
    } catch (err) {
        console.log(err);
        return res.status(500).send("Failed posting review");
    }

})
router.patch("/edit", async (req,res)=>{
    const movieID = req.body.movie_id;
    const userID = req.body.user_id;
    const rating = req.body.rating;
    const text = req.body.text;

    if( movieID === undefined || userID === undefined) return res.status(400).send("Fields missing");
    if(rating === 0) return res.status(401).send("Rating must be 1-5");

    const [existsReview] = await pool.execute("SELECT * FROM review WHERE poster_id = ? AND movie_ID = ?", [userID, movieID]);
    const exists = existsReview.length > 0 ? existsReview[0] : false;
    if(!exists) return res.status(404).send("Movie has not been reviewed");

    try {
    const [post] = await pool.execute(
        "UPDATE review SET rating= ? , comment= ? WHERE movie_id= ? AND poster_id= ?", [rating, text, movieID, userID]
    );
    return res.status(200).send("Review edited");  
    } catch (err) {
        console.log(err);
        return res.status(500).send("Failed editing review");
    }

})


module.exports = router;