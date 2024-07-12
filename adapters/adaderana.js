import * as cheerio from "cheerio";
import axios from "axios";
import BaseAdapter, {NewsFormat} from "./base.js";

export default class AdaDerana extends BaseAdapter {

    static SOURCE = "adaderana";
    
    static async getNews(count = 10, language = "english") {
        const newsList = [];
        try {
            let srcPrefix = "";
            let mainContainer = "main-content";
            let newsContainer = "news-story";
            let titleContainer = "h2";
            let url = "https://www.adaderana.lk/hot-news/";
            switch (language) {
                case 'sinhala':
                    url = "https://sinhala.adaderana.lk/sinhala-hot-news.php";
                    srcPrefix = "https://sinhala.adaderana.lk/"
                    break;
                case 'tamil':
                    url = "https://tamil.adaderana.lk/morehotnews.php?sid=36";
                    srcPrefix = "https://tamil.adaderana.lk/"
                    mainContainer = "container";
                    newsContainer = "sports";
                    titleContainer = "h4";
                    break;
                case 'english':
                default:
                    url = "https://www.adaderana.lk/hot-news/";
                    mainContainer = "main-content";
                    break;
            }

            const response = await axios.get(url);
            const $ = cheerio.load(response.data);

            const _tag = `.${mainContainer} .${newsContainer}`;
            const news = $(_tag);  // Select all news elements
            console.log(response.data, "found:", news.length, " news", _tag);
            for (let i = 0; i < Math.min(count, news.length); i++) {
                const v = news[i];
                try {
                    const a = $(v).find(`${titleContainer} a`);

                    const title = $(a).text().trim();
                    const content = $(v).find("p").text().trim();
                    const href = srcPrefix + $(a).attr('href').trim();
                    const img = $(v).find(".thumb-image img").attr('src').trim();
                    const time = $(v).find(".comments span").text().trim().substring(2).replaceAll(" ", " ");

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