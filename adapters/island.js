import * as cheerio from "cheerio";
import axios from "axios";
import BaseAdapter, {NewsFormat} from "./base.js";

export default class Island extends BaseAdapter {

    static SOURCE = "island";
    
    static async getNews(count = 10, language = "english") {
        const newsList = [];
        try {
            const url = "https://island.lk/category/latest-news/";
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);

            const news = $(".mvp-blog-story-list .mvp-blog-story-wrap");  // Select all news elements
            for (let i = 0; i < Math.min(count, news.length); i++) {
                const v = news[i];
                try {
                    const a = $(v).find("a");

                    const title = $(v).find(".mvp-blog-story-in h2").text().trim();
                    const content = $(v).find(".mvp-blog-story-in p").text().trim();
                    const href = $(a).attr('href').trim();
                    let imgInfo = $(v).find(".mvp-blog-story-img img.mvp-reg-img").data('srcset') || $(v).find(".mvp-blog-story-img img.mvp-reg-img").attr('data-src');
                    const img = imgInfo.trim().split(",")[0].split(" ")[0].trim()
                    const time = $(v).find(".entry-published").text().trim();

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