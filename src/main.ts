import { startBot } from "https://deno.land/x/discordeno@18.0.1/mod.ts";
import { bot } from "./app.ts";

if (import.meta.main) {
  startBot(bot);  
}
