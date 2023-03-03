import { Collection, InteractionResponseTypes, Message } from "https://deno.land/x/discordeno@18.0.1/mod.ts";
import { containsHeart, convertSnowflakeToTimestamp, getOptions, on2Week } from "../utils.ts";
import type { Handler } from "./types.ts";

function splitMessages(messages: Collection<bigint, Message>): [bigint[], bigint[]] {
  const filteredMessageIds = messages
    .filter(message => !message.reactions?.some(reaction => containsHeart(reaction.emoji.name)) ?? true)
    .map(message => message.id);
  const bulkMessagesToDelete: bigint[] = [];
  const messagesToDelete: bigint[] = [];
  filteredMessageIds.forEach(id => {
    const timestamp = convertSnowflakeToTimestamp(id);
    if (on2Week(timestamp)) {
      bulkMessagesToDelete.push(id);
    } else {
      messagesToDelete.push(id);
    }
  });
  if (bulkMessagesToDelete.length < 2) {
    return [[], filteredMessageIds];
  } else {
    return [bulkMessagesToDelete, messagesToDelete];
  }
}

export const cleanHandler: Handler = async (bot, interaction) => {
  await bot.helpers.sendInteractionResponse(
    interaction.id,
    interaction.token, {
    type: InteractionResponseTypes.ChannelMessageWithSource,
    data: {
      content: "지워지는데 시간이 걸릴 수 있어요!",
    }
  });
  const options = getOptions(interaction);
  const amount = Math.max(1, (options["amount"]?.value as number) ?? 1000000);
  let count = 0;
  let total = 0;
  let next: bigint | undefined = undefined;
  const pageSize = 100;
  for (let i = amount; i > 0; i -= pageSize) {
    const limit = Math.min(i, pageSize);
    const messages: Collection<bigint, Message> = await bot.helpers.getMessages(interaction.channelId!, {
      limit,
      before: next,
    });
    if (messages.size === 0) break;
    const lastMessage = messages.last();
    next = lastMessage?.id;
    const channelId = interaction.channelId!;
    const [bulkMessagesToDelete, messagesToDelete] = splitMessages(messages);
    if (bulkMessagesToDelete.length > 0) {
      try {
        total += bulkMessagesToDelete.length;
        await bot.helpers.deleteMessages(channelId, bulkMessagesToDelete);
        count += bulkMessagesToDelete.length;
      } catch (error) {
        console.error(error);
      }
    }
    for (const id of messagesToDelete) {
      try {
        total += 1;
        await bot.helpers.deleteMessage(channelId, id);
        count += 1;
      } catch (error) {
        console.error(error);
      }
    }
  }
  console.info(`청소 완료 (${count}/${total})`);
  console.info(`실제로 데이터가 지워질 때까지 켜놓은 상태로 기다려주세요`);
}