import request from "supertest";
import app from "../index.js";

describe("GET /latest-news", () => {
  ["news","newsfirst","adaderana","hiru","newswire","island","dailymirror","lankadeepa","ada"].forEach(source => {
    ["english","sinhala","tamil"].forEach(language => {
      it(`${source.toUpperCase()} ${language.toUpperCase()} - should have latest news`, async () => {
        const res = await request(app).get(`/latest-news?source=${source}&language=${language}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.news.length).toBeGreaterThan(0);
      });
    });
  });

});