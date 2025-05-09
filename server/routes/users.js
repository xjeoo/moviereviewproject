const express = require("express");


const router = express.Router(); 

const pool = require("../db.js")

router.get("/", async (req, res)=>{
    const id = req.query.id;
    try {
        const [rows] = await pool.execute("SELECT username FROM users WHERE user_id = ?", [id]);
        if(rows.length === 0) return res.status(404).send("User doesn't exist");
        const username = rows[0].username;
        return res.status(200).json(username);
    } catch (error) {
        return res.status(500).send("Error fetching users")
    }
    
})

module.exports = router;
