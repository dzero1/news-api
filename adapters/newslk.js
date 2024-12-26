import * as cheerio from "cheerio";
import axios from "axios";
import BaseAdapter, {NewsFormat} from "./base.js";

export default class NewsLK extends BaseAdapter {

    static SOURCE = "newslk";
    
    static async getNews(count = 10, language = "english") {
        const newsList = [];
        try {
            let srcPrefix = "https://news.lk";
            let url = "https://news.lk";
            switch (language) {
                case 'sinhala':
                    url = "https://sinhala.news.lk";
                    srcPrefix = "https://sinhala.news.lk";
            break;
                case 'tamil':
                    url = "https://tamil.news.lk";
                    srcPrefix = "https://tamil.news.lk";
                    break;
            }

            const response = await axios.get(url);
            const $ = cheerio.load(response.data);

            const news = $(`.intro-items .sppb-addon-article`);  // Select all news elements
            for (let i = 0; i < Math.min(count, news.length); i++) {
                const v = news[i];
                try {
                    const title = $(v).find(`h3`).text().trim();
                    const content = "";
                    const href = srcPrefix + $(v).find(`h3 a`).attr('href').trim();
                    const img = srcPrefix + $(v).find(`img`).attr('src').trim();
                    const time = $(v).find(".sppb-meta-date").text().trim();

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