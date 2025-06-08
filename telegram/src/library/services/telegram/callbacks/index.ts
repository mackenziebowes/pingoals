import { createBlockCallback } from "../utils/blocks/create_block_callback";
import { Context } from "telegraf";
import { CALLBACKS } from "../utils/callback_enum";

export interface TelegramCommand {
	name: string;
	description: string;
	execute: (ctx: Context) => Promise<void>;
}

// Export array of callback commands
const callbacks: TelegramCommand[] = [
	createBlockCallback(CALLBACKS.ADD_DEEP_BLOCK, "add a deep block", "deep"),
	createBlockCallback(
		CALLBACKS.ADD_DEFAULT_BLOCK,
		"add a default block",
		"default"
	),
	createBlockCallback(CALLBACKS.ADD_RAPID_BLOCK, "add a rapid block", "rapid"),
];

export default callbacks;
