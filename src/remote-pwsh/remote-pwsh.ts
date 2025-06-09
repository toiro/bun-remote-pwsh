import { EventEmitter } from "node:events";
import { spawn, type ChildProcess } from "node:child_process";
import * as iconv from "iconv-lite";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SESSION_SCRIPT_PATH = join(
	__dirname,
	"../../resources/ps-scripts/sshRemoteSession.ps1",
);

export interface RemotePwshResult {
	host: string;
	user: string;
	scriptPath: string;
	startAt: number;
	finishAt: number;
	returnCode: number;
	stdout: string;
	stderr: string;
	lastOutput: string;
}

export interface RemotePwshOptions {
	host: string;
	user: string;
	scriptPath: string;
	encode?: string;
}

export class RemotePwshSSH extends EventEmitter {
	private count = 0;
	private _lastOutput = "";

	public get lastOutput(): string {
		return this._lastOutput;
	}

	constructor(
		public readonly host: string,
		public readonly user: string,
		public readonly scriptPath: string,
		public readonly encode: string = "utf8",
	) {
		super();
	}

	static create(options: RemotePwshOptions): RemotePwshSSH {
		return new RemotePwshSSH(
			options.host,
			options.user,
			options.scriptPath,
			options.encode ?? "utf8",
		);
	}

	public invoke(): void {
		this.preparePowerShellEnvironment();
		const powerShell = this.spawnPowerShellProcess();
		this.setupEventHandlers(powerShell);
	}

	private preparePowerShellEnvironment(): void {
		// delete env.PSModulePath to avoid this issue (https://github.com/PowerShell/PowerShell/issues/18530)
		// biome-ignore lint/performance/noDelete: <バグ回避コードのため、変更には検証が必要>
		delete process.env.PSModulePath;
	}

	private spawnPowerShellProcess(): ChildProcess {
		return spawn("pwsh", [
			SESSION_SCRIPT_PATH,
			this.host,
			this.user,
			this.scriptPath,
		]);
	}

	private setupEventHandlers(powerShell: ChildProcess): void {
		this.emit("start");

		powerShell.stdout?.on("data", (data: Buffer) => {
			this.handleStdoutData(data);
		});

		powerShell.stderr?.on("data", (data: Buffer) => {
			this.handleStderrData(data);
		});

		powerShell.on("error", (error: Error) => {
			this.emit("error", error);
		});

		powerShell.on("close", (code: number | null) => {
			this.emit("finish", code, this.lastOutput);
		});
	}

	private handleStdoutData(data: Buffer): void {
		this._lastOutput = iconv.decode(data, this.encode);
		this.emit("stdout", this._lastOutput, this.count);
		this.count += 1;
	}

	private handleStderrData(data: Buffer): void {
		this._lastOutput = iconv.decode(data, this.encode);
		this.emit("stderr", this._lastOutput);
	}

	public async invokeAsync(): Promise<RemotePwshResult> {
		return new Promise<RemotePwshResult>((resolve, reject) => {
			const startAt = Date.now();
			let stdout = "";
			let stderr = "";

			const cleanupListeners = () => {
				this.removeAllListeners("stdout");
				this.removeAllListeners("stderr");
				this.removeAllListeners("error");
				this.removeAllListeners("finish");
			};

			this.on("stdout", (line: string) => {
				stdout += line;
			})
				.on("stderr", (line: string) => {
					stderr += line;
				})
				.on("error", (error: Error) => {
					cleanupListeners();
					reject(error);
				})
				.on("finish", (code: number | null, lastOutput: string) => {
					cleanupListeners();
					if (code === null) {
						reject(new Error("Exit code is null"));
						return;
					}

					const finishAt = Date.now();
					resolve({
						host: this.host,
						user: this.user,
						scriptPath: this.scriptPath,
						startAt,
						finishAt,
						stdout,
						stderr,
						returnCode: code,
						lastOutput,
					});
				});

			this.invoke();
		});
	}
}
