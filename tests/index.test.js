import request from "supertest";
import app from "../index.js";

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe("multi language - POST /scrap-news", () => {
  [
    "newslk", "newsfirst", "adaderana", "hiru"
  ].forEach(source => {
    ["english","sinhala","tamil"].forEach(language => {
      it(`${source.toUpperCase()} ${language.toUpperCase()} - should have latest news`, async () => {
        const res = await request(app).post(`/scrap-news?source=${source}&language=${language}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.news.length).toBeGreaterThan(0);
      });
    });
  });
});

await timeout(3000); 

describe("Sinhala - POST /scrap-news", () => {
  [
    "lankadeepa", "ada", "lankatruth" //, "lankacnews"
  ].forEach(source => {
    ["sinhala"].forEach(language => {
      it(`${source.toUpperCase()} ${language.toUpperCase()} - should have latest news`, async () => {
        const res = await request(app).post(`/scrap-news?source=${source}&language=${language}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.news.length).toBeGreaterThan(0);
      });
    });
  });
});

await timeout(3000); 

describe("Tamil - POST /scrap-news", () => {
  [
    "thinakaran", "tamilwin", "jaffnamuslim"
  ].forEach(source => {
    ["tamil"].forEach(language => {
      it(`${source.toUpperCase()} ${language.toUpperCase()} - should have latest news`, async () => {
        const res = await request(app).post(`/scrap-news?source=${source}&language=${language}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.news.length).toBeGreaterThan(0);
      });
    });
  });
});

await timeout(3000); 

describe("English - POST /scrap-news", () => {
  [
    "newswire", "srilankaguardian", "asianmirror", "dailymirror", "island", "ft"
  ].forEach(source => {
    ["english"].forEach(language => {
      it(`${source.toUpperCase()} ${language.toUpperCase()} - should have latest news`, async () => {
        const res = await request(app).post(`/scrap-news?source=${source}&language=${language}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.news.length).toBeGreaterThan(0);
      });
    });
  });
});
