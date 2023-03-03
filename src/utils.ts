import { Interaction } from "https://deno.land/x/discordeno@18.0.1/mod.ts";

export const pickOne = <T>(a: [T, ...T[]]): T => {
  return a[Math.floor(a.length * Math.random())];
}
export const containsHeart = (s: string | undefined): boolean => {
  if (s == null) return false;
  return /[🥰😍😘😻💌💘💝💖💗💓💞💕💟❣️💔❤️‍🔥❤️‍🩹❤️🧡💛💚💙💜🤎🖤🤍🫀💏👩‍❤️‍💋‍👨👨‍❤️‍💋‍👨👩‍❤️‍💋‍👩💑👩‍❤️‍👨👨‍❤️‍👨👩‍❤️‍👩🏩💒♥️❦☙♡🎔❧❥🫰🫶]|S2|<3/iu.test(s)
}

export type Element<Arr> = Arr extends (infer E)[] ? E : Arr;

export function getOptions(interaction: Interaction) {
  type OptionValue = Element<NonNullable<NonNullable<typeof interaction.data>["options"]>>
  const optionMap = new Map<string, OptionValue>();
  interaction.data?.options?.forEach((x => {
    optionMap.set(x.name, x);
  }));
  const options = Object.fromEntries(optionMap);
  return options;
}
export function on2Week(timestamp: number): boolean {
  const x = Date.now() - 14 * 24 * 60 * 60 * 1000;
  return x <= timestamp;
}
export function convertSnowflakeToTimestamp(snowflake: bigint, epoch = 1420070400000): number {
  return Number(snowflake >> 22n) + epoch
}
