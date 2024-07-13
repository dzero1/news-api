import * as cheerio from "cheerio";
import axios from "axios";
import BaseAdapter, {NewsFormat} from "./base.js";

export default class Thinakaran extends BaseAdapter {

    static SOURCE = "thinakaran";
    
    static async getNews(count = 10, language = "english") {
        const newsList = [];
        try {
            var options = {
                method: 'POST',
                url: 'https://www.thinakaran.lk/wp-admin/admin-ajax.php',
                headers: {
                  Accept: '*/*',
                  'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: {
                  action: 'penci_more_slist_post_ajax',
                  'datafilter[dformat]': '',
                  'datafilter[date_pos]': 'left',
                  'datafilter[imgpos]': 'left',
                  'datafilter[post_meta][]': ['title', 'date'],
                  'datafilter[excerpt_pos]': 'below',
                  'datafilter[rmstyle]': 'filled',
                  'datafilter[excerpt_length]': '15',
                  'datafilter[query][orderby]': 'date',
                  'datafilter[query][order]': 'desc',
                  'datafilter[query][ignore_sticky_posts]': '1',
                  'datafilter[query][post_status]': 'publish',
                  'datafilter[query][post_type]': 'post',
                  'datafilter[query][posts_per_page]': '6',
                  'datafilter[query][tax_query][0][taxonomy]': 'category',
                  'datafilter[query][tax_query][0][field]': 'term_id',
                  'datafilter[query][tax_query][0][terms][]': '531',
                  'datafilter[query][paged]': '1',
                  type: 'post',
                  pagednum: '1',
                  checkmore: 'true',
                  nonce: 'fc7d84cc1c'
                }
              };

            const response = await axios.request(options);
            const $ = cheerio.load(response.data);

            const news = $(".pcsl-item");  // Select all news elements

            for (let i = 0; i < Math.min(count, news.length); i++) {
                const v = news[i];
                try {

                    const title = $(v).find(".pcsl-title").text().trim();
                    const content = "";
                    const href = $(v).find("a.penci-image-holder").attr('href').trim();
                    const img = $(v).find(".pcsl-thumb a").attr("data-bgset");
                    const time = $(v).find(".published").text();

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