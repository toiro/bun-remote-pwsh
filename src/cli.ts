#!/usr/bin/env node

import { parseArgs } from "node:util";
import { executeScript } from "./index.js";

const { values, positionals } = parseArgs({
	args: process.argv.slice(2),
	options: {
		host: {
			type: "string",
		},
		user: {
			type: "string",
		},
		help: {
			type: "boolean",
			short: "h",
		},
		version: {
			type: "boolean",
			short: "v",
		},
	},
	strict: true,
	allowPositionals: true,
});

if (values.help) {
	console.log(`
bun-remote-pwsh - PowerShell SSH remoting tool

Usage:
  bun-remote-pwsh --host <hostname> --user <username> <script-path>

Options:
  --host <hostname>    Remote Windows host to connect to
  --user <username>    SSH username for authentication
  -h, --help          Show this help message
  -v, --version       Show version information

Examples:
  bun-remote-pwsh --host 10.9.88.17 --user administrator ./script.ps1
  bun-remote-pwsh --host server.example.com --user admin Get-Host

Note: This tool uses SSH public key authentication. Ensure your SSH keys are properly configured.
`);
	process.exit(0);
}

if (values.version) {
	// Note: In a real package, you'd import this from package.json
	console.log("bun-remote-pwsh v1.0.0");
	process.exit(0);
}

const scriptPath = positionals[0];
const host = values.host;
const user = values.user;

if (import.meta.main) {
	executeScript(host, user, scriptPath);
}