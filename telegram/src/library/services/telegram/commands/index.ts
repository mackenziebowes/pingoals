import { pingCommand } from "./ping";
import { serverCommand } from "./server";
import { startCommand } from "./start";
import { blocksCommand } from "./blocks";
import { makeBlocks } from "./make";
import { Context } from "telegraf";

// Command interface
export interface TelegramCommand {
	name: string;
	description: string;
	execute: (ctx: Context) => Promise<void>;
}

// Export array of commands
const commands: TelegramCommand[] = [
	pingCommand,
	serverCommand,
	startCommand,
	blocksCommand,
	makeBlocks,
	// Add more commands here
];

export default commands;
