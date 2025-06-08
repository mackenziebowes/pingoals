import { Context } from "telegraf";
import { db } from "~/utils/db";
import { ScheduleState } from "@ods/db";
import { allBlocks } from ".";

export async function addBlocks(
	ctx: Context,
	blockType: keyof typeof allBlocks
): Promise<void> {
	const userId = ctx.chat?.id;
	let text: string = "";
	const message = await ctx.reply("🏰 Adding blocks...");
	if (!userId) {
		text = "Couldn't identify you, sorry!";
		await ctx.telegram.editMessageText(
			ctx.chat!.id,
			message.message_id,
			undefined,
			text
		);
		return;
	}

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

	if (!userSchedule) {
		text = "😔 Couldn't find your profile, sorry.";
		await ctx.telegram.editMessageText(
			ctx.chat!.id,
			message.message_id,
			undefined,
			text
		);
		return;
	}

	const sessionBlocks = allBlocks[blockType].blocks;
	let startAt = new Date();

	// If user has existing schedule, start after the last block ends
	if (userSchedule.schedule && userSchedule.schedule.length > 0) {
		const lastBlock = userSchedule.schedule.reduce((latest, curr) => {
			const currEnd =
				new Date(curr.startAt).getTime() + curr.durationMin * 60 * 1000;
			const latestEnd =
				new Date(latest.startAt).getTime() + latest.durationMin * 60 * 1000;
			return currEnd > latestEnd ? curr : latest;
		});
		const lastEnd =
			new Date(lastBlock.startAt).getTime() + lastBlock.durationMin * 60 * 1000;
		startAt = new Date(lastEnd);
	}

	const scheduleInserts = sessionBlocks.map((block) => {
		const record = {
			userId: userSchedule.id,
			label: block.label,
			startAt: new Date(startAt),
			durationMin: block.mins,
			state: ScheduleState.PENDING,
		};
		startAt = new Date(startAt.getTime() + block.mins * 60 * 1000);
		return record;
	});

	await db.schedule.createMany({
		data: scheduleInserts,
	});

	text = "✅ Your blocks have been added!";
	await ctx.telegram.editMessageText(
		ctx.chat!.id,
		message.message_id,
		undefined,
		text
	);
}
