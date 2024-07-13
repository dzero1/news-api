import * as cheerio from "cheerio";
import axios from "axios";
import BaseAdapter, {NewsFormat} from "./base.js";

export default class Ada extends BaseAdapter {

    static SOURCE = "ada";
    
    static async getNews(count = 10, language = "sinhala") {
        const newsList = [];
        try {
            const url = "https://www.ada.lk/latest-news/11";
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);

            const news = $(".cat-b-list .cat-b-row");  // Select all news elements
            for (let i = 0; i < Math.min(count, news.length); i++) {
                const v = news[i];
                try {

                    const title = $(v).find(".cat-detail-1 h5").text().trim();
                    const content = $(v).find(".cat-b-text").text().trim();
                    const href = $(v).find("a").attr('href').trim();
                    const img = $(v).find(".cat-image img").attr('src').trim();
                    const time = $(v).find(".cat-detail-1 h6").text().trim();

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