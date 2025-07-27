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

        const adminRole = config.role.admin;

        const user: GuildMember = await guild.members.fetch(author.id);
        const roles = user.roles.cache;

        if (!roles.find((role: Role) => adminRole.includes(role.id))) { // 権限がない場合
            await message.reply("あなたには権限がありません。");
            return;
        }

        const args = content.split(" ");

        if (args.length < 2) {
            await message.reply("奴隷にするユーザーをメンションしてください。");
            return;
        }

        const targetId = args[1]?.replace(/<@!?(\d+)>/, "$1"); // メンションからIDを抽出
        const mode = args[2]?.toLowerCase() || "add"; // モードを取得。デフォルトは"add"

        const target = await guild.members.fetch(targetId).catch(() => null);

        if (!target) {
            await message.reply("対象のユーザーが見つかりません。");
            return;
        }

        if (mode === "add") {
            if (target.roles.cache.has(config.role.slave)) {
                await message.reply(`${target.user.tag} はすでに奴隷です。`);
                return;
            }

            target.roles.cache.forEach((role: Role) => {
                if (role.name !== "@everyone" && !adminRole.includes(role.id)) {
                    target.roles.remove(role).catch(() => null);
                }
            });

            try {
                await target.roles.add(config.role.slave);
            } catch (error) {
                console.error("Failed to add slave role:", error);
                await message.reply("slaveに失敗しました。");
            }

            await message.reply(`${target.user.tag} を奴隷にしました。`);
        } else if (mode === "remove") {
            if (!target.roles.cache.has(config.role.slave)) {
                await message.reply(`${target.user.tag} はすでに奴隷ではありません。`);
                return;
            }

            try {
                await target.roles.remove(config.role.slave);
                await target.roles.add(config.role.member);
            } catch (error) {
                console.error("Failed to remove slave role:", error);
                await message.reply("slaveの削除に失敗しました。");
                return;
            }

            await message.reply(`${target.user.tag} の奴隷役を解除しました。`);
        } else {
            await message.reply("無効なモードです。`add` または `remove` を指定してください。");
        }

    }
}