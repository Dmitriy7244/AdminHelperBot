import { addSaleComposer, askPickChannels } from "composers/addSale/mod.ts"
import {
  handleAllChannelsPick,
  handleChannelPick,
} from "composers/addSale/pickChannels.ts"
import { CHANNELS } from "db"
import { bot } from "new/lib.ts"

const CHAT_ID = 724477101
const GROUP_ID = -1001315549534
const MSG_ID = 7604
const CHANNEL_TITLES = CHANNELS.map((c) => c.title)
const CHANNEL_TITLE = CHANNEL_TITLES[0]

async function test(enabled = false) {
  if (!enabled) return
  await askPickChannels(CHAT_ID)
  await handleChannelPick(GROUP_ID, MSG_ID, CHANNEL_TITLE, [])
  await handleChannelPick(GROUP_ID, MSG_ID, CHANNEL_TITLE, [CHANNEL_TITLE])
  await handleAllChannelsPick(GROUP_ID, MSG_ID, [])
  await handleAllChannelsPick(GROUP_ID, MSG_ID, CHANNEL_TITLES)
}

test()
bot.use(addSaleComposer)
bot.start()
