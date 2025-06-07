import { Telegraf } from "telegraf";
import { env } from "~/library/helpers/env";
import { setupCommandHandler } from "./commandHandler";

// Create a new Telegraf instance
const bot = new Telegraf(env.TG_BOT_TOKEN());

// Initialize the Telegram bot
export function initTelegramBot() {
	try {
		// Setup command handling
		setupCommandHandler(bot);

		// Launch the bot
		bot.launch();

		// Enable graceful stop
		process.once("SIGINT", () => bot.stop("SIGINT"));
		process.once("SIGTERM", () => bot.stop("SIGTERM"));

		console.log("Telegram bot initialized successfully!");
		return bot;
	} catch (error) {
		console.error("Error initializing Telegram bot:", error);
		throw error;
	}
}

export { bot };
