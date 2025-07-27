import { Client, GatewayIntentBits, ActivityType, EmbedBuilder, Colors, MessageFlags } from "discord.js";
import { Command } from "./interface/command";
import { config } from "./bot.config";
import path from "path";
import fs from "fs";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
const FILETYPE = ".ts";
const slashRoot = path.join(__dirname, 'commands/slash/');
const oprateRoot = path.join(__dirname, 'commands/oprate/');

// 設定読み込み
const { reactions } = config;


const client: Client = new Client({
    intents: Object.values(GatewayIntentBits) as GatewayIntentBits[]
});

// スラッシュコマンド読み込み
const slashCommands: { [key: string]: Command } = {};
const commandFiles = fs.readdirSync(slashRoot).filter((file) => file.endsWith(FILETYPE));
console.log(commandFiles ?? "読み込みに失敗しました");
for (const file of commandFiles) {
    const command: Command = require(`${slashRoot}/${file}`);

    slashCommands[command.data.name] = command;
}

// オペレートコマンド読み込み
const operateCommands: { [key: string]: Command } = {};
const operateFiles = fs.readdirSync(oprateRoot).filter((file) => file.endsWith(FILETYPE));
console.log(operateFiles ?? "読み込みに失敗しました");
for (const file of operateFiles) {
    const command: Command = require(`${oprateRoot}/${file}`);

    operateCommands[command.data.name] = command;
}

client.once("ready", async () => {
    console.log("Bot is ready! Logged in as " + client.user?.tag);
    console.log("Registering commands...");
    const data = [];
    for (const command in slashCommands) {
        console.log(`Registering command ${command}`);
        data.push(slashCommands[command].data);
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

client.on("messageCreate", async (message) => { // 指定チャンネルにメッセージが投稿されたらリアクションを追加
    if (message.author?.bot) return;

    const channelId = message.channel.id;

    
    const reactionConfig = reactions.find((r) => r.channels.includes(channelId));
    if (reactionConfig) {
        try {
            await message.react(reactionConfig.reaction);
            console.log(`Reacted with ${reactionConfig.reaction} in channel ${channelId}`);
        } catch (error) {
            console.error(`Failed to react in channel ${channelId}:`, error);
        }
    }
});

client.on("messageCreate", async (message) => { // 管理コマンドの実行
    if (message.author?.bot) return;

    const content = message.content.trim();
    if (!content.startsWith("zis!")) return; // コマンドは「!」で始まると仮定
    const args = content.slice(4).split(/ +/);
    const commandName = args.shift()?.toLowerCase();
    if (!commandName) return;
    const command = operateCommands[commandName];
    if (!command) {
        console.log(`Command ${commandName} not found`);
        await message.reply(`コマンド \`${commandName}\` は見つかりませんでした。`);
        return;
    }

    try {
        await command.execute(message);
        console.log(`Executed command ${commandName}`);
    } catch (error) {
        console.error(`Error executing command ${commandName}:`, error);
        await message.reply("コマンドの実行中にエラーが発生しました。");
    }
});

client.on("interactionCreate", async (interaction) => { // コマンドの実行
    if (!interaction.isCommand()) return;

    const commandName = interaction.commandName;
    const command = slashCommands[commandName];

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