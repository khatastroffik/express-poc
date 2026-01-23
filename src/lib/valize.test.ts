import z, { ZodError } from "zod";
import { validatePayloadWithZodSchema, valize, valizeAsync, valizeLoose, valizeLooseAsync } from "./valize";

const TestSchema = z.object({
  name: z.string().trim().nonempty("Property 'name' must not be an empty string"),
  age: z.coerce.number({ error: issue => (!issue.input) ? "Property 'Age' is required" : "Property 'Age' must be a valid number" }).int().min(18).max(100),
});

const TestSchemaStrict = TestSchema.strict();

const unknownPropertiesPayloads = [
  { name: "Piggy", age: 18, foo: "foo" }, // unknown property (unrecognized_keys)
  { name: "Piggy", age: 18, foo: "foo", bar: "bar", baz: 100 }, // unknown properties (unrecognized_keys)
];

const strictlyValidPayloads = [
  { name: "Piggy", age: 18 }, // age as number
  { name: "Piggy", age: "18" }, // age as string
];

const looselyValidPayloads = [
  ...strictlyValidPayloads,
  ...unknownPropertiesPayloads,
];

const looselyInvalidPayload = [
  { name: "Piggy", age: 17 }, // age < 18
  { name: "Piggy", age: 101 }, // age > 100
  { name: 123456, age: 18 }, // invalid name
  { name: "", age: 18 }, // invalid name
  { name: "   ", age: 17 }, // invalid name
  { age: 18 }, // missing name
  { name: "" }, // missing age
];

const strictlyInvalidPayload = [
  ...looselyInvalidPayload,
  ...unknownPropertiesPayloads,
];

const errorMessage = "Unknown properties must not be provided!";

describe("validatePayloadWithZodSchema", () => {
  it("should loosely validate correct payloads", () => {
    // Arrange
    looselyValidPayloads.forEach((payload) => {
      // Act
      const argument = { schema: TestSchema, errorMessage, payload };
      // Assert
      expect(validatePayloadWithZodSchema(argument)).toEqual({
        name: payload.name,
        age: typeof payload.age === "string" ? Number.parseInt(payload.age) : payload.age,
      });
    });
  });

  it("should strictly validate correct payloads", () => {
    // Arrange
    strictlyValidPayloads.forEach((payload) => {
      // Act
      const argument = { schema: TestSchemaStrict, errorMessage, payload };
      // Assert
      expect(validatePayloadWithZodSchema(argument)).toEqual({ name: payload.name, age: typeof payload.age === "string" ? Number.parseInt(payload.age) : payload.age });
    });
  });

  it("should throw due to loosely invalid payloads", () => {
    // Arrange
    const payloads = Array.from (looselyInvalidPayload);
    payloads.forEach((payload) => {
      // Act
      const argument = { schema: TestSchema, errorMessage, payload };
      // Assert
      expect(() => validatePayloadWithZodSchema(argument)).toThrow(ZodError);
    });
  });

  it("should throw due to strictly invalid payloads", () => {
    // Arrange
    const payloads = Array.from (strictlyInvalidPayload);
    payloads.forEach((payload) => {
      // Act
      const argument = { schema: TestSchemaStrict, errorMessage, payload };
      // Assert
      expect(() => validatePayloadWithZodSchema(argument)).toThrow(ZodError);
    });
  });
});

/********************************************************
 * valizeLoose
*******************************************************/

describe("valizeLoose", () => {
  it("should loosely validate correct payloads", () => {
    // Arrange
    looselyValidPayloads.forEach((payload) => {
      const expected = typeof payload.age === "string" ? Number.parseInt(payload.age) : payload.age;
      // Act & Assert
      expect(valizeLoose(payload, TestSchema)).toEqual({ name: payload.name, age: expected });
    });
  });

  it("should strictly validate correct payloads", () => {
    // Arrange
    strictlyValidPayloads.forEach((payload) => {
      const expected = typeof payload.age === "string" ? Number.parseInt(payload.age) : payload.age;
      // Act & Assert
      expect(valizeLoose(payload, TestSchemaStrict)).toEqual({
        name: payload.name,
        age: expected,
      });
    });
  });

  it("should throw due to loosely invalid payloads", () => {
    // Arrange
    const payloads = Array.from (looselyInvalidPayload);
    payloads.forEach((payload) => {
      // Act & Assert
      expect(() => valizeLoose(payload, TestSchema)).toThrow(ZodError);
    });
  });

  it("should throw due to strictly invalid payloads", () => {
    // Arrange
    const payloads = Array.from (strictlyInvalidPayload);
    payloads.forEach((payload) => {
      // Act & Assert
      expect(() => valizeLoose(payload, TestSchemaStrict)).toThrow(ZodError);
    });
  });
});

describe("valizeLooseAsync", () => {
  it("should loosely validate correct payloads", async () => {
    // Arrange
    looselyValidPayloads.forEach(async (payload) => {
      const expected = typeof payload.age === "string" ? Number.parseInt(payload.age) : payload.age;
      // Act & Assert
      await expect(valizeLooseAsync(payload, TestSchema)).resolves.toEqual({ name: payload.name, age: expected });
    });
  });

  it("should strictly validate correct payloads", async () => {
    // Arrange
    strictlyValidPayloads.forEach(async (payload) => {
      const expected = typeof payload.age === "string" ? Number.parseInt(payload.age) : payload.age;
      // Act & Assert
      await expect(valizeLooseAsync(payload, TestSchemaStrict)).resolves.toEqual({
        name: payload.name,
        age: expected,
      });
    });
  });

  it("should throw due to loosely invalid payloads", async () => {
    // Arrange
    const payloads = Array.from (looselyInvalidPayload);
    payloads.forEach(async (payload) => {
      // Act & Assert
      await expect(valizeLooseAsync(payload, TestSchema)).rejects.toThrow(ZodError);
    });
  });

  it("should throw due to strictly invalid payloads", async () => {
    // Arrange
    const payloads = Array.from (strictlyInvalidPayload);
    payloads.forEach(async (payload) => {
      // Act & Assert
      await expect(valizeLooseAsync(payload, TestSchemaStrict)).rejects.toThrow(ZodError);
    });
  });
});

/********************************************************
 * valize
 *******************************************************/

describe("valize", () => {
  it("should strictly validate correct payloads", () => {
    // Arrange
    strictlyValidPayloads.forEach((payload) => {
      const expected = typeof payload.age === "string" ? Number.parseInt(payload.age) : payload.age;
      // Act & Assert
      expect(valize(payload, TestSchemaStrict)).toEqual({
        name: payload.name,
        age: expected,
      });
    });
  });

  it("should throw due to strictly invalid payloads", () => {
    // Arrange
    const payloads = Array.from (strictlyInvalidPayload);
    payloads.forEach((payload) => {
      // Act & Assert
      expect(() => valize(payload, TestSchemaStrict)).toThrow(ZodError);
    });
  });
});

describe("valizeAsync", () => {
  it("should strictly validate correct payloads", async () => {
    // Arrange
    strictlyValidPayloads.forEach(async (payload) => {
      const expected = typeof payload.age === "string" ? Number.parseInt(payload.age) : payload.age;
      // Act & Assert
      await expect(valizeAsync(payload, TestSchemaStrict)).resolves.toEqual({
        name: payload.name,
        age: expected,
      });
    });
  });
  it("should throw due to strictly invalid payloads", async () => {
    // Arrange
    const payloads = Array.from (strictlyInvalidPayload);
    payloads.forEach(async (payload) => {
      // Act & Assert
      await expect(valizeAsync(payload, TestSchemaStrict)).rejects.toThrow(ZodError);
    });
  });
});
