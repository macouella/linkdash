import * as _fs from "fs";
import jsesc from "jsesc";
import { mocked } from "ts-jest/utils";
import { buildTemplate, loadConfig, loadConfigSync } from "./index";
import _loadFile from "./loadFile";
import _validateConfig from "./validateConfig";

const validateConfig = mocked(_validateConfig);
const loadFile = mocked(_loadFile);
const fs = mocked(_fs);

enum MOCK_FILE_KEYS {
  file_1,
  file_2,
  file_3,
}

const callableConfig = jest.fn().mockImplementation(async function () {
  return {
    title: 2,
    urls: [],
  };
});

const callableConfigSync = jest.fn().mockImplementation(function () {
  return {
    title: 3,
    urls: [],
  };
});

const MOCK_FILE_INFO = {
  [MOCK_FILE_KEYS.file_1]: {
    title: 1,
    urls: [],
  },
  [MOCK_FILE_KEYS.file_2]: callableConfig,
  [MOCK_FILE_KEYS.file_3]: callableConfigSync,
};

jest.mock("./loadFile");
jest.mock("./validateConfig");
jest.mock("fs");

beforeAll(() => {
  const un: any = (fileName: MOCK_FILE_KEYS) => {
    return MOCK_FILE_INFO[fileName];
  };
  loadFile.mockImplementation(un);
  fs.readFileSync.mockReturnValue({
    toString: jest.fn().mockReturnValue(`
    //_linkdashConfig
    <meta name="linkdashHead" content=""/>
    `),
  } as any);
});

describe("loadConfig", () => {
  it("should return a config object", async () => {
    const fileSummary = await loadConfig(MOCK_FILE_KEYS.file_1 as any);
    expect(fileSummary).toMatchObject({ title: 1, urls: [] });
  });
  it("should return a config object when a function is present", () => {
    const fileSummary = loadConfig(MOCK_FILE_KEYS.file_2 as any);
    expect(fileSummary.then).toBeTruthy();
    expect(callableConfig).toHaveBeenCalled();

    return expect(fileSummary).resolves.toMatchObject({ title: 2, urls: [] });
  });
});

describe("loadConfigSync", () => {
  it("should return a config object", () => {
    const fileSummary = loadConfigSync(MOCK_FILE_KEYS.file_1 as any);
    expect(fileSummary).toMatchObject({ title: 1, urls: [] });
  });
  it("should return a config object when a function is present", () => {
    const fileSummary = loadConfigSync(MOCK_FILE_KEYS.file_3 as any);
    expect(callableConfig).toHaveBeenCalled();
    expect(fileSummary).toMatchObject({ title: 3, urls: [] });
  });
});

describe("buildTemplate", () => {
  beforeEach(() => {
    validateConfig.mockClear();
  });
  it("should validate the config file", () => {
    buildTemplate({});
    expect(validateConfig).toHaveBeenCalledTimes(1);
  });
  it("should inject the config options supplied", () => {
    const opts = {
      urls: [],
      title: "123",
      htmlHead: "<meta name='1' content='2' />",
    };
    const { htmlHead, ...injectable } = opts;
    const result = buildTemplate(opts);
    const escaped = jsesc(injectable as any, {
      isScriptContext: true,
      json: true,
      // For testing - turn the escaped object into a string
      wrap: true,
    });
    expect(result).toContain(escaped);
    expect(result).toContain(htmlHead);
  });
});
