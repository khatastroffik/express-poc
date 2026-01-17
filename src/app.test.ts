/* eslint-disable test/prefer-lowercase-title */
import httpStatus from "http-status";
import request from "supertest";
import app from "./app";
import logger from "./lib/logger";
import urlShortener from "./modules/url-shortener/url-shortener.router";

const log = logger();

beforeAll(() => {
  // log.silent = false;
  log.silent = true;
});
afterAll(() => {
  log.silent = false;
});

describe("initial test", () => {
  it("should always pass", () => {
    expect.assertions(2);
    expect(true).toBeTruthy();
    expect(6).not.toBe(5);
  });
});

describe("app DEMO endpoint", () => {
  it("GET '/' should respond correctly", async () => {
    expect.assertions(6);
    // Arrange
    const testUri = "/";
    const expectedResponseStatus = httpStatus.OK;
    // Act
    const { body } = await request(app).get(testUri).expect(expectedResponseStatus);
    // Assert
    expect(body).not.toBeEmptyObject();
    expect(body).toContainAllKeys(["title", "currentTime", "hello", "requestUrl"]);
    expect(body.title).toBe("This is a **khatastroffik service** Proof-of-Concept!");
    expect(body.currentTime).toBeDateString();
    expect(new Date(body.currentTime)).toBeValidDate();
    expect(body.requestUrl).toStartWith("http");
  });

  it("GET '/environment' should respond correctly", async () => {
    expect.assertions(5);
    // Arrange
    const testUri = "/environment";
    // Act
    const { body } = await request(app).get(testUri).expect(httpStatus.OK);
    // Assert
    expect(body).not.toBeEmptyObject();
    expect(body.NODE_DEV).toBeBoolean();
    expect(body.NODE_DEV).toBeFalse();
    expect(body.NODE_TEST).toBeBoolean();
    expect(body.NODE_TEST).toBeTrue();
  });

  it("GET '/simulateErrorLogs' should respond correctly", async () => {
    expect.assertions(2);
    // Arrange
    const testUri = "/simulateErrorLogs";
    const expectedErrorStatusCode = httpStatus.NOT_FOUND;
    // Act
    const { body, clientError } = await request(app).get(testUri).expect(expectedErrorStatusCode);
    // Assert
    expect(body).toBeEmptyObject();
    expect(clientError).toBeTrue();
  });

  it("GET '/simulateException' should respond correctly", async () => {
    expect.assertions(2);
    // Arrange
    const testUri = "/simulateException";
    const expectedErrorStatusCode = httpStatus.NOT_FOUND;
    // Act
    const { body, clientError } = await request(app).get(testUri).expect(expectedErrorStatusCode);
    // Assert
    expect(body).toBeEmptyObject();
    expect(clientError).toBeTrue();
  });

  it("GET '/simulateRejection' should respond correctly", async () => {
    expect.assertions(2);
    // Arrange
    const testUri = "/simulateRejection";
    const expectedErrorStatusCode = httpStatus.NOT_FOUND;
    // Act
    const { body, clientError } = await request(app).get(testUri).expect(expectedErrorStatusCode);
    // Assert
    expect(body).toBeEmptyObject();
    expect(clientError).toBeTrue();
  });
});

describe("URL-Shortener endpoint", () => {
  // Arrange
  const BasePath = urlShortener.BasePath;
  const BasePathAsync = `${BasePath}/async`;

  it(`GET '${BasePath}' and '${BasePathAsync}' should respond with a list of url-items in the body`, async () => {
    expect.assertions(2);
    // Arrange
    const expectedResponseStatus = httpStatus.OK;
    // Act
    const { body } = await request(app).get(BasePath).expect(expectedResponseStatus); // WITHOUT QUERY PARAMS
    const { body: bodyAsync } = await request(app).get(BasePathAsync).expect(expectedResponseStatus); // WITHOUT QUERY PARAMS
    // Assert
    expect(body).toBeArrayOfSize(0);
    expect(bodyAsync).toBeArrayOfSize(0);
  });

  it(`GET '${BasePath}' and '${BasePathAsync}' should validate query parameters`, async () => {
    expect.assertions(2);
    // Arrange
    const expectedResponseStatus = httpStatus.OK;
    // Act
    const { body } = await request(app).get(`${BasePath}?sort=desc&page=3&limit=50`).expect(expectedResponseStatus); // WITH VALID QUERY PARAMS
    const { body: bodyAsync } = await request(app).get(`${BasePathAsync}?sort=desc&page=3&limit=50`).expect(expectedResponseStatus); // WITH VALID QUERY PARAMS
    // Assert
    expect(body).toBeArrayOfSize(0);
    expect(body).toEqual(bodyAsync);
  });

  it(`GET '${BasePath}' and '${BasePathAsync}' should respond with '400: Bad Request' when the query parameters are not valid`, async () => {
    expect.assertions(7);
    // Arrange
    const expectedErrorMessage_Invalid_sort = "Invalid 'sort' query option: expected one of 'asc' or 'desc'";
    const expectedErrorMessage_Invalid_limit = "Invalid 'limit' query option: expected one of '10', '25', '50' or '100'";
    const expectedErrorStatusCode = httpStatus.BAD_REQUEST;
    // Act
    const { body } = await request(app).get(`${BasePath}?sort=unsorted&page=3&limit=22`).expect(expectedErrorStatusCode); // WITH INVALID QUERY PARAMS
    const { body: bodyAsync } = await request(app).get(`${BasePathAsync}?sort=unsorted&page=3&limit=22`).expect(expectedErrorStatusCode); // WITH INVALID QUERY PARAMS
    // Assert
    expect(body).not.toBeEmptyObject();
    expect(body).toEqual(bodyAsync);
    expect(body).toContainKeys(["message", "statusCode", "status"]);
    expect(body.status).toBe("error");
    expect(body.statusCode).toEqual(expectedErrorStatusCode);
    const messages = JSON.parse(body.message);
    expect(messages[0].message).toEqual(expectedErrorMessage_Invalid_sort);
    expect(messages[1].message).toEqual(expectedErrorMessage_Invalid_limit);
  });

  it(`GET '${BasePath}/:id' and '${BasePathAsync}/:id' should validate a well formed Request parameter`, async () => {
    expect.assertions(5);
    // Arrange
    const testParameter = "abcdef"; // 6 chars, non existing url-item
    const expectedStatusCode = httpStatus.NOT_FOUND;
    const expectedResponseBody = { message: "URL could not be found", status: "error", statusCode: 404 };
    // Act
    const { body } = await request(app).get(`${BasePath}/${testParameter}`).expect(expectedStatusCode);
    const { body: bodyAsync } = await request(app).get(`${BasePathAsync}/${testParameter}`).expect(expectedStatusCode);
    // Assert
    expect(body).not.toBeEmptyObject();
    expect(body).toEqual(bodyAsync);
    expect(body).toContainKeys(["message", "statusCode", "status"]);
    expect(body.message).toEqual(expectedResponseBody.message);
    expect(body.status).toEqual(expectedResponseBody.status);
  });

  it(`GET '${BasePath}/:id' and '${BasePathAsync}/:id' should respond with '400: Bad Request' when the Id parameter is not well formed e.g. is too long`, async () => {
    expect.assertions(6);
    // Arrange
    const testParameter = "not-well-formed-id-parameter"; // > 6 chars
    const expectedErrorMessage = "Too big: expected string to have <=6 characters";
    const expectedErrorStatusCode = httpStatus.BAD_REQUEST;
    // Act
    const { body } = (await request(app).get(`${BasePath}/${testParameter}`).expect(expectedErrorStatusCode));
    const { body: bodyAsync } = (await request(app).get(`${BasePathAsync}/${testParameter}`).expect(expectedErrorStatusCode));
    // Assert
    expect(body).not.toBeEmptyObject();
    expect(body).toEqual(bodyAsync);
    expect(body).toContainKeys(["message", "statusCode", "status"]);
    expect(body.status).toBe("error");
    expect(body.statusCode).toEqual(expectedErrorStatusCode);
    expect(JSON.parse(body.message)[0].message).toEqual(expectedErrorMessage);
  });

  it(`GET '${BasePath}/:id' and '${BasePathAsync}/:id' should respond with '400: Bad Request' when the Id parameter is not well formed e.g. is not long enough`, async () => {
    expect.assertions(6);
    // Arrange
    const testParameter = "bad"; // < 6 chars
    const expectedErrorMessage = "Too small: expected string to have >=6 characters";
    const expectedErrorStatusCode = httpStatus.BAD_REQUEST;
    // Act
    const { body } = (await request(app).get(`${BasePath}/${testParameter}`).expect(expectedErrorStatusCode));
    const { body: bodyAsync } = (await request(app).get(`${BasePathAsync}/${testParameter}`).expect(expectedErrorStatusCode));
    // Assert
    expect(body).not.toBeEmptyObject();
    expect(body).toEqual(bodyAsync);
    expect(body).toContainKeys(["message", "statusCode", "status"]);
    expect(body.status).toBe("error");
    expect(body.statusCode).toEqual(expectedErrorStatusCode);
    expect(JSON.parse(body.message)[0].message).toEqual(expectedErrorMessage);
  });

  it(`POST '${BasePath}' and '${BasePathAsync}' should respond correctly`, async () => {
    expect.assertions(5);
    // Arrange
    const payload = { url: "http://github.com/khatastroffik/express-poc" };
    // Act
    const { body } = await request(app)
      .post(BasePath)
      .send(payload)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(httpStatus.CREATED);
    const { body: bodyAsync } = await request(app)
      .post(BasePathAsync)
      .send(payload)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(httpStatus.CREATED);

    // Assert
    expect(body).not.toBeEmptyObject();
    expect(body.url).toEqual(bodyAsync.url);
    expect(body).toContainKeys(["id", "url"]);
    expect(body.id).toHaveLength(6);
    expect(body.url).toBe(payload.url);
  });

  it(`POST '${BasePath}' and '${BasePathAsync}' should accept non encoded chars in the url path`, async () => {
    expect.assertions(5);
    // Arrange
    const payload = { url: "https://en.wikipedia.org/wiki/Möbius_strip" };
    // Act
    const { body } = await request(app)
      .post(BasePath)
      .send(payload)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(httpStatus.CREATED);
    const { body: bodyAsync } = await request(app)
      .post(BasePathAsync)
      .send(payload)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(httpStatus.CREATED);
    // Assert
    expect(body).not.toBeEmptyObject();
    expect(body.url).toEqual(bodyAsync.url);
    expect(body).toContainKeys(["id", "url"]);
    expect(body.id).toHaveLength(6);
    expect(body.url).toBe(payload.url);
  });

  it(`POST '${BasePath}' and '${BasePathAsync}' should accept encoded chars in the url path`, async () => {
    expect.assertions(5);
    // Arrange
    const payload = { url: "https://en.wikipedia.org/wiki/M%C3%B6bius_strip" };
    // Act
    const { body } = await request(app)
      .post(BasePath)
      .send(payload)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(httpStatus.CREATED);
    const { body: bodyAsync } = await request(app)
      .post(BasePathAsync)
      .send(payload)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(httpStatus.CREATED);
    // Assert
    expect(body).not.toBeEmptyObject();
    expect(body.url).toEqual(bodyAsync.url);
    expect(body).toContainKeys(["id", "url"]);
    expect(body.id).toHaveLength(6);
    expect(body.url).toBe(payload.url);
  });

  it(`POST '${BasePath}' and '${BasePathAsync}' should respond with '400: Bad Request' when the (wan or lan) url is not valid`, async () => {
    expect.assertions(4);
    // Arrange
    const payload = { url: "github.com/khatastroffik/express-poc" }; // missing protocol
    const expectedErrorMessage = "Invalid input: expected an URL (protocol + LAN or WAN hostname/IP)";
    // Act
    const { body } = await request(app)
      .post(BasePath)
      .send(payload)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(httpStatus.BAD_REQUEST);
    const { body: bodyAsync } = await request(app)
      .post(BasePathAsync)
      .send(payload)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(httpStatus.BAD_REQUEST);
    // Assert
    expect(body).not.toBeEmptyObject();
    expect(body).toStrictEqual(bodyAsync);
    expect(body).toContainKeys(["message", "statusCode", "status"]);
    expect(JSON.parse(body.message)[0].message).toEqual(expectedErrorMessage);
  });

  it(`POST '${BasePath}' and '${BasePathAsync}' should respond with '400: Bad Request' when the (wan or lan) url is missing`, async () => {
    expect.assertions(4);
    // Arrange
    const payload = {}; // missing url
    const expectedErrorMessage = "Invalid input: expected an URL (protocol + LAN or WAN hostname/IP)";
    // Act
    const { body } = await request(app)
      .post(BasePath)
      .send(payload)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(httpStatus.BAD_REQUEST);
    const { body: bodyAsync } = await request(app)
      .post(BasePathAsync)
      .send(payload)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(httpStatus.BAD_REQUEST);
    // Assert
    expect(body).not.toBeEmptyObject();
    expect(body).toStrictEqual(bodyAsync);
    expect(body).toContainKeys(["message", "statusCode", "status"]);
    expect(JSON.parse(body.message)[0].message).toEqual(expectedErrorMessage);
  });

  it(`POST '${BasePath}' and '${BasePathAsync}' should respond with '400: Bad Request' when the body contains unexpected, additional properties`, async () => {
    expect.assertions(4);
    // Arrange
    const payload = { url: "github.com/khatastroffik/express-poc", foo: "bar" }; // unexpected property
    const expectedErrorMessage = "Invalid input: expected an URL (protocol + LAN or WAN hostname/IP)";
    // Act
    const { body } = await request(app)
      .post(BasePath)
      .send(payload)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(httpStatus.BAD_REQUEST);
    const { body: bodyAsync } = await request(app)
      .post(BasePathAsync)
      .send(payload)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(httpStatus.BAD_REQUEST);
    // Assert
    expect(body).not.toBeEmptyObject();
    expect(body).toStrictEqual(bodyAsync);
    expect(body).toContainKeys(["message", "statusCode", "status"]);
    expect(JSON.parse(body.message)[0].message).toEqual(expectedErrorMessage);
  });
});
