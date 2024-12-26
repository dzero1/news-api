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

            // Add top news
            let news = $("#mvp-cat-feat-wrap a");  // Select all news elements
            for (let i = 0; i < Math.min(count, news.length); i++) {
                const v = news[i];
                try {
                    const title = $(v).find("h2").text().trim();
                    const content = $(v).find("p").text().trim();
                    const href = $(v).attr('href').trim();
                    let imgInfo = $(v).find(".wp-post-image").attr('srcset') || $(v).find(".wp-post-image").attr('data-src') || $(v).find(".wp-post-image").attr('src');
                    let img
                    try {
                        img = imgInfo.trim().split(",")[0].split(" ")[0].trim()
                    } catch (error) {
                        console.log(title);
                    }
                    const time = $(v).find(".mvp-cd-date").text().trim();

                    newsList.push(new NewsFormat(title, href, img, time, content, this.SOURCE, language).toJson());
                } catch (error) {
                    console.error(error);
                }
            }

            news = $(".mvp-blog-story-list .mvp-blog-story-wrap");  // Select all news elements
            for (let i = 0; i < Math.min(count, news.length); i++) {
                const v = news[i];
                try {
                    const a = $(v).find("a");

                    const title = $(v).find(".mvp-blog-story-in h2").text().trim();
                    const content = $(v).find(".mvp-blog-story-in p").text().trim();
                    const href = $(a).attr('href').trim();
                    let imgInfo = $(v).find(".wp-post-image").attr('srcset') || $(v).find(".wp-post-image").attr('data-src');
                    let img
                    try {
                        img = imgInfo.trim().split(",")[0].split(" ")[0].trim()
                    } catch (error) {
                        console.log(title);
                    }
                    const time = $(v).find(".mvp-cd-date").text().trim();

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