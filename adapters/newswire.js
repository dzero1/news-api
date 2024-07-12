import * as cheerio from "cheerio";
import axios from "axios";
import BaseAdapter, {NewsFormat} from "./base.js";

export default class NewsWire extends BaseAdapter {

    static SOURCE = "newswire";
    
    static async getNews(count = 10) {
        const newsList = [];
        try {
            const url = "https://www.newswire.lk/category/news/";
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);

            const news = $(".archive-wrap article");  // Select all news elements
            for (let i = 0; i < Math.min(count, news.length); i++) {
                const v = news[i];
                try {
                    const title_obj = $(v).find(".entry-grid-content .entry-title a");

                    const title = title_obj.text().trim();
                    const href = $(title_obj).attr('href').trim();
                    const img = $(v).find("img.wp-post-image").attr('src').trim();
                    const time = $(v).find(".entry-published").text().trim();

                    newsList.push(new NewsFormat(title, href, img, time, "", this.SOURCE).toJson());

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