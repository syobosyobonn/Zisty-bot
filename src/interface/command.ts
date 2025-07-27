import { CommandInteraction, ApplicationCommandOptionType, Message } from "discord.js";

interface Command {
    data: {
        name: string;
        description: string;
        flags: number;
        options?: Array<{
            name: string;
            description: string;
            type:
            | ApplicationCommandOptionType.Subcommand
            | ApplicationCommandOptionType.SubcommandGroup
            | ApplicationCommandOptionType.String
            | ApplicationCommandOptionType.Integer
            | ApplicationCommandOptionType.Boolean
            | ApplicationCommandOptionType.User
            | ApplicationCommandOptionType.Channel
            | ApplicationCommandOptionType.Role
            | ApplicationCommandOptionType.Mentionable
            | ApplicationCommandOptionType.Number
            | ApplicationCommandOptionType.Attachment;
            required?: boolean;
            choices?: Array<{
                name: string;
                value: string | number;
            }>;
        }>;
        [key: string]: any; // 他のプロパティも許容
    };

    execute: (interaction: CommandInteraction | Message) => Promise<void>;
}

export type { Command };