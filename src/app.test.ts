/* eslint-disable test/prefer-lowercase-title */
import httpStatus from "http-status";
import request from "supertest";
import app from "./app";
import isISOString from "./lib/iso-date";
import logger from "./lib/logger";
import urlShortener from "./modules/url-shortener/url-shortener.router";

const log = logger();

beforeAll(() => {
  log.silent = true;
});
afterAll(() => {
  log.silent = false;
});

describe("initial test", () => {
  it("should always pass", () => {
    expect(true).toBeTruthy();
  });
});

describe("app DEMO endpoint", () => {
  it("GET '/' should respond correctly", async () => {
    const testResponse = await request(app).get("/").expect(httpStatus.OK);
    expect(testResponse.body).toBeDefined();
    expect(testResponse.body.title).toBeDefined();
    expect(testResponse.body.title).toEqual("This is a **khatastroffik service** Proof-of-Concept!");
    expect(testResponse.body.currentTime).toBeDefined();
    expect(isISOString(testResponse.body.currentTime)).toBeTruthy();
  });

  it("GET '/environment' should respond correctly", async () => {
    const testResponse = await request(app).get("/environment").expect(httpStatus.OK);
    expect(testResponse.body).toBeDefined();
    expect(testResponse.body.NODE_DEV).toBeDefined();
    expect(testResponse.body.NODE_DEV).toBeFalsy();
    expect(testResponse.body.NODE_TEST).toBeDefined();
    expect(testResponse.body.NODE_TEST).toBeTruthy();
  });

  it("GET '/simulateErrorLogs' should respond correctly", async () => {
    const testResponse = await request(app).get("/simulateErrorLogs").expect(httpStatus.NOT_FOUND);
    expect(testResponse.body).toBeDefined();
    expect(testResponse.body).toMatchObject({});
    expect(testResponse.clientError).toBeTruthy();
  });
  it("GET '/simulateException' should respond correctly", async () => {
    const testResponse = await request(app).get("/simulateException").expect(httpStatus.NOT_FOUND);
    expect(testResponse.body).toBeDefined();
    expect(testResponse.body).toMatchObject({});
    expect(testResponse.clientError).toBeTruthy();
  });
  it("GET '/simulateRejection' should respond correctly", async () => {
    const testResponse = await request(app).get("/simulateRejection").expect(httpStatus.NOT_FOUND);
    expect(testResponse.body).toBeDefined();
    expect(testResponse.body).toMatchObject({});
    expect(testResponse.clientError).toBeTruthy();
  });
});
describe("URL-Shortener endpoint", () => {
  const BasePath = urlShortener.BasePath;
  it(`GET '${BasePath}' should respond correctly`, async () => {
    const testResponse = await request(app).get(BasePath).expect(httpStatus.OK);
    expect(testResponse.body).toBeDefined();
    expect(testResponse.body).toMatchObject([]);
  });

  it(`POST '${BasePath}' should respond correctly`, async () => {
    // Arrange for some response like: { id: 'SjNhxk', url: 'test' }
    const payload = { url: "test" };
    const testResponse = await request(app)
      .post(BasePath)
      .send(payload)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(httpStatus.CREATED);
    expect(testResponse.body).toBeDefined();
    expect(testResponse.body.id).toBeDefined();
    expect(testResponse.body.id.length).toEqual(6);
    expect(testResponse.body.url).toBeDefined();
    expect(testResponse.body.url).toBe(payload.url);
  });
});
