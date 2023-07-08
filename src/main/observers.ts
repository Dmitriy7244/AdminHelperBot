import { NextFunction } from "grammy"
import { observer } from "observer"
import { Context } from "types"
import { bot } from "../core/bot.ts"
import { Prefix } from "./buttons.ts"
import { REPORT_CHAT_ID } from "./config.ts"

async function checkAccess(ctx: Context, next: NextFunction) {
  if (ctx.chat?.id != REPORT_CHAT_ID) {
    if (ctx.message) await ctx.reply("Мне запрещено общаться в этом чате")
    return
  }
  await next()
}

bot.use(checkAccess)

const button = (prefix: Prefix) => observer.button(prefix)

const O = {
  start: observer.command("start"),
  channels: observer.command("channels"),
  addSale: observer.command("add_sale"),
  userbot: observer.command("userbot"),
  pickChannel: button("channel"),
  pickAllChannels: button("➕ Выбрать все"),
  ready: button("✅ Готово"),
  asForward: button("asForward"),
  noSound: button("noSound"),
  get text() {
    return observer.text()
  },
  get message() {
    return observer.message()
  },
  schedulePost: button("Запланировать пост"),
}

export default O
