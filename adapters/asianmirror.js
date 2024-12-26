import * as cheerio from "cheerio";
import axios from "axios";
import BaseAdapter, {NewsFormat} from "./base.js";

export default class AsianMirror extends BaseAdapter {

    static SOURCE = "asianmirror";
    
    static async getNews(count = 10, language = "english") {
        const newsList = [];
        try {
            const srcPrefix = "https://asianmirror.lk";
            const url = "https://asianmirror.lk/news/category/news/";
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);

            const news = $(".tdb-category-loop-posts .tdb_module_loop");  // Select all news elements
            for (let i = 0; i < Math.min(count, news.length); i++) {
                const v = news[i];
                try {
                    const title = $(v).find('.td-module-meta-info .td-module-title').text().trim();
                    const content = $(v).find('.td-excerpt').text().trim();
                    const href = srcPrefix + $(v).find('.td-module-meta-info .td-module-title a').attr('href').trim();
                    const img = srcPrefix + $(v).find(".entry-thumb").attr('data-img-url').trim()
                    const time = $(v).find('.td-editor-date').text().trim();

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