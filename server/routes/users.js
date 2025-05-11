const express = require("express");


const router = express.Router(); 

const pool = require("../db.js")

router.get("/", async (req, res)=>{
    const id = req.query.id;
    try {
        const [rows] = await pool.execute("SELECT username, user_id FROM users WHERE user_id = ?", [id]);
        if(rows.length === 0) return res.status(404).send("User doesn't exist");
        const username = rows[0].username;
        const user_id = rows[0].user_id;
        return res.status(200).json({username: username, user_id: user_id});
    } catch (error) {
        return res.status(500).send("Error fetching users")
    }
    
})

router.get("/:id/reviews", async (req,res)=>{
    const userID = req.params.id;
    
    try {
        const [rows] = await pool.execute(`
        SELECT * FROM movie WHERE movie_id IN (
            SELECT movie_id FROM review WHERE poster_id = ?)`
        , [userID])

        return res.status(200).json(rows);

    } catch (error) {
        console.log(error);
        return res.status(500).send("Failed fetching reviewed movies");
    }
    
})

module.exports = router;
