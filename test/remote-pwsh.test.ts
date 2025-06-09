import { test, expect, describe } from "bun:test";
import { RemotePwshSSH } from "../src/remote-pwsh/remote-pwsh";

describe("RemotePwshSSH", () => {
	test("should create instance with correct parameters", () => {
		const host = "10.9.88.17";
		const user = "testuser";
		const command = "Get-Host";

		const remotePwsh = new RemotePwshSSH(host, user, command);

		expect(remotePwsh.host).toBe(host);
		expect(remotePwsh.user).toBe(user);
		expect(remotePwsh.command).toBe(command);
	});

	test("should create instance with default encoding", () => {
		const remotePwsh = new RemotePwshSSH("10.9.88.17", "testuser", "Get-Host");
		expect(remotePwsh.encode).toBe("utf8");
	});

	test("should create instance with custom encoding", () => {
		const remotePwsh = new RemotePwshSSH(
			"10.9.88.17",
			"testuser",
			"Get-Host",
			"sjis",
		);
		expect(remotePwsh.encode).toBe("sjis");
	});

	test("should initialize count and lastOutput", () => {
		const remotePwsh = new RemotePwshSSH("10.9.88.17", "testuser", "Get-Host");
		expect(remotePwsh.count).toBe(0);
		expect(remotePwsh.lastOutput).toBe("");
	});

	test("should be an EventEmitter", () => {
		const remotePwsh = new RemotePwshSSH("10.9.88.17", "testuser", "Get-Host");
		expect(remotePwsh.on).toBeDefined();
		expect(remotePwsh.emit).toBeDefined();
		expect(remotePwsh.removeListener).toBeDefined();
	});
});
