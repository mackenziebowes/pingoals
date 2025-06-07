import { Context } from "telegraf";
import { TelegramCommand } from "./index";
import { db } from "~/utils/db";

export const startCommand: TelegramCommand = {
	name: "start",
	description: "Connects you to Pingoals and generates your first schedule.",

	async execute(ctx: Context) {
		const chatId = ctx.chat?.id?.toString();
		const name = ctx.from?.first_name || "friend";

		if (!chatId) {
			await ctx.reply("❌ Sorry, I couldn't find your chat ID.");
			return;
		}

		// Insert user if they don’t exist
		const existing = await db.tGUser.findUnique({
			where: {
				chatId,
			},
		});

		if (!existing) {
			await db.tGUser.create({
				data: {
					chatId,
					name,
				},
			});
		}

		// Generate a 2-cycle schedule (25/5/25/5)
		const now = new Date();
		const sessionBlocks = [
			{ label: "🧠 VR Work", mins: 25 },
			{ label: "🔄 Transition", mins: 5 },
			{ label: "🏃 Movement", mins: 25 },
			{ label: "🔄 Transition", mins: 5 },
		];

		let startAt = now;
		const scheduleInserts = sessionBlocks.map((block) => {
			const record = {
				userId: existing?.id ?? chatId,
				label: block.label,
				startAt: new Date(startAt),
				durationMin: block.mins,
				state: "PENDING" as const,
			};
			startAt = new Date(startAt.getTime() + block.mins * 60 * 1000);
			return record;
		});

		await db.schedule.createMany({
			data: scheduleInserts,
		});

		await ctx.reply(`✅ Welcome, ${name}!
Your first 4 blocks are scheduled:
${sessionBlocks.map((b) => `- ${b.label} (${b.mins} min)`).join("\n")}

I'll ping you as each one begins.`);
	},
};
