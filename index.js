import express, { json } from "express";
import cors from "cors";
import getNews from "./news.js";

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
        methods: ["GET"] //, "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    })
);

// Express headers
app.use(function(req, res, next) {
    res.setHeader("Content-Type", "application/json");
    next();
});

app.get("/latest-news", async function (req, res) {
    const source = req.query.source || "";
    const language = req.query.language || "english";
    const news = await getNews(source, language);
    res.status(200).json({"news": news});
});

app.listen(3000, function () {
    console.log("Server started on port http://localhost:3000");
});

export default app;