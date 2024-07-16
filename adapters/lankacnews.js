import * as cheerio from "cheerio";
import axios from "axios";
import BaseAdapter, {NewsFormat} from "./base.js";

export default class LankaCNews extends BaseAdapter {

    static SOURCE = "lankacnews";
    
    static async getNews(count = 10, language = "sinhala") {
        const newsList = [];
        try {
            const url = "https://lankacnews.com/news";
            const response = await axios.get(url);
            if (response.status != 200) return newsList;
            
            const $ = cheerio.load(response.data);

            const news = $("#page-main-news article");  // Select all news elements
            for (let i = 0; i < Math.min(count, news.length); i++) {
                const v = news[i];
                try {
                    const title = $(v).find("header h2 a").text().trim();
                    const content = $(v).find("p").text().trim();
                    const href = $(v).find("header h2 a").attr('href').trim();
                    const img = $(v).find("img").attr('src').trim();
                    const time = $(v).find("header span").text().trim();

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