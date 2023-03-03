import "https://deno.land/std@0.178.0/dotenv/load.ts";
import { ApplicationCommandOptionTypes, createBot, Intents } from "https://deno.land/x/discordeno@18.0.1/mod.ts";
import { cleanHandler } from "./command/clean.ts";

const TOKEN = Deno.env.get("TOKEN");

if (TOKEN == null) throw new Error("TOKEN이 없습니다. `.env`파일에 TOKEN이 정의 되었는지 확인하세요.");

export const bot = createBot({
  token: TOKEN,
  intents: Intents.MessageContent,
  events: {
    ready(bot, payload) {
      console.info(`샤드 #${payload.shardId}에 연결 성공`);
      bot.helpers.createGlobalApplicationCommand({
        name: "clean",
        description: "무엇을 치워드릴까요?",
        options: [{
          name: "amount",
          type: ApplicationCommandOptionTypes.Number,
          description: "지울 메시지 수",
        }],
      });
    },
    interactionCreate(bot, interaction) {
      switch(interaction.data?.name) {
        case "clean": return cleanHandler(bot, interaction);
      }
      throw new Error("Not implemented");
    }
  },
});