import IDService from "./id-service";

let newID: any;

describe("id-Service", () => {
  it("should be empty at app start", () => {
    IDService.reset();
    const newID = IDService.generateId();
    expect(IDService.inUse(newID)).toBeTruthy();
    IDService.removeId(newID);
    expect(IDService.inUse(newID)).toBeFalsy();
  });
  it("should generate a new ID", () => {
    newID = IDService.generateId();
    expect(IDService.inUse(newID)).toBeTruthy();
  });
  it("should remove an existing ID", () => {
    IDService.removeId(newID);
    expect(IDService.inUse(newID)).toBeFalsy();
  });
});
