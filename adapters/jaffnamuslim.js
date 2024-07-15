import * as cheerio from "cheerio";
import axios from "axios";
import BaseAdapter, {NewsFormat} from "./base.js";

export default class JaffnaMuslim extends BaseAdapter {

    static SOURCE = "jaffnamuslim";
    
    static async getNews(count = 10, language = "english") {
        const newsList = [];
        try {
            const url = `https://www.jaffnamuslim.com/search/label/%E0%AE%9A%E0%AF%86%E0%AE%AF%E0%AF%8D%E0%AE%A4%E0%AE%BF%E0%AE%95%E0%AE%B3%E0%AF%8D?&max-results=${count}`;
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);

            const news = $("#main .blog-posts .post");  // Select all news elements
            for (let i = 0; i < Math.min(count, news.length); i++) {
                const v = news[i];
                try {
                    let imgcss = $(v).find(".block-image .thumb a").css('background');
                        imgcss = imgcss.substring(imgcss.indexOf("url(") + 4);
                    const img = imgcss.substring(0, imgcss.indexOf(') '));

                    const title = $(v).find('article .post-title').text().trim();
                    const href = $(v).find('article .post-title a').attr('href').trim();
                    const time = $(v).find('article .date-header .published').text().trim();
                    const content = $(v).find('article .date-header .resumo span').text().trim();

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