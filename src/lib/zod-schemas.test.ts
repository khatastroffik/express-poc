import { ClientErrorBadRequestSchema } from "./zod-schemas";

const BasePayload = {
  status: "error",
  statuscode: 400,
  message: "very bad request",
  formErrors: [],
  fieldErrors: {},
};

describe("schema ClientErrorBadRequestSchema", () => {
  it("should parse with zoderror details", () => {
    expect.assertions(5);
    // Arrange
    const payload = BasePayload;
    // Act
    const result = ClientErrorBadRequestSchema.safeParse(payload);
    // Assert
    expect(result.success).toBeTrue();
    expect(result.data).not.toBeEmptyObject();
    expect(result.data?.formErrors).toBeArrayOfSize(0);
    expect(result.data?.fieldErrors).toBeEmptyObject();
    expect(result.data?.message).toEqual(BasePayload.message);
  });

  it("should parse formErrors", () => {
    expect.assertions(4);
    // Arrange
    const payload = { ...BasePayload, formErrors: ["valid formerror description"] };
    // Act
    const result = ClientErrorBadRequestSchema.safeParse(payload);
    // Assert
    expect(result.success).toBeTrue();
    expect(result.data).not.toBeEmptyObject();
    expect(result.data?.formErrors).toBeArrayOfSize(1);
    expect(result.data?.formErrors[0]).toEqual(payload.formErrors[0]);
  });

  it("should parse with fieldErrors", () => {
    expect.assertions(6);
    // Arrange
    const payload = { ...BasePayload, fieldErrors: { testprop: ["some error description"] } };
    // Act
    const result = ClientErrorBadRequestSchema.safeParse(payload);
    // Assert
    expect(result.success).toBeTrue();
    expect(result.data).not.toBeEmptyObject();
    expect(result.data?.formErrors).toBeArrayOfSize(0);
    expect(result.data?.fieldErrors).not.toBeEmptyObject();
    expect(result.data?.fieldErrors.testprop).toBeArrayOfSize(1);
    expect(result.data?.fieldErrors.testprop).toEqual(payload.fieldErrors.testprop);
  });

  it("should error with invalid zod-error details", () => {
    expect.assertions(7);
    // Arrange
    const payload = { ...BasePayload, formErrors: [987654], fieldErrors: {
      "123": "bad karma",
      "testprop": [],
      "a-string": 123,
      "testprop2": [123, "www", "456"],
    } };
    const someErrorText_0 = "Invalid input: expected string, received number";
    const someErrorText_1 = "Invalid input: expected array, received string";
    const someErrorText_2 = "Invalid input: expected array, received number";

    // Act
    const result = ClientErrorBadRequestSchema.safeParse(payload);
    // Assert
    expect(result.success).toBeFalse();
    expect(result.error?.issues).toBeArrayOfSize(4);
    expect(result.error?.issues[0]).toContainAllKeys(["expected", "code", "path", "message"]);
    expect(result.error?.issues[0]?.message).toEqual(someErrorText_0);
    expect(result.error?.issues[1]?.message).toEqual(someErrorText_1);
    expect(result.error?.issues[2]?.message).toEqual(someErrorText_2);
    expect(result.error?.issues[3]?.message).toEqual(someErrorText_0);
  });
});
