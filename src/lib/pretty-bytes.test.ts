import { prettyBytes } from "./pretty-bytes";

describe("pretty-bytes", () => {
  it("should format bytes", () => {
    expect(prettyBytes(512)).toBe("512 B");
    expect(prettyBytes(999)).toBe("999 B");
  });

  it("should format kilobytes", () => {
    expect(prettyBytes(1000)).toBe("1 KB");
    expect(prettyBytes(1024)).toBe("1.02 KB");
    expect(prettyBytes(3940)).toBe("3.94 KB");
    expect(prettyBytes(3947)).toBe("3.95 KB");
  });

  it("should format megabytes", () => {
    expect(prettyBytes(1000000)).toBe("1 MB");
    expect(prettyBytes(1234567)).toBe("1.23 MB");
    expect(prettyBytes(9999999)).toBe("10 MB"); // rounded up with default precision !!!
  });

  it("should format gigabytes", () => {
    expect(prettyBytes(1000000000)).toBe("1 GB");
    expect(prettyBytes(1234567890)).toBe("1.23 GB");
    expect(prettyBytes(9999999999)).toBe("10 GB"); // rounded up with default precision !!!
  });

  it("should format terabytes", () => {
    expect(prettyBytes(1000000000000)).toBe("1 TB");
    expect(prettyBytes(1234567890123)).toBe("1.23 TB");
    expect(prettyBytes(9999999999999)).toBe("10 TB"); // rounded up with default precision !!!
  });

  it("should format with precision", () => {
    expect(prettyBytes(9999999, 3)).toBe("10 MB");
    expect(prettyBytes(9999999, 4)).toBe("10 MB");
    expect(prettyBytes(9999999, 5)).toBe("10 MB");
    expect(prettyBytes(9999999, 6)).toBe("10 MB");
    expect(prettyBytes(9999999, 7)).toBe("9.999999 MB");
    expect(prettyBytes(9999999, 8)).toBe("9.999999 MB");
    expect(prettyBytes(9999999, 9)).toBe("9.999999 MB");
    expect(prettyBytes(9999999, 10)).toBe("9.999999 MB");
    expect(prettyBytes(9999999999999, 11)).toBe("10 TB");
    expect(prettyBytes(9999999999999, 12)).toBe("10 TB");
    expect(prettyBytes(9999999999999, 13)).toBe("9.999999999999 TB");
    expect(prettyBytes(9999999999999, 14)).toBe("9.999999999999 TB");
    expect(prettyBytes(9999999999999, 15)).toBe("9.999999999999 TB");
  });
});
