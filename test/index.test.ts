import { test, expect, describe, spyOn } from "bun:test";

describe("executeScript function", () => {
  test("should throw error when host is undefined", async () => {
    const consoleSpy = spyOn(console, "error").mockImplementation(() => {});
    const processSpy = spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit called");
    });
    
    const { executeScript } = await import("../src/index");
    
    try {
      await executeScript(undefined, "user", "script.ps1");
    } catch (error) {
      expect(error.message).toBe("process.exit called");
    }
    
    expect(consoleSpy).toHaveBeenCalledWith("Host is required (use --host)");
    expect(processSpy).toHaveBeenCalledWith(1);
    
    consoleSpy.mockRestore();
    processSpy.mockRestore();
  });

  test("should throw error when user is undefined", async () => {
    const consoleSpy = spyOn(console, "error").mockImplementation(() => {});
    const processSpy = spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit called");
    });
    
    const { executeScript } = await import("../src/index");
    
    try {
      await executeScript("10.9.88.17", undefined, "script.ps1");
    } catch (error) {
      expect(error.message).toBe("process.exit called");
    }
    
    expect(consoleSpy).toHaveBeenCalledWith("User is required (use --user)");
    expect(processSpy).toHaveBeenCalledWith(1);
    
    consoleSpy.mockRestore();
    processSpy.mockRestore();
  });

  test("should throw error when scriptPath is undefined", async () => {
    const consoleSpy = spyOn(console, "error").mockImplementation(() => {});
    const processSpy = spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit called");
    });
    
    const { executeScript } = await import("../src/index");
    
    try {
      await executeScript("10.9.88.17", "user", undefined);
    } catch (error) {
      expect(error.message).toBe("process.exit called");
    }
    
    expect(consoleSpy).toHaveBeenCalledWith("Script path is required");
    expect(processSpy).toHaveBeenCalledWith(1);
    
    consoleSpy.mockRestore();
    processSpy.mockRestore();
  });
});