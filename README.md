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
   ```bash
   mkdir -p ~/apps
   git clone https://github.com/mackenziebowes/pingoals.git ~/apps/pingoals
   ```
   This puts the entire monorepo into ~/apps/pingoals
2. Install dependencies:

   ```bash
   cd ~/apps/pingoals/prisma
   bun i
   cd ~/apps/pingoals/telegram
   bun i
   ```

3. Configure environment files:

   ```bash
   cp ~/apps/pingoals/.env.example ~/apps/pingoals/.env
   ```

4. Start the Telegram bot:

   ```bash
   cd ~/apps/pingoals
   bun start
   ```

5. Generate a Telegram bot invite link:
   ```bash
   cd ~/apps/pingoals
   bun run generate:invite
   ```

## Extending the Telegram Bot

There are two supported/extensible methods for interacting with the telegram bot:

- Commands
- Callbacks

Both are registered sequentially when the app is started in `telegram/src/library/services/telegram/commandHandler`

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

In `telegram/src/library/services/telegram/utils/blocks/index` you'll see the colocated declarations of the three built-in block types I've written for you.
See `telegram/src/library/services/telegram/callbacks/index` for an example of how to register them - here, I've created `add_block` for handling all the "UI" management (sending messages, errors, etc to the chat) and `create_block_callback` for converting the differences (name, description, type) into a standard `TelegramCommand` type.

### Adding Custom Alert Messages

Customize alert messages in `telegram/src/library/services/cron/alert.ts`:

```typescript
// Example for customized alerts
await bot.telegram.sendMessage(
	item.user.chatId,
	`🔔 Time for ${item.label}! ${getCustomMessage(item.label)}`
);
```

## Integration with Frontend

The project is structured to potentially include a web frontend using the `client/` and `server/` directories. The Telegram bot can be extended to work alongside a web interface by:

1. Sharing the database models between systems
2. Implementing OAuth for connecting Telegram accounts to web accounts
3. Creating REST APIs in the `server/` directory for web client integration

## Deployment

For production deployment:

1. Clone the repository
   ```bash
   mkdir -p ~/apps
   git clone https://github.com/mackenziebowes/pingoals.git ~/apps/pingoals
   ```
   This puts the entire monorepo into ~/apps/pingoals
2. Install dependencies:
   ```bash
   cd ~/apps/pingoals/prisma
   bun i
   cd ~/apps/pingoals/telegram
   bun i
   ```
3. Copy environment files:
   ```bash
   sudo cp ~/apps/pingoals/env.example ~/apps/pingoals/.env
   nano ~/apps/pingoals/.env
   ```
   Note: must be done for each folder
4. Start the Telegram bot:
   ```bash
   cd ../
   sudo cp ~/apps/pingoals/pingoals.service /etc/systemd/system/pingoals.service
   sudo systemctl daemon-reload
   sudo systemctl enable pingoals
   sudo systemctl start pingoals
   ```
5. Generate a Telegram bot invite link:
   ```bash
   cd ~/apps/pingoals
   bun run generate:invite
   ```

## Contributing

Feel free to extend this project with additional features or improvements!

## License

MIT
