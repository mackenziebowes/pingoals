import { Context } from 'telegraf';
import { TelegramCommand } from './index';

export const serverCommand: TelegramCommand = {
  name: 'server',
  description: 'Display server information',
  
  async execute(ctx: Context) {
    // Get chat information
    const chatInfo = ctx.chat;
    
    // Create response message
    let responseText = 'Server Information:\n';
    responseText += `- Chat ID: ${chatInfo?.id}\n`;
    responseText += `- Chat Type: ${chatInfo?.type}\n`;
    
    if (chatInfo?.type === 'group' || chatInfo?.type === 'supergroup') {
      responseText += `- Group Name: ${chatInfo.title}\n`;
    } else if (chatInfo?.type === 'private') {
      const user = chatInfo.first_name;
      const lastName = chatInfo.last_name ? ` ${chatInfo.last_name}` : '';
      responseText += `- User: ${user}${lastName}\n`;
    }
    
    // Send the information
    await ctx.reply(responseText, { parse_mode: 'Markdown' });
  }
};