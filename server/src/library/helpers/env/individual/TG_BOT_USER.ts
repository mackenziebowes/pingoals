import type { ENVExport } from "~/types/env";

const TG_BOT_USER = () => {
	val = Bun.env.TG_BOT_USER;
	if (!val) throw "TG_BOT_USER not set";
	return val;
};

let val: string | undefined = undefined;

const init = () => {
	env.val = Bun.env.TG_BOT_USER;
	if (!env.val) throw "TG_BOT_USER not set";
};

const env: ENVExport = {
	get: TG_BOT_USER,
	val,
	init,
};

export default env;
