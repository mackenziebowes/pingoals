import { Telegraf, Context } from "telegraf";
import { db } from "~/utils/db";

export function makeAlertCron(bot: Telegraf<any>) {
	return async function dispatchDuePings() {
		const now = new Date();

		const due = await db.schedule.findMany({
			where: {
				state: "PENDING",
				startAt: {
					lte: now,
				},
			},
			include: {
				user: true,
			},
		});

		for (const item of due) {
			try {
				await bot.telegram.sendMessage(
					item.user.chatId,
					`🔔 ${item.label} begins now!`
				);
				await db.schedule.update({
					where: { id: item.id },
					data: { state: "SENT" },
				});
			} catch (err) {
				console.error(`Failed to send ping for schedule ${item.id}`, err);
			}
		}
	};
}
