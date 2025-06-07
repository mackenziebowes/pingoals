import { Hono } from "hono";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import { init, env } from "~/library/helpers/env";
import { initTelegramBot } from "~/library/services/telegram";
import { registerCommands } from "~/library/services/telegram/registerCommands";
import { loadConfig } from "~/utils/config";
import { makeAlertCron } from "./library/services/cron/alert";

// Initialize environment
init();

// Create Hono app
const app = new Hono();

app.use(prettyJSON());

app.use(
	"/*",
	cors({
		origin: "*",
	})
);

// Initialize Telegram bot and server
async function startServer() {
	try {
		// Load configuration
		const config = await loadConfig();

		// Initialize Telegram bot
		const telegramBot = initTelegramBot();

		// Register Telegram commands if enabled
		if (config.features.autoRegisterCommands) {
			await registerCommands(telegramBot);
		}
		// telegramBot can be passed by value here to access context and methods
		// eg: makeAlertCron(telegramBot);
		console.log("Telegram bot initialized successfully!");
		const alertCron = makeAlertCron(telegramBot);
		setInterval(alertCron, 60_000);
		// Return server configuration
		return {
			port: config.server.port || 3060,
			fetch: app.fetch,
		};
	} catch (error) {
		console.error("Failed to start server:", error);
		// Return basic server config if Telegram initialization fails
		return {
			port: 3060,
			fetch: app.fetch,
		};
	}
}

// Use top-level await for cleaner code (Bun supports this)
const serverConfig = await startServer();
export default serverConfig;
