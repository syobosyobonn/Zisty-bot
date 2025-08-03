import { createBot, Intents, startBot } from "./deps.ts";
import { registerPingCommand } from "./commands/ping.ts";
import { registerTicketCommand } from "./commands/ticket.ts";
import { BOT_ID, BOT_TOKEN } from "./configs.ts";

// botのクライアント作成
const bot = createBot({
    token: BOT_TOKEN,
    botId: BOT_ID,
    intents: Intents.Guilds | Intents.GuildMessages | Intents.MessageContent,
    events: {
        ready: async (_bot, payload) => {
            console.log(`√ ${payload.user.username} is ready`);

            await _bot.helpers.sendMessage(1324788358404247714n, {
                content: `Bot is online!`,
            });
        },

        guildMemberAdd: async (bot, member) => {
            try {
                await bot.helpers.sendMessage(1386242996399378462n, {
                    content: `🎉 <@${member.id}> さん、ようこそ！`,
                });
            } catch (error) { 
                console.error("Guild Member Add Error:", error);
            }
        },
    },
});


// コマンド一覧取得
registerPingCommand(bot);
registerTicketCommand(bot);

console.log("√ Command registered");

await startBot(bot);


// Deno cron job to keep the bot active
Deno.cron("KeepAwake", "*/3 * * * *", () => {
   console.log("√ Bot is active again!");
});
