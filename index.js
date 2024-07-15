import express, { json } from "express";
import cors from "cors";
import getNews from "./news.js";
import {insertNewsToDB} from "./db.js";

const app = express();
app.use(express.json());

// Express CORS
app.use(
    cors({
        origin: "*",
    })
);

// Express allowing methods
app.use(
    cors({
        methods: ["GET", "POST"] //, "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    })
);

// Express headers
app.use(function(req, res, next) {
    if (req.url.pathname !== "/ping"){
        return next();
    }

    if (!req.headers.authorization || req.headers.authorization.split(' ')[1] !== process.env.AUTH) {
      return res.status(403).json({ error: 'Unauthorized!' });
    }

    res.setHeader("Content-Type", "application/json");
    next();
});

app.get("/ping", async function (req, res) {
    res.status(200).send("pong");
});

app.get("/news", async function (req, res) {
    const sources = (req.query.sources || "").split(",");
    const languages = (req.query.language || "english").split(",");
});

// Scraping API
app.post("/scrap-news", async function (req, res) {
    const source = req.query.source || "";
    const language = req.query.language || "english";
    const news = await getNews(source, language);

    if (news.length){
        insertNewsToDB(source, language, news);
    }

    res.status(200).json({"news": news});
});


app.listen(3000, function () {
    console.log("Server started on port http://localhost:3000");
});
export default app;