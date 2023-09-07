import { bot } from "new/lib.ts"
import {
  checkRightsComposer,
  sendChannelsRights,
} from "composers/checkRights.ts"

const CHAT_ID = 724477101

await sendChannelsRights(CHAT_ID)

bot.use(checkRightsComposer)
bot.start()
