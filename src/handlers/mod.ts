import { CHANNELS } from "config"
import env from "env"
import {
  findSale,
  scheduleNewContentPost,
  schedulePostDelete,
  setState,
} from "lib"
import { bot } from "loader"
import M from "messages"
import { PostDoc } from "models"
import { Time, editReplyMarkup, reply } from "my_grammy_lib"
import O from "observers"
import { getPostMessages } from "userbot"
import("./add_sale/mod.ts")
import("./content.ts")

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
  if (!text) return
  const chatId = ctx.chat.id
  const messageId = ctx.msg.message_id
  const sale = await findSale(text)
  if (!sale) return
  let messageIds = [messageId]
  if (ctx.msg.media_group_id) {
    messageIds = await getPostMessages(chatId, ctx.msg.message_id)
  }
  const deleteTime = Time() + AD_DURATION
  const p = await PostDoc.create({ chatId, messageIds, deleteTime })
  schedulePostDelete(p)
  scheduleNewContentPost(chatId, AD_TOP_DURATION)
  if (!sale.buttons.length) return
  const buttons = sale.buttons.map((row) =>
    row.map((b) => ({ text: b.text, url: b.url }))
  )
  await editReplyMarkup(ctx, { inline_keyboard: buttons })
}

const AD_DURATION = 60 * 60 * 24
const AD_TOP_DURATION = env.int("AD_TOP_DURATION")

O.checkRights.handler = async (ctx) => {
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
