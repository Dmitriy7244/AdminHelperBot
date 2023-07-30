import { ADMIN_ID, REPORT_CHAT_ID } from "api"
import { CONTENT_CHAT_ID } from "config"
import { Context, NextFunction } from "grammy"

const allowedChats = [REPORT_CHAT_ID, ADMIN_ID, CONTENT_CHAT_ID]

export async function checkAccess(ctx: Context, next: NextFunction) {
  if (ctx.message && !allowedChats.includes(ctx.chat!.id)) {
    await ctx.reply("Мне запрещено общаться в этом чате")
    return
  }
  await next()
}
