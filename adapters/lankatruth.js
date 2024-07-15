import * as cheerio from "cheerio";
import axios from "axios";
import BaseAdapter, {NewsFormat} from "./base.js";

export default class LankaTruth extends BaseAdapter {

    static SOURCE = "lankatruth";
    
    static async getNews(count = 10, language = "sinhala") {
        const newsList = [];
        try {
            const url = "https://lankatruth.com/si/?cat=2";
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);

            const news = $(".site-inner section .elementor-posts-container article.elementor-post");  // Select all news elements
            for (let i = 0; i < Math.min(count, news.length); i++) {
                const v = news[i];
                try {
                    const title = $(v).find(".elementor-post__text .elementor-post__title").text().trim();
                    const content = $(v).find(".elementor-post__text .elementor-post__excerpt").text().trim();
                    const href = $(v).find("a.elementor-post__thumbnail__link").attr('href').trim();
                    const img = $(v).find(".elementor-post__thumbnail__link img").attr('srcset').trim().split(",")[0].split(" ")[0].trim();
                    const time = $(v).find(".elementor-post__meta-data .elementor-post-date").text().trim();

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