#!/usr/bin/env node
import { spawn } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const scriptsDir = path.dirname(fileURLToPath(import.meta.url));
const skillDir = path.dirname(scriptsDir);
const runDir = path.join(skillDir, ".run");
const artifactsDir = path.join(skillDir, "artifacts");
const statePath = path.join(runDir, "state.json");

function findRepoRoot(start) {
	let dir = start;
	for (let i = 0; i < 10; i++) {
		if (fs.existsSync(path.join(dir, "eleventy.config.js"))) return dir;
		const parent = path.dirname(dir);
		if (parent === dir) break;
		dir = parent;
	}
	throw new Error("Could not find eleventy.config.js walking up from the skill.");
}

const repoRoot = findRepoRoot(scriptsDir);
const DEFAULT_PORT = 8091;
const SHARED_PORT = 8080;

function parseArgs(argv) {
	const flags = {};
	const positional = [];
	for (let i = 0; i < argv.length; i++) {
		const a = argv[i];
		if (a.startsWith("--")) {
			const key = a.slice(2);
			const next = argv[i + 1];
			if (!next || next.startsWith("--")) flags[key] = true;
			else {
				flags[key] = next;
				i++;
			}
		} else positional.push(a);
	}
	return { flags, positional };
}

function readState() {
	if (!fs.existsSync(statePath)) {
		throw new Error(`No verification instance. Run: control-andypbrowne launch`);
	}
	return JSON.parse(fs.readFileSync(statePath, "utf8"));
}

function writeState(state) {
	fs.mkdirSync(runDir, { recursive: true });
	fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
}

function alive(pid) {
	if (!pid) return false;
	try {
		process.kill(pid, 0);
		return true;
	} catch {
		return false;
	}
}

function waitForHttp(url, timeoutMs) {
	const started = Date.now();
	return new Promise((resolve, reject) => {
		const tryOnce = () => {
			const req = http.get(url, (res) => {
				res.resume();
				if (res.statusCode && res.statusCode < 500) {
					resolve(res.statusCode);
					return;
				}
				retry();
			});
			req.on("error", retry);
			req.setTimeout(2000, () => {
				req.destroy();
				retry();
			});
		};
		const retry = () => {
			if (Date.now() - started > timeoutMs) {
				reject(new Error(`Timed out waiting for ${url}`));
				return;
			}
			setTimeout(tryOnce, 400);
		};
		tryOnce();
	});
}

function fetchText(url) {
	return new Promise((resolve, reject) => {
		http
			.get(url, (res) => {
				let body = "";
				res.setEncoding("utf8");
				res.on("data", (chunk) => {
					body += chunk;
				});
				res.on("end", () => resolve({ status: res.statusCode, body }));
			})
			.on("error", reject);
	});
}

function postJson(url, payload) {
	const data = Buffer.from(JSON.stringify(payload));
	return new Promise((resolve, reject) => {
		const req = http.request(
			url,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Content-Length": data.length,
				},
			},
			(res) => {
				let body = "";
				res.setEncoding("utf8");
				res.on("data", (chunk) => {
					body += chunk;
				});
				res.on("end", () => {
					let parsed = body;
					try {
						parsed = JSON.parse(body);
					} catch {}
					if (res.statusCode >= 400) {
						const msg = parsed && parsed.error ? parsed.error : body;
						reject(new Error(msg || `RPC ${res.statusCode}`));
						return;
					}
					resolve(parsed);
				});
			},
		);
		req.on("error", reject);
		req.write(data);
		req.end();
	});
}

function locatorFrom(page, flags) {
	if (flags.role) {
		const opts = {};
		if (flags.name) opts.name = flags.name;
		return page.getByRole(flags.role, opts);
	}
	if (flags.selector) return page.locator(flags.selector);
	if (flags.text) {
		return page.getByText(flags.text, {
			exact: flags.exact === true || flags.exact === "true",
		});
	}
	throw new Error("Need --role/--name, --selector, or --text");
}

async function handleRpc(page, payload) {
	const { op, flags = {}, positional = [] } = payload;
	switch (op) {
		case "goto": {
			const target = positional[0];
			if (!target) throw new Error("goto needs a path or URL");
			const base = process.env.VERIFY_BASE_URL;
			const url = target.startsWith("http")
				? target
				: base.replace(/\/$/, "") + (target.startsWith("/") ? target : "/" + target);
			await page.goto(url, { waitUntil: "domcontentloaded" });
			return { url: page.url() };
		}
		case "click":
			await locatorFrom(page, flags).first().click();
			return { ok: true };
		case "fill":
			if (flags.value === undefined) throw new Error("fill needs --value");
			await locatorFrom(page, flags).first().fill(String(flags.value));
			return { ok: true };
		case "press": {
			const key = flags.key;
			if (!key) throw new Error("press needs --key");
			if (flags.selector || flags.role || flags.text) {
				await locatorFrom(page, flags).first().press(key);
			} else {
				await page.keyboard.press(key);
			}
			return { ok: true };
		}
		case "check":
			await locatorFrom(page, flags).first().check();
			return { ok: true };
		case "uncheck":
			await locatorFrom(page, flags).first().uncheck();
			return { ok: true };
		case "select":
			if (flags.value === undefined) throw new Error("select needs --value");
			await locatorFrom(page, flags).first().selectOption(String(flags.value));
			return { ok: true };
		case "screenshot": {
			const out = flags.path;
			if (!out) throw new Error("screenshot needs --path");
			const dest = path.isAbsolute(out) ? out : path.join(skillDir, out);
			fs.mkdirSync(path.dirname(dest), { recursive: true });
			await page.screenshot({ path: dest, fullPage: Boolean(flags.full) });
			return { path: dest };
		}
		case "snapshot": {
			const out = flags.path;
			if (!out) throw new Error("snapshot needs --path");
			const dest = path.isAbsolute(out) ? out : path.join(skillDir, out);
			fs.mkdirSync(path.dirname(dest), { recursive: true });
			let text;
			try {
				text = await page.locator("body").ariaSnapshot();
			} catch {
				text = await page.locator("body").innerText();
			}
			fs.writeFileSync(dest, `${page.url()}\n${await page.title()}\n\n${text}\n`);
			return { path: dest };
		}
		case "text":
			return { text: await locatorFrom(page, flags).first().innerText() };
		case "url":
			return { url: page.url() };
		case "visible": {
			const loc = locatorFrom(page, flags);
			const vis = (await loc.count()) > 0 && (await loc.first().isVisible());
			if (!vis) throw new Error("not visible");
			return { visible: true };
		}
		case "count":
			return { count: await locatorFrom(page, flags).count() };
		case "title":
			return { title: await page.title() };
		default:
			throw new Error(`Unknown RPC op ${op}`);
	}
}

async function cmdDaemon() {
	const baseUrl = process.env.VERIFY_BASE_URL;
	const rpcPort = Number(process.env.VERIFY_RPC_PORT || 8092);
	if (!baseUrl) throw new Error("VERIFY_BASE_URL is required for daemon");
	fs.mkdirSync(runDir, { recursive: true });

	const browser = await chromium.launch({ headless: true });
	const context = await browser.newContext({
		viewport: { width: 1280, height: 800 },
		reducedMotion: "reduce",
	});
	const page = await context.newPage();
	await page.goto(baseUrl + "/", { waitUntil: "domcontentloaded" });

	const server = http.createServer(async (req, res) => {
		const send = (code, obj) => {
			res.writeHead(code, { "Content-Type": "application/json" });
			res.end(JSON.stringify(obj));
		};
		if (req.method === "GET" && req.url === "/health") {
			send(200, { ok: true, url: page.url(), title: await page.title() });
			return;
		}
		if (req.method !== "POST" || req.url !== "/rpc") {
			send(404, { error: "not found" });
			return;
		}
		let raw = "";
		req.setEncoding("utf8");
		req.on("data", (chunk) => {
			raw += chunk;
		});
		req.on("end", async () => {
			try {
				const payload = JSON.parse(raw || "{}");
				const result = await handleRpc(page, payload);
				send(200, result);
			} catch (err) {
				send(400, { error: err.message || String(err) });
			}
		});
	});

	await new Promise((resolve, reject) => {
		server.listen(rpcPort, "127.0.0.1", resolve);
		server.on("error", reject);
	});

	writeState({
		rpcUrl: `http://127.0.0.1:${rpcPort}`,
		baseUrl,
		daemonPid: process.pid,
	});

	const stop = async () => {
		server.close();
		await browser.close().catch(() => {});
		process.exit(0);
	};
	process.on("SIGTERM", stop);
	process.on("SIGINT", stop);
}

async function rpc(op, flags = {}, positional = []) {
	const state = readState();
	if (!state.rpcUrl) throw new Error("Browser RPC is not running. Relaunch.");
	return postJson(state.rpcUrl + "/rpc", { op, flags, positional });
}

async function cmdLaunch(flags) {
	const port = Number(flags.port || process.env.VERIFY_PORT || DEFAULT_PORT);
	const rpcPort = Number(flags["rpc-port"] || process.env.VERIFY_RPC_PORT || port + 1);
	if (port === SHARED_PORT && process.env.VERIFY_ALLOW_SHARED !== "1") {
		throw new Error(
			`Refusing port ${SHARED_PORT}. That is the human's usual npm start port. Use ${DEFAULT_PORT} (default) or set VERIFY_ALLOW_SHARED=1.`,
		);
	}
	if (fs.existsSync(statePath)) {
		const existing = JSON.parse(fs.readFileSync(statePath, "utf8"));
		if (alive(existing.eleventyPid) && alive(existing.browserPid)) {
			throw new Error(`Already running on ${existing.baseUrl}. Doctor it or cleanup first.`);
		}
		await cmdCleanup({ quiet: true });
	}

	fs.mkdirSync(runDir, { recursive: true });
	fs.mkdirSync(artifactsDir, { recursive: true });

	const eleventyLog = fs.openSync(path.join(runDir, "eleventy.log"), "w");
	const eleventy = spawn(
		"npx",
		["@11ty/eleventy", "--serve", `--port=${port}`, "--quiet"],
		{
			cwd: repoRoot,
			detached: true,
			stdio: ["ignore", eleventyLog, eleventyLog],
			env: { ...process.env, BROWSER: "none" },
		},
	);
	eleventy.unref();

	const baseUrl = `http://127.0.0.1:${port}`;
	try {
		await waitForHttp(baseUrl + "/", 90000);
	} catch (err) {
		try {
			process.kill(eleventy.pid);
		} catch {}
		throw err;
	}

	const daemonLog = fs.openSync(path.join(runDir, "browser.log"), "w");
	const daemon = spawn(process.execPath, [fileURLToPath(import.meta.url), "daemon"], {
		cwd: repoRoot,
		detached: true,
		stdio: ["ignore", daemonLog, daemonLog],
		env: {
			...process.env,
			VERIFY_BASE_URL: baseUrl,
			VERIFY_RPC_PORT: String(rpcPort),
		},
	});
	daemon.unref();

	const started = Date.now();
	let state;
	while (Date.now() - started < 30000) {
		if (fs.existsSync(statePath)) {
			try {
				state = JSON.parse(fs.readFileSync(statePath, "utf8"));
				if (state.rpcUrl) break;
			} catch {}
		}
		await new Promise((r) => setTimeout(r, 200));
	}
	if (!state?.rpcUrl) {
		try {
			process.kill(eleventy.pid);
		} catch {}
		try {
			process.kill(daemon.pid);
		} catch {}
		throw new Error("Browser daemon did not publish an RPC URL.");
	}

	state.eleventyPid = eleventy.pid;
	state.browserPid = daemon.pid;
	state.port = port;
	state.rpcPort = rpcPort;
	state.baseUrl = baseUrl;
	state.repoRoot = repoRoot;
	writeState(state);
	console.log(baseUrl);
}

async function cmdDoctor() {
	const state = readState();
	const problems = [];
	if (!alive(state.eleventyPid)) problems.push(`Eleventy pid ${state.eleventyPid} is not running`);
	if (!alive(state.browserPid)) problems.push(`Browser pid ${state.browserPid} is not running`);
	if (state.port === SHARED_PORT && process.env.VERIFY_ALLOW_SHARED !== "1") {
		problems.push(`Instance is on shared port ${SHARED_PORT}`);
	}
	let home;
	try {
		home = await fetchText(state.baseUrl + "/");
	} catch (err) {
		problems.push(`GET / failed: ${err.message}`);
	}
	if (home && home.status !== 200) problems.push(`GET / status ${home.status}`);
	if (home && !/Andypbrowne/.test(home.body)) problems.push("Home HTML is missing Andypbrowne");
	if (home && !/command-bar-trigger/.test(home.body)) {
		problems.push("Home HTML is missing the command palette trigger");
	}
	try {
		const health = await fetchText(state.rpcUrl + "/health");
		if (health.status !== 200) problems.push(`RPC health ${health.status}`);
		else if (!/Andypbrowne/i.test(health.body)) problems.push(`Browser title missing Andypbrowne: ${health.body}`);
	} catch (err) {
		problems.push(`Browser RPC failed: ${err.message}`);
	}
	if (problems.length) {
		console.error(problems.join("\n"));
		process.exit(1);
	}
	console.log(`ok ${state.baseUrl} eleventy=${state.eleventyPid} browser=${state.browserPid}`);
}

async function cmdCleanup(flags = {}) {
	let state = null;
	if (fs.existsSync(statePath)) {
		try {
			state = JSON.parse(fs.readFileSync(statePath, "utf8"));
		} catch {}
	}
	for (const pid of [state?.eleventyPid, state?.browserPid, state?.daemonPid]) {
		if (alive(pid)) {
			try {
				process.kill(pid, "SIGTERM");
			} catch {}
		}
	}
	await new Promise((r) => setTimeout(r, 400));
	for (const pid of [state?.eleventyPid, state?.browserPid, state?.daemonPid]) {
		if (alive(pid)) {
			try {
				process.kill(pid, "SIGKILL");
			} catch {}
		}
	}
	if (fs.existsSync(statePath)) fs.rmSync(statePath, { force: true });
	if (!flags.quiet) console.log("cleaned verification instance (artifacts kept)");
}

function printResult(result) {
	if (result == null) return;
	if (typeof result === "string") {
		console.log(result);
		return;
	}
	if (result.url) console.log(result.url);
	if (result.path) console.log(result.path);
	if (result.text) console.log(result.text);
	if (result.count !== undefined) console.log(String(result.count));
	if (result.visible) console.log("visible");
	if (result.title && !result.url) console.log(result.title);
}

async function cmdHttp(positional) {
	const state = readState();
	const target = positional[0] || "/";
	const url = target.startsWith("http")
		? target
		: state.baseUrl.replace(/\/$/, "") + (target.startsWith("/") ? target : "/" + target);
	const res = await fetchText(url);
	console.log(String(res.status));
	if (positional.includes("--body")) console.log(res.body);
}

const { flags, positional } = parseArgs(process.argv.slice(2));
const cmd = positional.shift();
const rpcOps = new Set([
	"goto",
	"click",
	"fill",
	"press",
	"check",
	"uncheck",
	"select",
	"screenshot",
	"snapshot",
	"text",
	"url",
	"visible",
	"count",
]);

try {
	if (cmd === "launch") await cmdLaunch(flags);
	else if (cmd === "daemon") await cmdDaemon();
	else if (cmd === "doctor") await cmdDoctor();
	else if (cmd === "cleanup") await cmdCleanup(flags);
	else if (cmd === "http") await cmdHttp(positional);
	else if (rpcOps.has(cmd)) {
		const result = await rpc(cmd, flags, positional);
		printResult(result);
	} else {
		console.error(
			"Usage: control-andypbrowne <launch|doctor|cleanup|goto|click|fill|press|check|uncheck|select|screenshot|snapshot|text|url|visible|count|http>",
		);
		process.exit(2);
	}
} catch (err) {
	console.error(err.message || err);
	process.exit(1);
}
