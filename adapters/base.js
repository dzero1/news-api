export default class BaseAdapter {
    static SOURCE = "undefined";

    static async getNews(count = 10) {
        return [];
    }
}

export class NewsFormat {
    constructor(title, href, img, time, content = "", source = "", language = "", category = ""){
        this.title = title;
        this.href = href;
        this.img = img;
        this.time = time;
        this.content = content;
        this.source = source;
        this.language = language;
        this.category = category;
    }

    toJson(){
        return JSON.parse(JSON.stringify(this));
    }
}