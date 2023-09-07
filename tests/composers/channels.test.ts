import {
  askChannelPost,
  askPickChannel,
  handleChannelLink,
  handleChannelPost,
  saveChannel,
  sendChannelsMenu,
} from "composers/channels/lib.ts"
import { channelsComposer } from "composers/channels/mod.ts"
import { bot } from "new/lib.ts"

const CHAT_ID = 724477101
const CHANNEL_ID = -1001585027208
const CHANNEL_LINK = "https://t.me/test7244c"

await sendChannelsMenu(CHAT_ID)
await askChannelPost(CHAT_ID)
await handleChannelPost(CHAT_ID, CHANNEL_ID)
await handleChannelLink(CHAT_ID, [CHANNEL_LINK])
await saveChannel(CHAT_ID, {
  id: CHANNEL_ID,
  title: "fromTest",
  link: CHANNEL_LINK,
})
await askPickChannel(CHAT_ID)

bot.use(channelsComposer)
bot.start()
