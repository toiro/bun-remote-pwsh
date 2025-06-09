import { test, expect, describe } from "bun:test";
import { RemotePwshSSH } from "../src/remote-pwsh/remote-pwsh";

interface TestConfig {
	host: string;
	user: string;
	enableIntegrationTest: boolean;
}

function loadTestConfig(): TestConfig {
	// 環境変数から設定を読み込み
	const host = process.env.TEST_SSH_HOST || "";
	const user = process.env.TEST_SSH_USER || "";
	const enableIntegrationTest =
		process.env.ENABLE_SSH_INTEGRATION_TEST === "true";

	return {
		host,
		user,
		enableIntegrationTest,
	};
}

// グローバルレベルで設定を読み込み
const config = loadTestConfig();

describe("Integration Tests - SSH Connection", () => {
	test("should skip integration tests when disabled", () => {
		if (!config.enableIntegrationTest) {
			console.log(
				"SSH integration tests are disabled. Set ENABLE_SSH_INTEGRATION_TEST=true to enable.",
			);
			expect(true).toBe(true); // Pass the test
			return;
		}
	});

	test.skipIf(!config.enableIntegrationTest)(
		"should connect and execute simple PowerShell command",
		async () => {
			if (!config.host || !config.user) {
				throw new Error(
					"TEST_SSH_HOST and TEST_SSH_USER must be set for integration tests",
				);
			}

			const scriptPath = "../resources/ps-scripts/hostname.ps1";
			const remotePwsh = new RemotePwshSSH(
				config.host,
				config.user,
				scriptPath,
			);

			const result = await remotePwsh.invokeAsync();

			expect(result.host).toBe(config.host);
			expect(result.user).toBe(config.user);
			expect(result.scriptPath).toBe(scriptPath);
			expect(result.returnCode).toBe(0);
			expect(result.stdout).toBeDefined();
			expect(result.startAt).toBeLessThan(result.finishAt);
			expect(result.finishAt - result.startAt).toBeGreaterThan(0);
		},
		30000,
	); // 30秒タイムアウト

	test.skipIf(!config.enableIntegrationTest)(
		"should handle PowerShell script execution",
		async () => {
			if (!config.host || !config.user) {
				throw new Error(
					"TEST_SSH_HOST and TEST_SSH_USER must be set for integration tests",
				);
			}

			const command = `
			$hostname = hostname
			$date = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
			Write-Output "Host: $hostname"
			Write-Output "Date: $date"
		`;

			const remotePwsh = new RemotePwshSSH(config.host, config.user, command);
			const result = await remotePwsh.invokeAsync();

			expect(result.returnCode).toBe(0);
			expect(result.stdout).toContain("Host:");
			expect(result.stdout).toContain("Date:");
			expect(remotePwsh.lastOutput).toBeDefined();
		},
		30000,
	);

	test.skipIf(!config.enableIntegrationTest)(
		"should handle command with error",
		async () => {
			if (!config.host || !config.user) {
				throw new Error(
					"TEST_SSH_HOST and TEST_SSH_USER must be set for integration tests",
				);
			}

			const command = "Get-NonExistentCommand";
			const remotePwsh = new RemotePwshSSH(config.host, config.user, command);

			const result = await remotePwsh.invokeAsync();

			expect(result.returnCode).not.toBe(0);
			expect(result.stderr).toBeDefined();
		},
		30000,
	);

	test.skipIf(!config.enableIntegrationTest)(
		"should handle Japanese text encoding",
		async () => {
			if (!config.host || !config.user) {
				throw new Error(
					"TEST_SSH_HOST and TEST_SSH_USER must be set for integration tests",
				);
			}

			const command = 'Write-Output "テスト出力: 日本語文字列"';
			const remotePwsh = new RemotePwshSSH(
				config.host,
				config.user,
				command,
				"utf8",
			);

			const result = await remotePwsh.invokeAsync();

			expect(result.returnCode).toBe(0);
			expect(result.stdout).toContain("テスト出力");
			expect(result.stdout).toContain("日本語文字列");
		},
		30000,
	);

	test.skipIf(!config.enableIntegrationTest)(
		"should handle long running command",
		async () => {
			if (!config.host || !config.user) {
				throw new Error(
					"TEST_SSH_HOST and TEST_SSH_USER must be set for integration tests",
				);
			}

			const command = `
			for ($i = 1; $i -le 3; $i++) {
				Write-Output "Step $i"
				Start-Sleep -Seconds 1
			}
			Write-Output "Completed"
		`;

			const remotePwsh = new RemotePwshSSH(config.host, config.user, command);
			const result = await remotePwsh.invokeAsync();

			expect(result.returnCode).toBe(0);
			expect(result.stdout).toContain("Step 1");
			expect(result.stdout).toContain("Step 2");
			expect(result.stdout).toContain("Step 3");
			expect(result.stdout).toContain("Completed");
			expect(result.finishAt - result.startAt).toBeGreaterThan(3000); // 最低3秒は実行される
		},
		60000,
	); // 60秒タイムアウト
});
