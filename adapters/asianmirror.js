import * as cheerio from "cheerio";
import axios from "axios";
import BaseAdapter, {NewsFormat} from "./base.js";

export default class AsianMirror extends BaseAdapter {

    static SOURCE = "asianmirror";
    
    static async getNews(count = 10, language = "english") {
        const newsList = [];
        try {
            const srcPrefix = "https://asianmirror.lk";
            const url = "https://asianmirror.lk/news?start=0";
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);

            const news = $("#k2Container .itemList .itemContainer");  // Select all news elements
            for (let i = 0; i < Math.min(count, news.length); i++) {
                const v = news[i];
                try {
                    const title = $(v).find('.catItemHeader .catItemTitle').text().trim();
                    const href = srcPrefix + $(v).find('.catItemHeader .catItemTitle a').attr('href').trim();
                    const img = $(v).find(".catItemImage img").length ? srcPrefix + $(v).find(".catItemImage img").attr('src').trim() : '';
                    const time = $(v).find('.catItemHeader .catItemMetaInfo .catItemDateCreated').text().trim();

                    newsList.push(new NewsFormat(title, href, img, time, "", this.SOURCE, language).toJson());
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