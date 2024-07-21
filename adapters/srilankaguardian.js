import * as cheerio from "cheerio";
import axios from "axios";
import BaseAdapter, {NewsFormat} from "./base.js";

export default class SriLankaGuardian extends BaseAdapter {

    static SOURCE = "srilankaguardian";
    
    static async getNews(count = 10, language = "english") {
        const newsList = [];
        try {
            const url = `https://slguardian.org/category/news/`;
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);

            const news = $(".content-area article");  // Select all news elements
            for (let i = 0; i < Math.min(count, news.length); i++) {
                const v = news[i];
                try {

                    const title = $(v).find(".post-body .post-item-header .post-item-title").text().trim();
                    const content = $(v).find(".post-body .post-item-excerpt p").text().trim();
                    const href = $(v).find(".wi-thumbnail a").attr('href').trim();
                    const img = $(v).find(".wi-thumbnail img").attr('src').trim();

                    /* let imgcss = $(v).find("a:contains('https://blogger.googleusercontent.com/img')").text();
                        imgcss = imgcss.substring(imgcss.indexOf("https://blogger.googleusercontent.com/img"));
                    const img = imgcss.substring(0, imgcss.indexOf('","')); */

                    const time = $(v).find(".post-body .post-item-header time").text().trim();

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