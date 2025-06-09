#!/usr/bin/env bun

/**
 * Advanced usage example of bun-remote-pwsh module
 */

import { RemotePwshSSH, type RemotePwshResult } from "../src/lib.js";

async function advancedUsageExample() {
	console.log("=== Advanced Usage Example ===\n");

	// Example 1: Event-driven execution
	console.log("1. Event-driven execution with real-time output:");
	
	const remotePwsh = new RemotePwshSSH(
		"10.9.88.17",
		"lab",
		`
		for ($i = 1; $i -le 3; $i++) {
			Write-Output "Processing step $i..."
			Start-Sleep -Seconds 1
		}
		Write-Output "Completed!"
		`,
		"utf8"
	);

	// Set up event listeners for real-time monitoring
	remotePwsh.on("start", () => {
		console.log("   📡 SSH connection started");
	});

	remotePwsh.on("stdout", (data: string, count: number) => {
		console.log(`   📤 Output #${count}: ${data.trim()}`);
	});

	remotePwsh.on("stderr", (data: string) => {
		console.log(`   ❌ Error: ${data.trim()}`);
	});

	remotePwsh.on("finish", (code: number | null, lastOutput: string) => {
		console.log(`   ✅ Execution finished with code: ${code}`);
		console.log(`   📄 Last output: ${remotePwsh.lastOutput.substring(0, 50)}...`);
	});

	// Example of commented execution
	console.log("   (Uncomment to run actual SSH connection)\n");

	// Uncomment to test actual execution:
	/*
	try {
		const result = await remotePwsh.invokeAsync();
		console.log('Final result:', {
			returnCode: result.returnCode,
			duration: result.finishAt - result.startAt,
			outputLength: result.stdout.length
		});
	} catch (error) {
		console.error('Error:', error);
	}
	*/

	// Example 2: Different encoding examples
	console.log("2. Different encoding configurations:");
	
	const encodingExamples = [
		{ encoding: "utf8", description: "Standard UTF-8 (default)" },
		{ encoding: "sjis", description: "Japanese Shift-JIS" },
		{ encoding: "ascii", description: "ASCII encoding" }
	];

	encodingExamples.forEach(({ encoding, description }) => {
		const instance = new RemotePwshSSH(
			"example.host",
			"user",
			'Write-Output "Hello World"',
			encoding
		);
		console.log(`   ${encoding.toUpperCase()}: ${description} - Instance created`);
	});

	console.log("\n3. Factory method with options:");
	const factoryInstance = RemotePwshSSH.create({
		host: "10.9.88.17",
		user: "lab",
		scriptPath: "Get-ComputerInfo | Select-Object WindowsProductName, TotalPhysicalMemory",
		encode: "utf8"
	});

	console.log(`   Created via factory: ${factoryInstance.host}@${factoryInstance.user}`);
	console.log(`   Script: ${factoryInstance.scriptPath.substring(0, 50)}...`);
}

if (import.meta.main) {
	advancedUsageExample().catch(console.error);
}