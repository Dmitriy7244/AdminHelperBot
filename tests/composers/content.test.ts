import { contentComposer } from "composers/content.ts"
import { bot } from "new/lib.ts"

bot.use(contentComposer)
bot.start()
