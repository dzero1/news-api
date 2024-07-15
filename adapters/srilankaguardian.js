import * as cheerio from "cheerio";
import axios from "axios";
import BaseAdapter, {NewsFormat} from "./base.js";

export default class SriLankaGuardian extends BaseAdapter {

    static SOURCE = "srilankaguardian";
    
    static async getNews(count = 10, language = "english") {
        const newsList = [];
        try {
            const url = `http://www.srilankaguardian.org/search/label/Breaking%20News?&max-results=${count}`;
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);

            const news = $("#Blog1 .blog-posts .post");  // Select all news elements
            for (let i = 0; i < Math.min(count, news.length); i++) {
                const v = news[i];
                try {

                    const title = $(v).find(".post-title").text().trim();
                    const content = $(v).find(".post-body div:nth-child(1)").text().trim().substring(0, 300);
                    const href = $(v).find(".post-title a").attr('href').trim();

                    let imgcss = $(v).find("a:contains('https://blogger.googleusercontent.com/img')").text();
                        imgcss = imgcss.substring(imgcss.indexOf("https://blogger.googleusercontent.com/img"));
                    const img = imgcss.substring(0, imgcss.indexOf('","'));


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