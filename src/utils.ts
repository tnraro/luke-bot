import { Interaction } from "https://deno.land/x/discordeno@18.0.1/mod.ts";

export const pickOne = <T>(a: [T, ...T[]]): T => {
  return a[Math.floor(a.length * Math.random())];
}
export const containsHeart = (s: string | undefined): boolean => {
  if (s == null) return false;
  return /[๐ฅฐ๐๐๐ป๐๐๐๐๐๐๐๐๐โฃ๏ธ๐โค๏ธโ๐ฅโค๏ธโ๐ฉนโค๏ธ๐งก๐๐๐๐๐ค๐ค๐ค๐ซ๐๐ฉโโค๏ธโ๐โ๐จ๐จโโค๏ธโ๐โ๐จ๐ฉโโค๏ธโ๐โ๐ฉ๐๐ฉโโค๏ธโ๐จ๐จโโค๏ธโ๐จ๐ฉโโค๏ธโ๐ฉ๐ฉ๐โฅ๏ธโฆโโก๐โงโฅ๐ซฐ๐ซถ]|S2|<3/iu.test(s)
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
