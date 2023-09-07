import { textComposer } from "composers/text.ts"
import { bot } from "new/lib.ts"

bot.use(textComposer)
bot.start()
