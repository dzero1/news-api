import * as cheerio from "cheerio";
import axios from "axios";
import BaseAdapter, {NewsFormat} from "./base.js";

export default class FT extends BaseAdapter {

    static SOURCE = "ft";
    
    static async getNews(count = 10, language = "sinhala") {
        const newsList = [];
        try {
            const url = "https://www.ft.lk/front-page/44";
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);

            const news = $("#breakingnewsads .col-md-6");  // Select all news elements
            for (let i = 0; i < Math.min(count, news.length); i++) {
                const v = news[i];
                try {
                    const img = $(v).find("img").attr('src');
                    const title = $(v).find(".card-body .newsch").text().trim();
                    const content = "";
                    const href = $(v).find("a").attr('href').trim();
                    const time = $(v).find(".card-body .date").text().trim().replace(title, '').trim();

                    newsList.push(new NewsFormat(title, href, img, time, content, this.SOURCE).toJson());
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