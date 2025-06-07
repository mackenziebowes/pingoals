import { Telegraf, Context } from 'telegraf';
import commands from './commands';

// Setup command handling for the bot
export function setupCommandHandler(bot: Telegraf) {
  // Register all commands from the commands folder
  commands.forEach((command) => {
    // Register command with bot
    bot.command(command.name, async (ctx) => {
      try {
        await command.execute(ctx);
      } catch (error) {
        console.error(`Error executing command ${command.name}:`, error);
        
        // Send error message to user
        await ctx.reply('There was an error executing this command!');
      }
    });
  });
  
  // Handle regular text messages that aren't commands
  bot.on('text', async (ctx) => {
    // You can add custom text message handling here if needed
    // For now, we'll just ignore non-command messages
  });
  
  // Log bot errors
  bot.catch((err, ctx) => {
    console.error(`Bot error: ${err}`);
  });
}