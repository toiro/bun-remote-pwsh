#!/usr/bin/env bun

/**
 * Basic usage example of bun-remote-pwsh module
 */

import { createRemotePwsh, executeRemotePowerShell } from "../src/lib.js";

async function basicUsageExample() {
	console.log("=== Basic Usage Example ===\n");

	// Example 1: Using the factory function
	console.log("1. Creating RemotePwshSSH instance:");
	const remotePwsh = createRemotePwsh({
		host: "10.9.88.17",
		user: "lab",
		scriptPath: "Get-Host",
	});

	console.log(`   Host: ${remotePwsh.host}`);
	console.log(`   User: ${remotePwsh.user}`);
	console.log(`   Script: ${remotePwsh.scriptPath}`);
	console.log(`   Encoding: ${remotePwsh.encode}\n`);

	// Example 2: Using the utility function (commented out for safety)
	console.log("2. Example of executeRemotePowerShell function:");
	console.log("   (Uncomment to run actual SSH connection)");
	console.log(`
   const result = await executeRemotePowerShell({
     host: '10.9.88.17',
     user: 'lab',
     scriptPath: 'Get-Date'
   });
   
   console.log('Exit code:', result.returnCode);
   console.log('Output:', result.stdout);
   console.log('Duration:', result.finishAt - result.startAt, 'ms');
	`);

	// Uncomment the following to test actual execution:
	/*
	try {
		const result = await executeRemotePowerShell({
			host: '10.9.88.17',
			user: 'lab',
			scriptPath: 'Get-Date'
		});
		
		console.log('Exit code:', result.returnCode);
		console.log('Output:', result.stdout);
		console.log('Duration:', result.finishAt - result.startAt, 'ms');
	} catch (error) {
		console.error('Error:', error);
	}
	*/
}

if (import.meta.main) {
	basicUsageExample().catch(console.error);
}