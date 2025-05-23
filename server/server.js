require("dotenv").config()


const express = require("express");
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors({
    origin: "https://moviereviewproject-production.up.railway.app/", // frontend URL
    credentials: true
  }));
app.use(express.json())
app.use("/images/posters", express.static(path.join(__dirname, "images", "posters")));

const userRouter = require("./routes/users.js")
const authRouter = require("./routes/auth.js").router;
const movieRouter = require("./routes/movies.js")
const reviewRouter = require("./routes/reviews.js")
const genreRouter = require("./routes/genres.js")

app.get("/", (req,res)=>{
    res.send("Hello");
})

app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/movies", movieRouter);
app.use("/reviews", reviewRouter);
app.use("/genres", genreRouter);

app.listen(3000);