import * as cheerio from "cheerio";
import axios from "axios";
import BaseAdapter, {NewsFormat} from "./base.js";

export default class NewsLK extends BaseAdapter {

    static SOURCE = "newslk";
    
    static async getNews(count = 10, language = "english") {
        const newsList = [];
        try {
            let srcPrefix = "https://news.lk";
            let url = "https://news.lk/news";
            switch (language) {
                case 'sinhala':
                    url = "https://sinhala.news.lk/news";
                    srcPrefix = "https://sinhala.news.lk";
            break;
                case 'tamil':
                    url = "https://tamil.news.lk/news";
                    srcPrefix = "https://tamil.news.lk";
                    break;
            }

            const response = await axios.get(url);
            const $ = cheerio.load(response.data);

            const news = $(`#itemListPrimary .itemContainer`);  // Select all news elements
            for (let i = 0; i < Math.min(count, news.length); i++) {
                const v = news[i];
                try {
                    const title = $(v).find(`.catItemHeader .catItemTitle`).text().trim();
                    const content = "";
                    const href = srcPrefix + $(v).find(`.catItemHeader .catItemTitle a`).attr('href').trim();
                    const img = srcPrefix + $(v).find(`.catItemImageBlock img`).attr('src').trim();
                    const time = $(v).find(".catItemHeader .catItemDateCreated").text().trim();

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