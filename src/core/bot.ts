import { Bot, session } from "grammy"
import env from "parse_env"

import { hydrateReply, parseMode } from "grammy_parse_mode"
import { Context } from "./types.ts"

const bot = new Bot<Context>(env.str("TOKEN"))

bot.api.config.use(parseMode("HTML"))
bot.use(hydrateReply)
bot.use(session({ initial: () => ({}) }))
bot.start()

export { bot }
