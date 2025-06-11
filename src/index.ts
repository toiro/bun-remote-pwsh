import { parseArgs } from "node:util";
import { createRemotePwshExecutor } from "./remote-pwsh/index.js";

const { values, positionals } = parseArgs({
	args: Bun.argv.slice(2),
	options: {
		host: {
			type: "string",
		},
		user: {
			type: "string",
		},
	},
	strict: true,
	allowPositionals: true,
});

const scriptPath = positionals[0];
const host = values.host;
const user = values.user;

export async function executeScript(host: string | undefined, user: string | undefined, scriptPath: string | undefined) {
	if (!host) {
		console.error("Host is required (use --host)");
		process.exit(1);
	}
	
	if (!user) {
		console.error("User is required (use --user)");
		process.exit(1);
	}
	
	if (!scriptPath) {
		console.error("Script path is required");
		process.exit(1);
	}
	
	try {
		const scriptContent = await Bun.file(scriptPath).text();
		const executor = createRemotePwshExecutor({ 
			host, 
			user, 
			scriptPath: scriptContent 
		});
		const result = await executor.invokeAsync();
		
		console.log(`Executed on ${result.host} as ${result.user}`);
		console.log(`Return code: ${result.returnCode}`);
		console.log(`Duration: ${result.finishAt - result.startAt}ms`);
		
		if (result.stdout) {
			console.log("STDOUT:");
			console.log(result.stdout);
		}
		
		if (result.stderr) {
			console.error("STDERR:");
			console.error(result.stderr);
		}
		
		process.exit(result.returnCode);
	} catch (error) {
		console.error("Error executing script:", error);
		process.exit(1);
	}
}

if (import.meta.main) {
	executeScript(host, user, scriptPath);
}
