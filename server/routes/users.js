const express = require("express");


const router = express.Router(); 

const pool = require("../db.js")

const users = require("../data/user.js")

router.get("/", async (req, res)=>{
    try {
        const [rows] = await pool.execute("SELECT * FROM users");
        return res.status(200).json(rows);
    } catch (error) {
        return res.status(500).send("Error fetching users")
    }
    
})

module.exports = router;
