import { env } from "~/library/helpers/env";

function generateTelegramLink() {
	const token = env.TG_BOT_TOKEN();

	if (!token) {
		console.error("Error: TELEGRAM_TOKEN is not set in environment variables");
		process.exit(1);
	}

	// Extract bot username from token (format: 123456789:ABC-DEF_...)
	const botUsername = token.split(":")[0];

	console.log("\n=== Telegram Bot Links ===");
	console.log(`Direct link to your bot: https://t.me/bot${botUsername}`);
	console.log(
		`Bot profile link: https://t.me/${env.TG_BOT_USER() || "your_bot_username"}`
	);
	console.log("\nYou can also search for your bot in Telegram by username");
	console.log("==========================================\n");
}

// Initialize environment variables
import { init } from "~/library/helpers/env";
init();

// Generate and display the link
generateTelegramLink();
