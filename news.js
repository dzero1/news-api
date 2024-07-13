import DailyMirror from './adapters/dailymirror.js';
import NewsFirst from './adapters/newsfirst.js';
import NewsWire from './adapters/newswire.js';
import Island from './adapters/island.js';
import AdaDerana from './adapters/adaderana.js';
import Hiru from './adapters/hiru.js';
import NewsLK from './adapters/newslk.js';
import Lankadeepa from './adapters/lankadeepa.js';
import Ada from './adapters/ada.js';
import SriLankaGuardian from './adapters/srilankaguardian.js';
import Thinakaran from './adapters/thinakaran.js';

export default async function getNews(source, language = "english") {
    let news = [];
    switch (source) {
        case "news":
            news = await NewsLK.getNews(10, language);
            break;
        case "newsfirst":
            news = await NewsFirst.getNews(10, language);
            break;
        case "adaderana":
            news = await AdaDerana.getNews(10, language);
            break;
        case "hiru":
            news = await Hiru.getNews(10, language);
            break;
        case "newswire":
            news = await NewsWire.getNews(10, language);
            break;
        // case "ft":
        case "island":
            news = await Island.getNews(10, language);
            break;
        case "lankadeepa":
            news = await Lankadeepa.getNews(10, language);
            break;
        case "ada":
            news = await Ada.getNews(10, language);
            break;
        case "srilankaguardian":
            news = await SriLankaGuardian.getNews(10, language);
            break;
        case "thinakaran":
            news = await Thinakaran.getNews(10, language);
            break;
        case "dailymirror":
        default:
            news = await DailyMirror.getNews(10, language);
            break;
    }
    return news;
}
