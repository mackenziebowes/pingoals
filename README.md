# PinGoals - Telegram Productivity Scheduler

A Telegram bot that automatically creates and sends productivity schedule alerts (pomodoro-style) to users.

## Future Goals
I am currently (June 7, 2025) poor ($9 CAD) and can not experiment much further with AI inference.
When I get some money going:
- Interviews
	- Once during onboarding (Build a psych profile for best guesses about priorities and what things actually relax the user)
	- Daily in the morning (Imitating a standup, collect daily goals or general information about long-running goals)
- Use a reasoning model to chunk & operationalize goals (You said you wanted to acheive X by Y, I think that means you have to do Z in the next 20 minutes)
This sort of thing requires experimentation, many tokens will be burned testing interview questions to get useful psych eval inputs

## Current Features

- Automatic pomodoro-style schedule creation
- Schedule notifications via Telegram
- Basic bot commands (/start, /ping, /server)
- Schedule tracking with PostgreSQL database

## Technology Stack

- **Bun**: JavaScript/TypeScript runtime
- **Telegraf**: Telegram Bot API framework
- **Prisma**: ORM for database interactions
- **PostgreSQL**: Database
- **Hono**: Lightweight web framework

## Project Structure

- **prisma/**: Database schema and client
- **telegram/**: Telegram bot implementation
  - **src/index.ts**: Main entry point
  - **src/library/services/telegram/**: Bot commands and utilities
  - **src/library/services/cron/**: Scheduled notification system

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   cd pingoals
   bun install
   ```
3. Generate environment files:
   ```bash
   cd telegram
   bun run generate:env
   ```
4. Set up the PostgreSQL database:
   ```bash
   cd prisma
   bun prisma db push
   ```
5. Start the Telegram bot:
   ```bash
   cd telegram
   bun run dev
   ```
6. Generate a Telegram bot invite link:
   ```bash
   bun run generate:invite
   ```

## Extending the Telegram Bot

### Adding New Commands

1. Create a new command file in `telegram/src/library/services/telegram/commands/`:

```typescript
// example.ts
import { Context } from "telegraf";
import { TelegramCommand } from "./index";

export const exampleCommand: TelegramCommand = {
	name: "example",
	description: "Description of your command",

	async execute(ctx: Context) {
		// Command implementation
		await ctx.reply("This is an example command!");
	},
};
```

2. Register your command in `telegram/src/library/services/telegram/commands/index.ts`:

```typescript
import { exampleCommand } from "./example";

// Add to the commands array
const commands: TelegramCommand[] = [
	pingCommand,
	serverCommand,
	startCommand,
	exampleCommand, // Add your new command here
];
```

### Creating Custom Schedule Types

Modify the `startCommand` in `telegram/src/library/services/telegram/commands/start.ts` to implement custom schedules:

```typescript
// Example for a custom 50/10 schedule
const sessionBlocks = [
	{ label: "🧠 Deep Work", mins: 50 },
	{ label: "☕ Break", mins: 10 },
	// Add more blocks as needed
];
```

### Adding Custom Alert Messages

Customize alert messages in `telegram/src/library/services/cron/alert.ts`:

```typescript
// Example for customized alerts
await bot.telegram.sendMessage(
	item.user.chatId,
	`🔔 Time for ${item.label}! ${getCustomMessage(item.label)}`
);

// Helper function for custom messages
function getCustomMessage(label: string): string {
	if (label.includes("Work")) return "Focus intensely for this session!";
	if (label.includes("Break")) return "Take a moment to rest your mind.";
	return "";
}
```

### Implementing Recurring Schedules

Create a new command for setting up recurring daily schedules:

```typescript
// dailySchedule.ts
export const dailyScheduleCommand: TelegramCommand = {
	name: "daily",
	description: "Set up a daily schedule",

	async execute(ctx: Context) {
		// Implementation for creating a recurring daily schedule
		// Save schedule template to database
		// Set up cron job to create new schedules each day
	},
};
```

### Adding User Preferences

Extend the TGUser model in `prisma/schema.prisma` to store user preferences:

```prisma
model TGUser {
  id           String  @id @default(uuid())
  chatId       String  @unique
  name         String?
  workDuration Int     @default(25)  // Default work duration in minutes
  breakDuration Int    @default(5)   // Default break duration in minutes
  timezone     String  @default("UTC")
  createdAt    DateTime @default(now())
  schedule     Schedule[]
}
```

### Implementing Schedule Templates

Create a new model for schedule templates:

```prisma
model ScheduleTemplate {
  id           String   @id @default(uuid())
  userId       String
  user         TGUser   @relation(fields: [userId], references: [id])
  name         String   // "Morning Routine", "Work Session", etc.
  blocks       Json     // Stored as JSON array of blocks
  createdAt    DateTime @default(now())
}
```

### Adding Analytics and Reporting

Create a command to show users their productivity statistics:

```typescript
// stats.ts
export const statsCommand: TelegramCommand = {
	name: "stats",
	description: "View your productivity stats",

	async execute(ctx: Context) {
		const chatId = ctx.chat?.id?.toString();
		if (!chatId) return;

		// Fetch user data and completed schedule items
		const user = await db.tGUser.findUnique({
			where: { chatId },
			include: { schedule: true },
		});

		// Calculate and display statistics
		// ...

		await ctx.reply("Your productivity stats: ...");
	},
};
```

## Integration with Frontend

The project is structured to potentially include a web frontend using the `client/` and `server/` directories. The Telegram bot can be extended to work alongside a web interface by:

1. Sharing the database models between systems
2. Implementing OAuth for connecting Telegram accounts to web accounts
3. Creating REST APIs in the `server/` directory for web client integration

## Deployment

For production deployment:

1. Build the project:

   ```bash
   cd telegram
   bun run build
   ```

2. Set up environment variables on your server
3. Run the compiled application
4. Consider using PM2 or Docker for process management

## Contributing

Feel free to extend this project with additional features or improvements!

## License

MIT
