import DailyMirror from './adapters/dailymirror.js';
import NewsFirst from './adapters/newsfirst.js';
import NewsWire from './adapters/newswire.js';
import Island from './adapters/island.js';
import AdaDerana from './adapters/adaderana.js';

export default async function getNews(source) {
    let news = [];
    switch (source) {
        case "newsfirst":
            news = await NewsFirst.getNews(10, "english");
            break;
        case "newsfirst-sinhala":
            news = await NewsFirst.getNews(10, "sinhala");
            break;
        case "newsfirst-tamil":
            news = await NewsFirst.getNews(10, "tamil");
            break;
        case "newswire":
            news = await NewsWire.getNews();
            break;
        case "ft":
        case "island":
            news = await Island.getNews();
            break;
        case "adaderana":
            news = await AdaDerana.getNews();
            break;
        case "adaderana-sinhala":
            news = await AdaDerana.getNews(10, "sinhala");
            break;
        case "adaderana-tamil":
            news = await AdaDerana.getNews(10, "tamil");
            break;
        case "dailymirror":
        default:
            news = await DailyMirror.getNews();
            break;
    }
    return news;
}
