import { createBlockCallback } from "../utils/blocks/create_block_callback";
import { Context } from "telegraf";

export interface TelegramCommand {
	name: string;
	description: string;
	execute: (ctx: Context) => Promise<void>;
}

// Export array of callback commands
const callbacks: TelegramCommand[] = [
	createBlockCallback("deep", "add a deep block", "deep"),
	createBlockCallback("default", "add a default block", "default"),
	createBlockCallback("rapid", "add a rapid block", "rapid"),
];

export default callbacks;
