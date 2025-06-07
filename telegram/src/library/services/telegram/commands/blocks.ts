import { Context } from "telegraf";
import { TelegramCommand } from "./index";
import { db } from "~/utils/db";
import { ScheduleState } from "@ods/db";

export const blocksCommand: TelegramCommand = {
	name: "blocks",
	description: "Shows upcoming blocks for user.",

	async execute(ctx: Context) {
		const userId = ctx.chat?.id;
		let text: string = "";
		const message = await ctx.reply("🏰 Checking Blocks...");
		if (!userId) {
			text = "Couldn't identify you, sorry!";
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
				text = "😔 Couldn't find your blocks, sorry.";
			}
			if (userSchedule && userSchedule.schedule.length === 0) {
				text = "🤔 You have no upcoming blocks. Use /make to add blocks!";
			}
			if (userSchedule && userSchedule.schedule.length > 0) {
				text += "✅ Here's your next few blocks:\n";
				for (const item of userSchedule.schedule) {
					text += `${item.label} at ${item.startAt}\n`;
				}
			}
		}
		// Edit the original message with the updated info
		await ctx.telegram.editMessageText(
			ctx.chat!.id,
			message.message_id,
			undefined,
			text
		);
	},
};
