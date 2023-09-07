import { channelPostComposer } from "composers/channelPost.ts"
import { bot } from "new/lib.ts"

bot.use(channelPostComposer)
bot.start()
