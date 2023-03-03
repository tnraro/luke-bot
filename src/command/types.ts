import type { Bot, Interaction } from "https://deno.land/x/discordeno@18.0.1/mod.ts";

export type Handler = (
  bot: Bot,
  interaction: Interaction,
) => unknown;
