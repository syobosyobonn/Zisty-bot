import { 
    SlashCommandBuilder, 
    ChatInputCommandInteraction, 
    GuildMember, 
    Role,
    EmbedBuilder,
    Colors,
    MessageFlags,
    PermissionFlagsBits
} from "discord.js";
import { config } from "../../bot.config";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("slave")
        .setDescription("Mod Only: メンションした対象を奴隷にします。")
        .addUserOption(option =>
            option.setName("target")
                .setDescription("奴隷にするユーザー")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("mode")
                .setDescription("実行モード")
                .setRequired(false)
                .addChoices(
                    { name: "追加", value: "add" },
                    { name: "削除", value: "remove" }
                )
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setContexts([0]) // Guild only
        .setIntegrationTypes([0]), // Guild install only

    async execute(interaction: ChatInputCommandInteraction) {
        const { guild, user } = interaction;
        if (!guild) {
            const errorEmbed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setTitle("エラー")
                .setDescription("このコマンドはサーバー内でのみ使用できます。")
                .setTimestamp();
            
            await interaction.editReply({ embeds: [errorEmbed] });
            return;
        }

        const adminRole = config.role.admin;
        const member = await guild.members.fetch(user.id);
        const roles = member.roles.cache;

        // 権限チェック
        if (!roles.find((role: Role) => adminRole.includes(role.id))) {
            const errorEmbed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setTitle("権限エラー")
                .setDescription("あなたには権限がありません。")
                .setTimestamp();
            
            await interaction.editReply({ embeds: [errorEmbed] });
            return;
        }

        const target = interaction.options.getUser("target", true);
        const mode = interaction.options.getString("mode") || "add";

        const targetMember = await guild.members.fetch(target.id).catch(() => null);

        if (!targetMember) {
            const errorEmbed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setTitle("エラー")
                .setDescription("対象のユーザーが見つかりません。")
                .setTimestamp();
            
            await interaction.editReply({ embeds: [errorEmbed] });
            return;
        }

        if (mode === "add") {
            if (targetMember.roles.cache.has(config.role.slave)) {
                const warningEmbed = new EmbedBuilder()
                    .setColor(Colors.Yellow)
                    .setTitle("警告")
                    .setDescription(`${target.tag} はすでに奴隷です。`)
                    .setTimestamp();
                
                await interaction.editReply({ embeds: [warningEmbed] });
                return;
            }

            // 管理者ロール以外を削除
            targetMember.roles.cache.forEach((role: Role) => {
                if (role.name !== "@everyone" && !adminRole.includes(role.id)) {
                    targetMember.roles.remove(role).catch(() => null);
                }
            });

            try {
                await targetMember.roles.add(config.role.slave);
                
                const successEmbed = new EmbedBuilder()
                    .setColor(Colors.Green)
                    .setTitle("成功")
                    .setDescription(`${target.tag} を奴隷にしました。`)
                    .setTimestamp();
                
                await interaction.editReply({ embeds: [successEmbed] });
            } catch (error) {
                console.error("Failed to add slave role:", error);
                
                const errorEmbed = new EmbedBuilder()
                    .setColor(Colors.Red)
                    .setTitle("エラー")
                    .setDescription("slaveに失敗しました。")
                    .setTimestamp();
                
                await interaction.editReply({ embeds: [errorEmbed] });
            }

        } else if (mode === "remove") {
            if (!targetMember.roles.cache.has(config.role.slave)) {
                const warningEmbed = new EmbedBuilder()
                    .setColor(Colors.Yellow)
                    .setTitle("警告")
                    .setDescription(`${target.tag} はすでに奴隷ではありません。`)
                    .setTimestamp();
                
                await interaction.editReply({ embeds: [warningEmbed] });
                return;
            }

            try {
                await targetMember.roles.remove(config.role.slave);
                await targetMember.roles.add(config.role.member);
                
                const successEmbed = new EmbedBuilder()
                    .setColor(Colors.Green)
                    .setTitle("成功")
                    .setDescription(`${target.tag} の奴隷役を解除しました。`)
                    .setTimestamp();
                
                await interaction.editReply({ embeds: [successEmbed] });
            } catch (error) {
                console.error("Failed to remove slave role:", error);
                
                const errorEmbed = new EmbedBuilder()
                    .setColor(Colors.Red)
                    .setTitle("エラー")
                    .setDescription("slaveの削除に失敗しました。")
                    .setTimestamp();
                
                await interaction.editReply({ embeds: [errorEmbed] });
            }
        }
    }
};
