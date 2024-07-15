import request from "supertest";
import app from "../index.js";

describe("multi language - GET /latest-news", () => {
  [
    "news", "newsfirst", "adaderana", "hiru"
  ].forEach(source => {
    ["english","sinhala","tamil"].forEach(language => {
      it(`${source.toUpperCase()} ${language.toUpperCase()} - should have latest news`, async () => {
        const res = await request(app).get(`/latest-news?source=${source}&language=${language}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.news.length).toBeGreaterThan(0);
      });
    });
  });
});

describe("Sinhala - GET /latest-news", () => {
  [
    "lankadeepa", "ada", "lankatruth" //, "lankacnews"
  ].forEach(source => {
    ["sinhala"].forEach(language => {
      it(`${source.toUpperCase()} ${language.toUpperCase()} - should have latest news`, async () => {
        const res = await request(app).get(`/latest-news?source=${source}&language=${language}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.news.length).toBeGreaterThan(0);
      });
    });
  });
});

describe("Tamil - GET /latest-news", () => {
  [
    "thinakaran", "tamilwin", "jaffnamuslim"
  ].forEach(source => {
    ["tamil"].forEach(language => {
      it(`${source.toUpperCase()} ${language.toUpperCase()} - should have latest news`, async () => {
        const res = await request(app).get(`/latest-news?source=${source}&language=${language}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.news.length).toBeGreaterThan(0);
      });
    });
  });
});
describe("English - GET /latest-news", () => {
  [
    "newswire", "srilankaguardian", "asianmirror", "dailymirror", "island", "ft"
  ].forEach(source => {
    ["english"].forEach(language => {
      it(`${source.toUpperCase()} ${language.toUpperCase()} - should have latest news`, async () => {
        const res = await request(app).get(`/latest-news?source=${source}&language=${language}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.news.length).toBeGreaterThan(0);
      });
    });
  });
});
