import { findSale } from "api"
import { CHANNELS } from "db"
import {
  parseChannels,
  saveLastMsgId,
  schedulePostDelete,
  setState,
  trySetButtons,
} from "lib"
import { bot } from "loader"
import M from "messages"
import { postModel } from "models"
import { reply, Time } from "deps"
import observers from "observers"
import { getPostMessages } from "userbot"

const o = observers

o.start.handler = async (ctx) => {
  setState(ctx)
  await reply(ctx, M.hello)
}

// o.test.handler = (ctx) => {}

import("./channels/mod.ts")

o.checkRights.handler = async (ctx) => {
  const noRightsChannels = []
  for (const channel of CHANNELS) {
    try {
      const member = await bot.api.getChatMember(channel.id, bot.botInfo.id)
      if (member.status == "administrator") {
        if (
          member.can_delete_messages &&
          member.can_delete_messages &&
          member.can_edit_messages &&
          member.can_invite_users
        ) {
          continue
        }
      }
      noRightsChannels.push(channel)
    } catch {
      noRightsChannels.push(channel)
    }
  }
  let text: string
  if (noRightsChannels.length) {
    text = "У меня нет нужных прав в этих чатах:\n\n"
    text += noRightsChannels.map((c) => c.url).join("\n")
  } else {
    text = "У меня есть нужные права во всех чатах"
  }
  await ctx.reply(text)
}

import("./add_sale/mod.ts")
import("./content.ts")

o.channelPost.handler = async (ctx) => {
  const text = ctx.msg.text ?? ctx.msg.caption
  if (!text) return
  const chatId = ctx.chat.id
  const messageId = ctx.msg.message_id
  console.log("New channel post", { chatId, messageId })
  const sale = await findSale(text)
  if (!sale) return
  console.log("Sale post found", { chatId, messageId })
  let messageIds = [messageId]
  if (ctx.msg.media_group_id) {
    messageIds = await getPostMessages(chatId, ctx.msg.message_id)
  }
  const deleteTime = Time() + (sale.deleteTimerHours ?? 24) * 60 * 60
  const p = await postModel.create({ chatId, messageIds, deleteTime })
  schedulePostDelete(p)
  if (!sale.buttons.length) return
  const buttons = sale.buttons.map((row) =>
    row.map((b) => ({ text: b.text, url: b.url }))
  )
  trySetButtons(ctx, chatId, messageId, buttons)
}

o.text.handler = async (ctx) => {
  const channels = parseChannels(ctx.msg)
  if (!channels.length) return
  ctx.session.channels = channels
  setState(ctx, "sale:date")
  const msg = await reply(ctx, M.askDate)
  await ctx.deleteMessage()
  saveLastMsgId(ctx, msg)
}
