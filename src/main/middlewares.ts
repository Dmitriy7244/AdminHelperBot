import { REPORT_CHAT_ID } from "config"
import { Context, NextFunction } from "grammy"

export async function checkAccess(ctx: Context, next: NextFunction) {
  if (ctx.message && ctx.chat!.id != REPORT_CHAT_ID) {
    await ctx.reply("Мне запрещено общаться в этом чате")
    return
  }
  await next()
}
