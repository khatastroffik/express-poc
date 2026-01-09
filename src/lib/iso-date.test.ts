import isISOString from "./iso-date";

describe("isIsoString", () => {
  it("should be truthy whith a valid param", () => {
    const testDateString = "2026-01-08T21:22:23.000Z";
    expect(isISOString(testDateString)).toBeTruthy();
    expect(isISOString("2026-01-08")).toBeFalsy();
    expect(isISOString("")).toBeFalsy();
  });

  it("should be falsy whith an invalid param", () => {
    const testDateString = "2026-01-08T21:22:23Z";
    expect(isISOString(testDateString)).toBeFalsy();
    expect(isISOString("2026-01-08")).toBeFalsy();
    expect(isISOString("")).toBeFalsy();
  });
});
