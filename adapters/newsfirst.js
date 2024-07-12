import * as cheerio from "cheerio";
import axios from "axios";
import BaseAdapter, {NewsFormat} from "./base.js";

export default class NewsFirst extends BaseAdapter {

    static SOURCE = "newsfirst";

    static async getNews(count = 10, language = "english") {
        const newsList = [];
        try {
            const url = `https://api${language}.newsfirst.lk/post/PostPagination/0/${count}`;
            const response = await axios.get(url);

            const news = response.data.postResponseDto;

            for (let i = 0; i < news.length; i++) {
                const v = news[i];
                try {
                    const title = v.title.rendered;
                    const href =  `https://${language}.newsfirst.lk/${v.post_url}`;
                    const img = v.images.mobile_banner;
                    const time = v.modified;

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