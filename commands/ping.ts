import { Bot, Message } from "../deps.ts";

export function registerPingCommand(bot: Bot) {
    bot.events.messageCreate = async (bot, message: Message) => {
        if (message.authorId === bot.id) return;
        if (!message.content.startsWith("?ping")) return;
        if (!message.guildId) return;

        try {
            const member = await bot.helpers.getMember(message.guildId, message.authorId);
            if (!member.roles.includes(1185947950275379270n)) {
                return;
            }

            const sent = Date.now();
            const sentMessage = await bot.helpers.sendMessage(message.channelId, {
                content: "Pinging…",
                messageReference: {
                    messageId: message.id,
                    channelId: message.channelId,
                    guildId: message.guildId,
                    failIfNotExists: false,
                },
            });

            const received = Date.now();
            const latency = received - sent;

            await bot.helpers.editMessage(message.channelId, sentMessage.id!, {
                content: `🏓 Pong! ${latency}ms`,
            });
        } catch (error) {
            console.error("Ping Error:", error);
        }
    };
}
