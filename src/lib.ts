// Main library exports for bun-remote-pwsh module
export { RemotePwshSSH } from "./remote-pwsh/remote-pwsh.js";
export type { RemotePwshResult, RemotePwshOptions } from "./remote-pwsh/remote-pwsh.js";
export { executeScript } from "./index.js";

// Import types for internal use
import type { RemotePwshResult } from "./remote-pwsh/remote-pwsh.js";
import { RemotePwshSSH } from "./remote-pwsh/remote-pwsh.js";

// Re-export commonly used types and utilities
export interface ExecuteScriptOptions {
	host: string;
	user: string;
	scriptPath: string;
	encode?: string;
}

/**
 * Create a RemotePwshSSH instance with simplified configuration
 * 
 * @param options Configuration options for remote PowerShell execution
 * @returns RemotePwshSSH instance ready for execution
 * 
 * @example
 * ```typescript
 * import { createRemotePwsh } from 'bun-remote-pwsh';
 * 
 * const remotePwsh = createRemotePwsh({
 *   host: '10.9.88.17',
 *   user: 'administrator',
 *   scriptPath: 'Get-Host'
 * });
 * 
 * const result = await remotePwsh.invokeAsync();
 * console.log(result.stdout);
 * ```
 */
export function createRemotePwsh(options: ExecuteScriptOptions): RemotePwshSSH {
	return RemotePwshSSH.create({
		host: options.host,
		user: options.user,
		scriptPath: options.scriptPath,
		encode: options.encode,
	});
}

/**
 * Execute a PowerShell script on a remote host with simplified interface
 * 
 * @param options Configuration options for remote PowerShell execution
 * @returns Promise resolving to execution result
 * 
 * @example
 * ```typescript
 * import { executeRemotePowerShell } from 'bun-remote-pwsh';
 * 
 * const result = await executeRemotePowerShell({
 *   host: '10.9.88.17',
 *   user: 'administrator',
 *   scriptPath: './scripts/test.ps1'
 * });
 * 
 * console.log(`Exit code: ${result.returnCode}`);
 * console.log(`Output: ${result.stdout}`);
 * ```
 */
export async function executeRemotePowerShell(options: ExecuteScriptOptions): Promise<RemotePwshResult> {
	const remotePwsh = createRemotePwsh(options);
	return await remotePwsh.invokeAsync();
}