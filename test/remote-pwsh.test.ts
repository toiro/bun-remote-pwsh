import { test, expect, describe } from "bun:test";
import { createRemotePwshExecutor } from "../src/remote-pwsh/index.js";

describe("RemotePwshExecutor", () => {
	test("should create executor with correct parameters", () => {
		const host = "10.9.88.17";
		const user = "testuser";
		const scriptPath = "Get-Host";

		const executor = createRemotePwshExecutor({ host, user, scriptPath });

		expect(executor).toBeDefined();
		expect(executor.lastOutput).toBe("");
	});

	test("should create executor with default encoding", () => {
		const executor = createRemotePwshExecutor({
			host: "10.9.88.17",
			user: "testuser",
			scriptPath: "Get-Host"
		});
		expect(executor).toBeDefined();
	});

	test("should create executor with custom encoding", () => {
		const executor = createRemotePwshExecutor({
			host: "10.9.88.17",
			user: "testuser",
			scriptPath: "Get-Host",
			encode: "sjis"
		});
		expect(executor).toBeDefined();
	});

	test("should initialize lastOutput", () => {
		const executor = createRemotePwshExecutor({
			host: "10.9.88.17",
			user: "testuser",
			scriptPath: "Get-Host"
		});
		expect(executor.lastOutput).toBe("");
	});

	test("should have invoke and invokeAsync methods", () => {
		const executor = createRemotePwshExecutor({
			host: "10.9.88.17",
			user: "testuser",
			scriptPath: "Get-Host"
		});
		expect(executor.invoke).toBeDefined();
		expect(executor.invokeAsync).toBeDefined();
		expect(executor.on).toBeDefined();
	});
});
