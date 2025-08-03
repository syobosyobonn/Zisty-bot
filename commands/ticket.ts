import { Bot, Message } from "../deps.ts";
import { hasPermission } from "../utils/check.ts";

export function registerTicketCommand(bot: Bot) {
    bot.events.messageCreate = async (bot: Bot, message: Message) => {
        const content = message.content.trim();
        if (message.isFromBot) return;
        if (!message.content.startsWith("?")) return;
        if (!message.guildId) return;

        const args = content.split(" ");

        if (args[0] !== "?ticket") return;
        const member = await bot.helpers.getMember(
            message.guildId,
            message.authorId,
        );
        const memberRole = hasPermission(member);

        if (memberRole === "mod") {
            await bot.helpers.sendMessage(message.channelId, {
                content: `チケットシステムは現在開発中です。詳細は後日お知らせします。`,
            });
            return;
        }
    };
}
