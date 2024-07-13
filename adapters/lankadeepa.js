import * as cheerio from "cheerio";
import axios from "axios";
import BaseAdapter, {NewsFormat} from "./base.js";

export default class Lankadeepa extends BaseAdapter {

    static SOURCE = "lankadeepa";
    
    static async getNews(count = 10, language = "sinhala") {
        const newsList = [];
        try {
            const url = "https://www.lankadeepa.lk/latest_news/1";
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);

            const news = $("section .container .flex-wr-sb-s ");  // Select all news elements
            for (let i = 0; i < Math.min(count, news.length); i++) {
                const v = news[i];
                try {

                    const title = $($(v).find(".size-w-9 h5")[0]).text().trim();
                    const content = $($(v).find(".size-w-9 h5")[1]).text().trim();
                    const href = $(v).find("a").attr('href').trim();
                    const img = $(v).find("img").attr('src').trim();
                    const time = $(v).find(".timec:nth-child(1)").text().trim();

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