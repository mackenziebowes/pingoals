import { Context, Markup } from "telegraf";
import { TelegramCommand } from "./index";
import { db } from "~/utils/db";
import { ScheduleState } from "@ods/db";
import { CALLBACKS } from "../utils/callback_enum";

export const makeBlocks: TelegramCommand = {
	name: "make",
	description:
		"Starts the process of adding new blocks to the user's schedule.",

	async execute(ctx: Context) {
		const userId = ctx.chat?.id;
		let text: string = "";
		const message = await ctx.reply("👀 Checking you out...");
		if (!userId) {
			text = "❌ Couldn't identify you, sorry!";
		} else {
			const userSchedule = await db.tGUser.findUnique({
				where: {
					chatId: userId.toString(),
				},
				include: {
					schedule: {
						where: {
							state: ScheduleState.PENDING,
						},
					},
				},
			});
			// Prep Message
			if (!userSchedule) {
				text =
					"😔 Couldn't find your data, sorry. Use /start to create an account.";
			} else {
				text = "✅ Found you!";
			}
		}
		// Edit the original message with the updated info
		await ctx.telegram.editMessageText(
			ctx.chat!.id,
			message.message_id,
			undefined,
			text
		);
		ctx.reply(
			"Select a block to add:",
			Markup.inlineKeyboard([
				Markup.button.callback("Default", CALLBACKS.ADD_DEFAULT_BLOCK),
				Markup.button.callback("Deep", CALLBACKS.ADD_DEEP_BLOCK),
				Markup.button.callback("Rapid", CALLBACKS.ADD_RAPID_BLOCK),
			])
		);
	},
};
