import { obs, sendStart } from "composers/start.ts"
import { bot } from "new/lib.ts"

const CHAT_ID = 724477101

await sendStart(CHAT_ID)

bot.use(obs)
bot.start()
