import * as cheerio from "cheerio";
import axios from "axios";
import BaseAdapter, {NewsFormat} from "./base.js";

export default class DailyMirror extends BaseAdapter {

    static SOURCE = "dailymirror";
    
    static async getNews(count = 10) {
        const newsList = [];
        try {
            const url = "https://www.dailymirror.lk/";
            const _response = await axios.get(url);
            const _$ = cheerio.load(_response.data);

            // get out the "Latest News" section url

            const news_url = _$("a:contains('Latest News')").attr('href');
            const response = await axios.get(news_url);
            const $ = cheerio.load(response.data);

            const news = $(".inner_news_body_area_end .lineg");  // Select all news elements
            for (let i = 0; i < Math.min(count, news.length); i++) {
                const v = news[i];
                try {
                    const title_obj = $(v).find(".cat_title");

                    const title = title_obj.text().trim();
                    const href = $(title_obj).closest("a").attr('href').trim();
                    const img = $(v).find("img.img-fluid").attr('src').trim();
                    const time = $(v).find(".timesss").text().trim();

                    newsList.push(new NewsFormat(title, href, img, time, "", this.SOURCE).toJson());

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