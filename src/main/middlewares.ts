import { REPORT_CHAT_ID } from "config"
import { Context, NextFunction } from "grammy"

export async function checkAccess(ctx: Context, next: NextFunction) {
  if (ctx.chat?.id != REPORT_CHAT_ID) {
    if (ctx.message) await ctx.reply("Мне запрещено общаться в этом чате")
    return
  }
  await next()
}
