import { Client, GatewayIntentBits, ActivityType, EmbedBuilder, Colors, MessageFlags } from "discord.js";
import { Command } from "./interface/command";
import fs from "fs";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
const FILETYPE = ".ts";

const client: Client = new Client({
    intents: Object.values(GatewayIntentBits) as GatewayIntentBits[]
});

// commands
const commands: { [key: string]: Command } = {};
const commandFiles = fs.readdirSync("./src/commands").filter((file) => file.endsWith(FILETYPE));
for (const file of commandFiles) {
    const command: Command = require(`./commands/${file}`);
    
    commands[command.data.name] = command;
}

client.once("ready", async () => {
    console.log("Bot is ready! Logged in as " + client.user?.tag);
    console.log("Registering commands...");
    const data = [];
    for (const command in commands) {
        console.log(`Registering command ${command}`);
        data.push(commands[command].data);
    }
    try {
        await client.application?.commands.set(data as any);
    } catch (error) {
        console.error("Error registering commands: ", error);
        return;
    }

    console.log("Commands registered successfully!");

    client.user?.setActivity("with the discord.js", { type: ActivityType.Playing });
    console.log("Bot is now playing with the discord.js!");
    return;
});

client.on("interactionCreate", async (interaction) => { // コマンドの実行
    if (!interaction.isCommand()) return;

    const commandName = interaction.commandName;
    const command = commands[commandName];

    if (!command) {
        console.log(`Command ${commandName} not found`);
        const embed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setTitle("Command not found")
            .setDescription(`The command \`${commandName}\` was not found.`)
            .setTimestamp()
            .setFooter({ text: "Please try again later." });

        await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
        return;
    }

    await interaction.deferReply({ flags: command.data.flags });
    console.log(`Executing command ${commandName}`);
    await command.execute(interaction);
});

client.login(process.env.DISCORD_TOKEN);