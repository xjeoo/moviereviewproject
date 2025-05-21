const express = require("express");


const router = express.Router(); 

const pool = require("../db.js");

const verifyToken = require("./auth.js").verifyToken;

router.get("/", async (req, res)=>{ // get reviews for specific movie by movie id
    const movieID = req.query.movieID;

    try {
        const [reviews] = await pool.execute("SELECT * FROM review WHERE movie_id = ?", [movieID]);
        res.status(200).send(reviews);
    } catch (err) {
        res.status(500).send("Error fetching reviews");
    }

})

router.get("/id", async (req, res)=>{ //get review by movie id and user id (poster id)
    const movie_id = req.query.m;
    const poster_id = req.query.p;

    try {
        const [reviews] = await pool.execute("SELECT * FROM review WHERE movie_id = ? AND poster_id = ?", [movie_id, poster_id]);
        const review = reviews.length > 0 ? reviews[0] : null;
        if(review === null) return res.status(404).send("Review doesn't exist");

        return res.status(200).send(review.review_id);
    } catch (err) {
        res.status(500).send("Error fetching reviews");
    }

})


router.post("/post", verifyToken, async (req, res)=>{ // post review
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
router.patch("/edit", verifyToken, async (req,res)=>{ //edit review
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

router.delete("/delete/:reviewID", verifyToken, async (req, res)=>{ //delete review by id
    const reviewID = req.params.reviewID;
    if(reviewID === null || reviewID === undefined) res.status(400).send("Review ID required");

    try {
        const [rows] = await pool.execute("DELETE FROM review WHERE review_id = ?", [reviewID]);
        return res.status(200).send("Review deleted successfuly");
    } catch (err) {
        return res.status(500).send("Database error");
    }
})


module.exports = router;