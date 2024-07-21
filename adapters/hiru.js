import * as cheerio from "cheerio";
import axios from "axios";
import BaseAdapter, {NewsFormat} from "./base.js";

export default class Hiru extends BaseAdapter {

    static SOURCE = "hiru";
    
    static async getNews(count = 10, language = "english") {
        const newsList = [];
        try {
            let url = "https://www.hirunews.lk/english/local-news.php?pageID=2";
            switch (language) {
                case 'sinhala':
                    url = "https://www.hirunews.lk/local-news.php?pageID=1";
                    break;
                case 'tamil':
                    url = "https://www.hirunews.lk/tamil/local-news.php?pageID=2";
                    break;
            }

            const response = await axios.get(url);
            const $ = cheerio.load(response.data);

            const news = $(`.trending-section .row`);  // Select all news elements
            for (let i = 0; i < Math.min(count, news.length); i++) {
                const v = news[i];
                try {
                    const title = $(v).find(`.all-section-tittle`).text().trim();
                    const content = "";
                    const href = $(v).find(`.column.middle a`).attr('href').trim();
                    const img = $(v).find(".sc-image img").attr('src').trim();
                    let time = $(v).find(".middle-tittle-time").text().trim();
                    var dt = new Date(time.split(", ")[1].replace("- ", ""));
                    time = dt.toLocaleDateString("en-UK", { year: "numeric", month: "short", day: "numeric" }) + " " + dt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

                    newsList.push(new NewsFormat(title, href, img, time, content, this.SOURCE, language).toJson());

                } catch (error) { 
                    console.error(error);
                }
            }
        } catch (error) {
            console.error(error);
        }

        return newsList;
    }
}