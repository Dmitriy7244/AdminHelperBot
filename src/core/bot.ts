import env from "env"
import * as grammy from "grammy"
import { Bot, session } from "grammy"
import { run } from "grammy_runner"
import { DenoKVAdapter } from "grammy_storage"

import { hydrateReply, parseMode } from "grammy_parse_mode"
import { Context } from "types"

function getSessionKey(ctx: grammy.Context): string | undefined {
  const key = ctx.from == undefined || ctx.chat == undefined
    ? undefined
    : `${ctx.chat.id}/${ctx.from.id}`
  return key
}

const bot = new Bot<Context>(env.str("TOKEN"))

// @ts-ignore: TODO
const kv = await Deno.openKv()

bot.api.config.use(parseMode("HTML"))
bot.use(hydrateReply)
bot.use(
  session({
    initial: () => ({}),
    getSessionKey,
    storage: new DenoKVAdapter(kv),
  }),
) // TODO: initial
run(bot)

export { bot }
