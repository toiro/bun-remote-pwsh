import { test, expect, describe } from "bun:test";
import { createRemotePwsh, executeRemotePowerShell, RemotePwshSSH } from "./lib.js";

describe("lib module exports", () => {
	test("should export RemotePwshSSH class", () => {
		expect(RemotePwshSSH).toBeDefined();
		expect(typeof RemotePwshSSH).toBe("function");
	});

	test("should export createRemotePwsh factory function", () => {
		expect(createRemotePwsh).toBeDefined();
		expect(typeof createRemotePwsh).toBe("function");
	});

	test("should export executeRemotePowerShell utility function", () => {
		expect(executeRemotePowerShell).toBeDefined();
		expect(typeof executeRemotePowerShell).toBe("function");
	});

	test("createRemotePwsh should create RemotePwshSSH instance", () => {
		const options = {
			host: "10.9.88.17",
			user: "testuser",
			scriptPath: "Get-Host",
		};

		const instance = createRemotePwsh(options);

		expect(instance).toBeInstanceOf(RemotePwshSSH);
		expect(instance.host).toBe(options.host);
		expect(instance.user).toBe(options.user);
		expect(instance.scriptPath).toBe(options.scriptPath);
	});

	test("createRemotePwsh should use default encoding", () => {
		const options = {
			host: "10.9.88.17",
			user: "testuser",
			scriptPath: "Get-Host",
		};

		const instance = createRemotePwsh(options);
		expect(instance.encode).toBe("utf8");
	});

	test("createRemotePwsh should accept custom encoding", () => {
		const options = {
			host: "10.9.88.17",
			user: "testuser",
			scriptPath: "Get-Host",
			encode: "sjis",
		};

		const instance = createRemotePwsh(options);
		expect(instance.encode).toBe("sjis");
	});
});