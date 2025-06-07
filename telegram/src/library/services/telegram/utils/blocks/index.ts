interface Block {
	label: string;
	mins: number;
}

interface BlockOptionDeclaration {
	name: string;
	cycle_length: number;
	description: string;
	best_for: string[];
	blocks: Block[];
}

const defaultBlocks: BlockOptionDeclaration = {
	name: "Default",
	cycle_length: 60,
	description: "The default half-and-half cycle.",
	best_for: ["Coding", "ADHD", "Medium Performance Goals"],
	blocks: [
		{ label: "🧠 Deep Work", mins: 25 },
		{ label: "🔄 Transition", mins: 5 },
		{ label: "🏃 Movement", mins: 25 },
		{ label: "🔄 Transition", mins: 5 },
	],
};

const deepBlocks: BlockOptionDeclaration = {
	name: "Deep",
	cycle_length: 60,
	description: "The deep 50/10 cycle.",
	best_for: ["Writing", "Research", "High Performance Goals"],
	blocks: [
		{ label: "🧠 Deep Work", mins: 50 },
		{ label: "🏃 Movement", mins: 10 },
	],
};

const rapidBlocks: BlockOptionDeclaration = {
	name: "Rapid",
	cycle_length: 120,
	description: "A shallow 20/20 cycle.",
	best_for: ["Burnout", "Recovery", "Low Performance Goals"],
	blocks: [
		{ label: "🧠 Deep Work", mins: 15 },
		{ label: "🔄 Transition", mins: 5 },
		{ label: "🏃 Movement", mins: 15 },
		{ label: "🔄 Transition", mins: 5 },
		{ label: "🧠 Deep Work", mins: 15 },
		{ label: "🔄 Transition", mins: 5 },
		{ label: "🏃 Movement", mins: 15 },
		{ label: "🔄 Transition", mins: 5 },
		{ label: "🧠 Deep Work", mins: 15 },
		{ label: "🔄 Transition", mins: 5 },
		{ label: "🏃 Movement", mins: 15 },
		{ label: "🔄 Transition", mins: 5 },
	],
};

export const allBlocks = {
	default: defaultBlocks,
	deep: deepBlocks,
	rapid: rapidBlocks,
};
