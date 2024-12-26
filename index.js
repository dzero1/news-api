import dotenv from 'dotenv';
dotenv.config({ path: '.env.dev' });


import express from "express";
import cors from "cors";
import getNews from "./news.js";
import {deleteAll, getNewsCache, insertAllToDB, insertNewsToDB, connectDB} from "./db.js";

// console.log(process.env)
// console.log(process.env.db)

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
    res.status(200).json({"status": "pong"});
});

app.get("/news", async function (req, res) {
    const sources = (req.query.sources || "").split(",");
    const languages = (req.query.languages || "english").split(",");

    console.log(sources, languages);

    res.status(200).json(await getNewsCache(sources, languages));
});

// Scraping API
app.post("/scrap-news", async function (req, res) {
    const source = req.query.source || "";
    const language = req.query.language || "english";
    const sourceName = `${source}_${language}`;
    const news = await getNews(sourceName);

    insertNewsToDB(sourceName, language, news);

    res.status(200).json({"news": news});
});

async function sourceScrap(sources, languages){
    const news = [];
   
    for (let i = 0; i < sources.length; i++) {
        const source = sources[i];

        for (let j = 0; j < languages.length; j++) {
            const language = languages[j];
            
            const sourceName = `${source}_${language}`;

            console.log("Scraping: ", sourceName);

            let n = await getNews(sourceName);
            news.push({
                "source": sourceName,
                "language": language,
                "news": n,
            });

        }
    }

    return news;
}

app.post("/scrap-news-all", async function (req, res) {
    let news = [];

    // DB cleanup
    await deleteAll();

    news.push(await sourceScrap(["newslk", "newsfirst", "adaderana", "hiru"], ["english","sinhala","tamil"])); 
    
    news.push(await sourceScrap(["lankadeepa", "ada", "lankatruth"],["sinhala"]));

    news.push(await sourceScrap(["thinakaran", "tamilwin", "jaffnamuslim"],["tamil"]));
    
    news.push(await sourceScrap(["newswire", "srilankaguardian", "asianmirror", "dailymirror", "island", "ft"],["english"]));

    news = news.flat();

    await insertAllToDB(news);

    res.status(200).json({"news": news});
});

app.listen(3000, function () {
    console.log("Server started on port http://localhost:3000");
    connectDB();
});
export default app;