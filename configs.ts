import { dotEnvConfig, routes } from "./deps.ts";

dotEnvConfig({ export: true });

const token = Deno.env.get("DISCORD_TOKEN");
if (!token) {
  throw new Error("DISCORD_TOKEN is missing. Please check your .env file.");
}

export const BOT_TOKEN = token;
export const BOT_ID = BigInt(atob(BOT_TOKEN.split(".")[0]));


export const Config = {
  role: {
    mod: BigInt(1185947950275379270),
    team: BigInt(1187750962694193243)
  }
}