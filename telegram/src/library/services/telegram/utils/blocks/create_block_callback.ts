import { allBlocks } from ".";
import type { Context } from "telegraf";
import { addBlocks } from "./add_block";

export const createBlockCallback = (
	name: string,
	description: string,
	key: keyof typeof allBlocks
) => {
	return {
		name,
		description,
		async execute(ctx: Context) {
			await addBlocks(ctx, key);
		},
	};
};
