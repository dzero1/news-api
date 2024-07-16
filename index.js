import express, { json } from "express";
import cors from "cors";
import getNews from "./news.js";
import {deleteAll, getNewsCache, insertAllToDB, insertNewsToDB} from "./db.js";

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
    const languages = (req.query.languages || "english").split(",");

    console.log(sources, languages);

    res.status(200).json(await getNewsCache(sources, languages));
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

async function sourceScrap(sources, languages){
    const news = [];
   
    for (let i = 0; i < sources.length; i++) {
        const source = sources[i];

        for (let j = 0; j < languages.length; j++) {
            const language = languages[j];
            
            let n = await getNews(source, language);
            news.push({
                "source": source,
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
});
export default app;