import { addDeepBlocks } from "./add_deep_block";
import { addDefaultBlocks } from "./add_default_block";
import { addRapidBlocks } from "./add_rapid_block";
import { Context } from "telegraf";

export interface TelegramCommand {
	name: string;
	description: string;
	execute: (ctx: Context) => Promise<void>;
}

// Export array of callback commands
const callbacks: TelegramCommand[] = [
	addDeepBlocks,
	addDefaultBlocks,
	addRapidBlocks,
	// Add more callbacks here
];

export default callbacks;
