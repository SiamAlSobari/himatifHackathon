// Mock fs and path
jest.mock("fs", () => ({
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
}));

jest.mock("path", () => ({
  join: jest.fn((...args: string[]) => args.join("/")),
}));

import { loadPrompt } from "@/ai/loader";
import fs from "fs";

const mockExistsSync = fs.existsSync as jest.Mock;
const mockReadFileSync = fs.readFileSync as jest.Mock;

describe("loadPrompt", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should load prompt file content", () => {
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue("Test prompt content");

    const result = loadPrompt("test.prompt");

    expect(result).toBe("Test prompt content");
    expect(fs.existsSync).toHaveBeenCalled();
    expect(fs.readFileSync).toHaveBeenCalled();
  });

  it("should throw error if file not found", () => {
    mockExistsSync.mockReturnValue(false);

    expect(() => loadPrompt("nonexistent.prompt")).toThrow("Root Prompt not found");
  });

  it("should cache prompt content after first load", () => {
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValueOnce("Cached content");

    // Call twice
    const result1 = loadPrompt("cached.prompt");
    const result2 = loadPrompt("cached.prompt");

    expect(result1).toBe("Cached content");
    expect(result2).toBe("Cached content");
    // fs operations should only be called once due to caching
    expect(mockReadFileSync).toHaveBeenCalledTimes(1);
  });
});
