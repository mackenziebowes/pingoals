import { Telegraf } from 'telegraf';
import { env } from '~/library/helpers/env';
import commands from './commands';

// Function to register bot commands with Telegram API
export async function registerCommands(bot: Telegraf) {
  try {
    console.log('Started registering Telegram bot commands.');
    
    // Create command list in Telegram format
    const commandList = commands.map(cmd => ({
      command: cmd.name,
      description: cmd.description
    }));
    
    // Set bot commands through Telegram API
    await bot.telegram.setMyCommands(commandList);
    
    console.log('Successfully registered Telegram bot commands.');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
}