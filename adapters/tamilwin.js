import * as cheerio from "cheerio";
import axios from "axios";
import BaseAdapter, {NewsFormat} from "./base.js";

export default class Tamilwin extends BaseAdapter {

    static SOURCE = "tamilwin";
    
    static async getNews(count = 10, language = "english") {
        const newsList = [];
        try {
            const url = "https://tamilwin.com/srilanka";
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);

            const news = $(".main-section .lsb-sections .lsb-sec-items:nth-child(2) .article-item");  // Select all news elements
            for (let i = 0; i < Math.min(count, news.length); i++) {
                const v = news[i];
                try {
                    if ($(v).find('a').length > 0) {
                        const title = $(v).find('h4 a:nth-child(1):not(.article-footer a)').text().trim();
                        const href = $(v).find('a').attr('href').trim();
                        const img = $(v).find("img").attr('data-src').trim();
                        const time = $(v).find('h4 .article-footer span').text().trim();

                        newsList.push(new NewsFormat(title, href, img, time, "", this.SOURCE).toJson());
                    }
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