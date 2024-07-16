import * as cheerio from "cheerio";
import axios from "axios";
import jsdom from "jsdom";
import BaseAdapter, {NewsFormat} from "./base.js";
const { JSDOM } = jsdom;

export default class Thinakaran extends BaseAdapter {

    static SOURCE = "thinakaran";
    
    static async getNews(count = 10, language = "english") {
        const newsList = [];
        try {
            const _response = await axios.get("https://www.thinakaran.lk/");
            const _$ = cheerio.load(_response.data);

            const $x = _$("#penci_slajax_more_posts-js-extra").html().trim().replace("/* <![CDATA[ */", "").replace("/* ]]> */", "");
            // const dom = JSDOM.fragment($x);
            // console.log($x);
            // console.log(dom.window.penci_slajax);
            // const nonce = dom;
            let n1 = $x.indexOf(`var penci_slajax = {"nonce":"`) + 29;
            let nonce = $x.substring(n1, n1 + 10);
            // console.log(nonce);

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
                    "nonce": nonce
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