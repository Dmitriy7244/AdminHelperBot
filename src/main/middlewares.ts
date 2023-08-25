import { ADMIN_ID, REPORT_CHAT_ID } from "api"
import { CONTENT_CHAT_ID } from "config"
import { Context, NextFunction } from "deps"

const allowedChats = [REPORT_CHAT_ID, ADMIN_ID, CONTENT_CHAT_ID]

export async function checkAccess(ctx: Context, next: NextFunction) {
  if (ctx.message && !allowedChats.includes(ctx.chat!.id)) {
    await ctx.reply("Мне запрещено общаться в этом чате")
    return
  }
  await next()
}

export async function spyAfterRoma(ctx: Context, next: NextFunction) {
  if (ctx.from?.id == 936845322) {
    console.log("Roma:", ctx.message?.text ?? ctx.callbackQuery?.data)
  }
  await next()
}
