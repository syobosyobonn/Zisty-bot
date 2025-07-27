import { GuildMember, Message, Role } from "discord.js";
import { config } from "../../bot.config";

module.exports = {
    data: {
        name: "slave",
        description: "Mod Only: メンションした対象を奴隷にします。",
        default_member_permissions: "8" // 使えるかわかんない。今調べたやつ by RIOn
    },
    
    async execute(message: Message) {
        const { content, author, guild } = message;
        if (!guild) return;

        const user: GuildMember = await guild.members.fetch(author.id);
        const roles = user.roles.cache;

        if (!roles.find((role: Role) => config.adminRole.includes(role.id))) { // 権限がない場合
            await message.reply("あなたには権限がありません。");
            return;
        }

        const args = content.split(" ");

        if (args.length < 2) {
            await message.reply("奴隷にするユーザーをメンションしてください。");
            return;
        }

        const targetId = args[1]?.replace(/<@!?(\d+)>/, "$1"); // メンションからIDを抽出
        const target = await guild.members.fetch(targetId).catch(() => null);

        if (!target) {
            await message.reply("対象のユーザーが見つかりません。");
            return;
        }

        target.roles.cache.forEach((role: Role) => {
            if (role.name !== "@everyone" && !config.adminRole.includes(role.id)) {
                target.roles.remove(role).catch(() => null);
            }
        });

        try {
            await target.roles.add(config.slaveRole);
        } catch (error) {
            await message.reply("slaveに失敗しました。");
        }

        await message.reply(`${target.user.tag} を奴隷にしました。`);
    }
}