import {
  ensureDirectoryExistence,
  getFileToLoad,
  validateOptions,
  mergeOptions,
  exitInvalidFile,
  logOrSaveTemplate,
} from "./binHelpers";
import * as _fs from "fs";
import * as _path from "path";
import { mocked } from "ts-jest/utils";
import * as _index from ".";
import _open from "open";

const open = _open as jest.Mock;

const emptyFunc: any = () => {
  // do nothing
};
const mockLog = jest.spyOn(console, "log");
const mockExit = jest.spyOn(process, "exit");
const mockCWD = jest.spyOn(process, "cwd");
mockExit.mockImplementation(emptyFunc);
mockLog.mockImplementation(emptyFunc);
mockCWD.mockReturnValue("/1/2/3");

const mockExistsSync = jest.fn();
jest.mock("fs");

jest.mock("open");

const index = mocked(_index);
jest.mock("./index");
jest.mock("path");

const fs = mocked(_fs);
const path = mocked(_path);

describe("mergeOptions", () => {
  beforeEach(() => {
    open.mockReset();
  });
  it("should save and open the file", () => {
    path.resolve.mockReturnValueOnce("/a/b/c");
    fs.existsSync.mockReturnValueOnce(true);
    const output = "/a/b/c";
    const template = "<html></html>";
    logOrSaveTemplate({
      fallbackFilename: "fallback.html",
      template,
      output,
    });

    expect(fs.writeFileSync).toHaveBeenCalledWith(output, template);
    expect(open).toHaveBeenCalled();
  });
  it("should save and not open the file", () => {
    path.resolve.mockReturnValueOnce("/a/b/c");
    fs.existsSync.mockReturnValueOnce(true);
    const output = "/a/b/c";
    const template = "<html></html>";
    logOrSaveTemplate({
      fallbackFilename: "fallback.html",
      template,
      output,
      disableOpen: true,
    });
    expect(open).toHaveBeenCalledTimes(0);
  });
});
describe("mergeOptions", () => {
  beforeEach(() => {
    mockExit.mockReset();
    mockLog.mockReset();
  });
  it("should exit and print a message", () => {
    exitInvalidFile();
    expect(mockExit).toHaveBeenCalled();
    expect(mockLog).toHaveBeenCalled();
  });
});
describe("mergeOptions", () => {
  it("should return the same options if no configFile is supplied", async () => {
    const result = await mergeOptions({
      host: "https://123.com",
    });
    expect(result.host).toBe("https://123.com");
  });

  it("should merge file and cli options", async () => {
    index.loadConfig.mockImplementation(async () => ({
      urls: [
        {
          title: "e",
          group: "1",
          href: "http://1.com",
        },
      ],
    }));
    const result = await mergeOptions(
      {
        title: "1",
      },
      "/a/b/c"
    );

    expect(result).toMatchObject({
      title: "1",
      urls: [
        {
          title: "e",
          group: "1",
          href: "http://1.com",
        },
      ],
    });
  });
});

describe("fileToLoad", () => {
  it("should return the default path if no custom path is set", () => {
    fs.existsSync.mockReturnValueOnce(true);
    const result = getFileToLoad("/abcd");
    expect(result).toMatch(`/abcd`);
  });
  it("should return the custom path if the file exists", () => {
    fs.existsSync.mockReturnValueOnce(true);
    path.resolve.mockReturnValue("/1");
    const result = getFileToLoad("/abcd", "/1");
    expect(result).toMatch("/1");
  });
});

describe("ensureDirectoryExistence", () => {
  it("should complete true if the path is found", () => {
    fs.existsSync.mockReturnValueOnce(true);
    const result = ensureDirectoryExistence("/1");
    expect(result).toBe(true);
  });
});
describe("validateOptions", () => {
  beforeEach(() => {
    mockExit.mockClear();
    mockLog.mockClear();
  });
  it("should exit for an invalid host", () => {
    validateOptions({ host: "1" });
    expect(mockExit).toHaveBeenCalledWith(1);
    expect(mockLog).toHaveBeenCalled();
  });
  it("should exit for two source types", () => {
    validateOptions({ urls: [], host: "1" });
    expect(mockExit).toHaveBeenCalledWith(1);
    const consoleLogs = (mockLog.mock.calls as any).flat().join("\n");
    expect(mockLog).toHaveBeenCalled();
    expect(consoleLogs).toMatch(/urls and host/g);
  });
  it("should exit for an invalid output option", () => {
    validateOptions({ output: "1.com" });
    expect(mockExit).toHaveBeenCalledWith(1);
    expect(mockLog).toHaveBeenCalled();
  });
});
