import { CHANNELS, findSale } from "api"
import { schedulePostDelete, setState, trySetButtons } from "lib"
import { bot } from "loader"
import M from "messages"
import { PostDoc } from "models"
import { reply, Time } from "my_grammy_lib"
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
  console.log("New channel post", { chatId, messageId })
  const sale = await findSale(text)
  if (!sale) return
  console.log("Sale post found", { chatId, messageId })
  let messageIds = [messageId]
  if (ctx.msg.media_group_id) {
    messageIds = await getPostMessages(chatId, ctx.msg.message_id)
  }
  const deleteTime = Time() + (sale.deleteTimerHours ?? 24) * 60 * 60
  const p = await PostDoc.create({ chatId, messageIds, deleteTime })
  schedulePostDelete(p)
  if (!sale.buttons.length) return
  const buttons = sale.buttons.map((row) =>
    row.map((b) => ({ text: b.text, url: b.url }))
  )
  trySetButtons(ctx, chatId, messageId, buttons)
}

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
