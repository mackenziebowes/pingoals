import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Type definitions for config.json
export interface TelegramConfig {
	token: string;
	botUsername: string;
}

export interface ServerConfig {
	port: number;
	cors: {
		origin: string;
	};
}

export interface FeaturesConfig {
	commands: string[];
	autoRegisterCommands: boolean;
}

export interface Config {
	telegram: TelegramConfig;
	server: ServerConfig;
	features: FeaturesConfig;
}

// Default configuration
const defaultConfig: Config = {
	telegram: {
		token: "",
		botUsername: "",
	},
	server: {
		port: 3050,
		cors: {
			origin: "http://localhost:3000",
		},
	},
	features: {
		commands: ["ping", "server"],
		autoRegisterCommands: true,
	},
};

// Load config from file
export async function loadConfig(): Promise<Config> {
	try {
		// Get the directory of the current file
		const __dirname = path.dirname(fileURLToPath(import.meta.url));

		// Read config.json from the root directory
		const configPath = path.resolve(__dirname, "../../config.json");
		const configData = await fs.readFile(configPath, "utf8");
		const config = JSON.parse(configData);

		// Merge with default config to ensure all properties exist
		return {
			...defaultConfig,
			...config,
			telegram: {
				...defaultConfig.telegram,
				...config.telegram,
			},
			server: {
				...defaultConfig.server,
				...config.server,
				cors: {
					...defaultConfig.server.cors,
					...config?.server?.cors,
				},
			},
			features: {
				...defaultConfig.features,
				...config.features,
			},
		};
	} catch (error) {
		console.warn("Could not load config.json, using default configuration");
		return defaultConfig;
	}
}
