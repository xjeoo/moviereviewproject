const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

const pool = require("../db.js");

router.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username.trim() === "" || password.trim() === "")
    return res.status(400).send("Fields missing!");

  const exists = await userExists({ username: username });

  if (!exists) return res.status(401).send("Invalid credentials");

  const [passwordRows] = await pool.execute(
    "SELECT password FROM users WHERE username = ?",
    [username]
  );

  const hashedPassword =
    passwordRows.length > 0 ? passwordRows[0].password : null;

  if (!hashedPassword) return res.status(401).send("Password error");

  const valid = await bcrypt.compare(password, hashedPassword);

  if (!valid) return res.status(401).send("Invalid credentials");

  const newUser = {
    username: username,
    id: 4,
  };
  const access_token = generateAccessToken(newUser);

  const [idRows] = await pool.execute(
    "SELECT user_id FROM users WHERE username = ?",
    [username]
  );
  const userID = idRows.length > 0 ? idRows[0].user_id : null;

  if (!userID) return res.status(401).send("ID error");

  const refresh_token = jwt.sign(
    {
      username: username,
      user_id: userID,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "30m",
    }
  );

  const expirationDate = new Date(Date.now() + 30 * 60 * 1000);

  await setRefreshToken(refresh_token, expirationDate, userID);

  return res.json({
    username: username,
    user_id: userID,
    access_token: access_token,
    access_token_type: "login",
  });
});

router.delete("/logout/:id", async(req, res)=>{
  const userID = req.params.id
  if(userID === undefined) res.status(400).send("User ID required");
  try {
  const [delRows] = await pool.execute("DELETE FROM refresh_tokens WHERE user_id = ?", [userID]);
  if(delRows.length === 0)res.status(500).send("Could't delete token");
  res.status(200).send("Successful deletion")
  } catch (error) {
    
  if(delRows.length === 0)res.status(500).send("Could't delete token");
  }

})

router.post("/register", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username.trim() === "" || password.trim() === "")
    return res.status(400).send("Fields missing!");

  try {
    const exists = await userExists({ username: username });
    if (exists) return res.status(409).send("Username taken");

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      username: username,
      password: hashedPassword,
    };

    try {
      await registerUser(newUser);
      return res.status(201).send("Success");
    } catch (err) {
      return res.status(400).send(err);
    }
  } catch (err) {
    console.log("Registration error", err);
    return res.status(500).send("Server error");
  }
});

router.post("/verify", async (req, res) => {
  const authHeader = req.headers.authorization;
  const userID = req.body.user_id;
  const access_token = authHeader && authHeader.split(" ")[1];
  const refresh_token = await getRefreshTokenByID(userID);
  
  if (!access_token) return res.status(401).send("Access token missing");

  try {
    jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET);
    return res.status(200).send("Access token valid");
  } catch (err) {
    jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(401).send("Refresh token expired");

      const newAccessToken = generateAccessToken({ username: user.username });
      res.status(201).json({
        username: user.username,
        user_id: userID,
        access_token: newAccessToken,
        access_token_type: "refresh",
      });
    });
  }
});

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "5m",
  });
};

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).send("Token missing");

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).send("Token expired");
    req.user = user;
    next();
  });
};

const userExists = async (user) => {
  const username = user.username;
  const [rows] = await pool.execute("SELECT * FROM users WHERE username = ?", [
    username,
  ]);

  return rows.length > 0;
};



const registerUser = async (user) => {
  const username = user.username;
  const password = user.password;
  const [rows] = await pool.execute(
    "INSERT INTO users(username, password) VALUES (?, ?)",
    [username, password]
  );
  console.log("User created", rows);
};

const getRefreshTokenByID = async (userID)=>{
  try {
    const [rows] = await pool.execute("SELECT token FROM refresh_tokens WHERE user_id = ?", [userID]);
    const token = rows.length > 0 ? rows[0].token : null;
    if(token) return token;
    
  } catch (error) {
    return null;
  }
  
}

const setRefreshToken = async (refresh_token, expirationDate, userID) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM refresh_tokens WHERE user_id = ?",
      [userID]
    );
    const exists = rows.length > 0;
    if (exists) {
      const [updateRows] = await pool.execute(
        "UPDATE refresh_tokens SET token = ? , expiration_date = ? WHERE user_id = ?",
        [refresh_token, expirationDate, userID]
      );
    } else {
      const [insertRows] = await pool.execute(
        "INSERT INTO refresh_tokens(token, expiration_date, user_id) VALUES(?, ?, ?)",
        [refresh_token, expirationDate, userID]
      );
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = router;
