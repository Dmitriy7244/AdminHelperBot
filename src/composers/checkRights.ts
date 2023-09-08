import { Channel } from "models"
import { createComposer, onCommand } from "new/lib.ts"
import { getNoRightsChannels } from "../../bot/lib.ts"
import { bot } from "loader"

const cmp = createComposer()
const Text = (noRightsChannels: Channel[]) => {
  if (noRightsChannels.length) {
    return "У меня нет нужных прав в этих каналах:\n\n" +
      noRightsChannels.map((c) => c.url).join("\n")
  } else {
    return "У меня есть нужные права во всех каналах"
  }
}

async function sendChannelsRights(chatId: number) {
  const channels = await getNoRightsChannels()
  return await bot.sendMessage(chatId, Text(channels))
}

onCommand(cmp, "check_rights").use((ctx) => sendChannelsRights(ctx.chat.id))

export { cmp as checkRightsComposer, sendChannelsRights }
