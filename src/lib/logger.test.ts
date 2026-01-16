import { basename } from "node:path";
import winston, { ExceptionHandler, RejectionHandler } from "winston";

import { env } from "./environment";

const createLoggerSpy = jest.spyOn(winston, "createLogger");
const loggerSingletonFunction = require("./logger").default; // eslint-disable-line ts/no-require-imports

loggerSingletonFunction();
beforeAll(() => {
  loggerSingletonFunction().silent = true;
});
afterAll(() => {
  jest.resetModules();
  loggerSingletonFunction().silent = false;
});

describe("logger", () => {
  const childFunctionSpy = jest.spyOn(loggerSingletonFunction(), "child");
  const infoSpy = jest.spyOn(loggerSingletonFunction(), "info");

  it("should have been created with transports for Console+File and with exceptions and rejections handlers", () => {
    expect(createLoggerSpy).toHaveBeenCalledOnce();
    const transports = loggerSingletonFunction().transports as winston.transport[];
    const standardLogFile = basename(env.LOG_FILE); // path.join(dirname(env.LOG_FILE), "unhandled-exceptions.log");
    const exceptionsLogFile = "unhandled-exceptions.log";
    const rejectionsLogFile = "unhandled-rejections.log";

    expect(transports).toHaveLength(4);
    // Console-Log
    expect(transports[0] instanceof winston.transports.Console).toBeTruthy();
    // File-Log
    expect(transports[1] instanceof winston.transports.File).toBeTruthy();
    expect((transports[1] as typeof winston.transports.File).filename).toEqual(standardLogFile);
    // Exceptions-Log
    const exceptions = loggerSingletonFunction().exceptions;
    expect(exceptions instanceof ExceptionHandler).toBeTruthy();
    expect((exceptions as ExceptionHandler).handlers.entries().next().value![0].filename).toEqual(exceptionsLogFile);
    // Rejections-Log
    const rejections = loggerSingletonFunction().rejections;
    expect(rejections instanceof RejectionHandler).toBeTruthy();
    expect((rejections as RejectionHandler).handlers.entries().next().value![0].filename).toEqual(rejectionsLogFile);
  });

  it("should create without label", () => {
    const singletonLogger = loggerSingletonFunction();
    singletonLogger.info("First Call");
    expect(infoSpy).toHaveBeenCalled();
    expect(infoSpy).toHaveBeenCalledWith("First Call");
  });

  it("should create with label", () => {
    const childLogger = loggerSingletonFunction("TEST-LABEL");
    childLogger.info("Second Call");
    expect(childFunctionSpy).toHaveBeenCalled();
    expect(childFunctionSpy).toHaveBeenCalledWith({ label: "TEST-LABEL" });
    expect(infoSpy).toHaveBeenCalled();
  });
});
