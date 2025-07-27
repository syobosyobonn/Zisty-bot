import { CommandInteraction, MessageFlags, EmbedBuilder, Colors } from "discord.js";
import { Command } from "../../interface/command";

module.exports = {
    data: {
        name: "ping",
        description: "Ping the bot to check if it is alive.",
        flags: MessageFlags.Ephemeral
    },

    async execute(interaction: CommandInteraction) {
        const ping = Date.now() - interaction.createdTimestamp;
        const embed = new EmbedBuilder()
            .setColor(Colors.Blue)
            .setTitle("Pong!")
            .setDescription(`Latency is ${ping}ms`)
            .setTimestamp()
            .setFooter({ text: "Ping command" });

        await interaction.editReply({ embeds: [embed] });
        return;
    }
} as Command;