import type { ENVExport } from "~/types/env";

const TG_BOT_TOKEN = () => {
	val = Bun.env.TG_BOT_TOKEN;
	if (!val) throw "TG_BOT_TOKEN not set";
	return val;
};

let val: string | undefined = undefined;

const init = () => {
	env.val = Bun.env.TG_BOT_TOKEN;
	if (!env.val) throw "TG_BOT_TOKEN not set";
};

const env: ENVExport = {
	get: TG_BOT_TOKEN,
	val,
	init,
};

export default env;
