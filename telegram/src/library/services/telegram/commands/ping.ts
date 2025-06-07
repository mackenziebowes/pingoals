import { Context } from 'telegraf';
import { TelegramCommand } from './index';

export const pingCommand: TelegramCommand = {
  name: 'ping',
  description: 'Replies with Pong!',
  
  async execute(ctx: Context) {
    const startTime = Date.now();
    const message = await ctx.reply('Pinging...');
    const endTime = Date.now();
    const ping = endTime - startTime;
    
    // Edit the original message with the latency info
    await ctx.telegram.editMessageText(
      ctx.chat!.id,
      message.message_id,
      undefined,
      `Pong! Latency: ${ping}ms`
    );
  }
};