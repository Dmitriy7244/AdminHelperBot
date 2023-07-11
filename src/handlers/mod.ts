import { reply, Time } from "core/mod.ts"
import { schedulePostDelete, setState } from "lib"
import M from "messages"
import O from "observers"
import { getPostMessages } from "userbot"
import { PostDoc, SaleDoc } from "../main/models.ts"
import("./add_sale/mod.ts")

O.start.handler = async (ctx) => {
  setState(ctx)
  await reply(ctx, M.hello)
}

O.channels.handler = (ctx) => reply(ctx, M.channels)
O.test.handler = (ctx) => {
  ctx.reply(JSON.stringify(ctx.session))
}

O.channelPost.handler = async (ctx) => {
  const text = ctx.msg.text ?? ctx.msg.caption
  const chatId = ctx.chat.id
  const messageId = ctx.msg.message_id
  const sale = await SaleDoc.findOne({ text }).exec()
  if (!sale) return
  let messageIds = [messageId]
  if (ctx.msg.media_group_id) {
    messageIds = await getPostMessages(chatId, ctx.msg.message_id)
  }
  const deleteTime = Time() + AD_DURATION
  const p = await PostDoc.create({ chatId, messageIds, deleteTime })
  schedulePostDelete(p)
}

const AD_DURATION = 60 * 60 * 24
