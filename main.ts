import { createBot, Intents, startBot } from "./deps.ts";
import { BOT_ID, BOT_TOKEN } from "./configs.ts";
import { registerPingCommand } from "./commands/ping.ts";

const bot = createBot({
    token: BOT_TOKEN,
    botId: BOT_ID,
    intents: Intents.Guilds | Intents.GuildMessages | Intents.MessageContent,
    events: {
        ready: (_bot, payload) => {
            console.log(`√ ${payload.user.username} is ready`);
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

registerPingCommand(bot);
console.log("√ Command registered");

await startBot(bot);


// Deno cron job to keep the bot active
Deno.cron("KeepAwake", "*/3 * * * *", () => {
   console.log("√ Bot is active again!");
});
