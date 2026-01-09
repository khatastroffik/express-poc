import { prettyBytes } from "./pretty-bytes";

describe("pretty-bytes", () => {
  it("should format bytes", () => {
    expect(prettyBytes(512)).toEqual("512 B");
    expect(prettyBytes(999)).toEqual("999 B");
  });
  it("should format kilobytes", () => {
    expect(prettyBytes(1000)).toEqual("1 KB");
    expect(prettyBytes(1024)).toEqual("1.02 KB");
    expect(prettyBytes(3940)).toEqual("3.94 KB");
    expect(prettyBytes(3947)).toEqual("3.95 KB");
  });
  it("should format megabytes", () => {
    expect(prettyBytes(1000000)).toEqual("1 MB");
    expect(prettyBytes(1234567)).toEqual("1.23 MB");
    expect(prettyBytes(9999999)).toEqual("10 MB"); // rounded up with default precision !!!
  });
  it("should format gigabytes", () => {
    expect(prettyBytes(1000000000)).toEqual("1 GB");
    expect(prettyBytes(1234567890)).toEqual("1.23 GB");
    expect(prettyBytes(9999999999)).toEqual("10 GB"); // rounded up with default precision !!!
  });
  it("should format terabytes", () => {
    expect(prettyBytes(1000000000000)).toEqual("1 TB");
    expect(prettyBytes(1234567890123)).toEqual("1.23 TB");
    expect(prettyBytes(9999999999999)).toEqual("10 TB"); // rounded up with default precision !!!
  });
  it("should format with precision", () => {
    expect(prettyBytes(9999999, 3)).toEqual("10 MB");
    expect(prettyBytes(9999999, 4)).toEqual("10 MB");
    expect(prettyBytes(9999999, 5)).toEqual("10 MB");
    expect(prettyBytes(9999999, 6)).toEqual("10 MB");
    expect(prettyBytes(9999999, 7)).toEqual("9.999999 MB");
    expect(prettyBytes(9999999, 8)).toEqual("9.999999 MB");
    expect(prettyBytes(9999999, 9)).toEqual("9.999999 MB");
    expect(prettyBytes(9999999, 10)).toEqual("9.999999 MB");
    expect(prettyBytes(9999999999999, 11)).toEqual("10 TB");
    expect(prettyBytes(9999999999999, 12)).toEqual("10 TB");
    expect(prettyBytes(9999999999999, 13)).toEqual("9.999999999999 TB");
    expect(prettyBytes(9999999999999, 14)).toEqual("9.999999999999 TB");
    expect(prettyBytes(9999999999999, 15)).toEqual("9.999999999999 TB");
  });
});
