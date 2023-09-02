import { findSale } from "api"
import { CHANNELS } from "db"
import { Time } from "deps"
import {
  parseChannels,
  saveLastMsgId,
  schedulePostDelete,
  trySetButtons,
} from "lib"
import { bot, poster } from "loader"
import { MsgManager } from "manager"
import M from "messages"
import { postModel } from "models"

export async function start(mg: MsgManager) {
  await mg.finish(M.hello)
}

export async function test(mg: MsgManager) {
  await mg.finish(M.hello)
}

export async function content(mg: MsgManager) {
  await mg.reply(M.content.askChannel(), "content:channel")
}

export async function addSale(mg: MsgManager) {
  await mg.reply(M.askChannels(), "sale:channels", { channels: [] })
  await mg.deleteMessage()
}

export async function showChannels(mg: MsgManager) {
  await mg.reply(M.channels())
}

import("./channels/mod.ts")

export async function checkRights(mg: MsgManager) {
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
  await mg.reply(text)
}

import("./add_sale/mod.ts")

import("./content.ts")

export async function handleChannelPost(mg: MsgManager) {
  const text = mg.getText()
  if (!text) return
  const chatId = mg.chatId
  const messageId = mg.messageId
  console.log("New channel post", { chatId, messageId })
  const sale = await findSale(text)
  if (!sale) return
  console.log("Sale post found", { chatId, messageId })
  let messageIds = [messageId]
  if (mg.getMediaGroupId()) {
    messageIds = await poster.getPostMessageIds(chatId, mg.messageId)
  }
  const deleteTime = Time() + (sale.deleteTimerHours ?? 24) * 60 * 60
  const p = await postModel.create({ chatId, messageIds, deleteTime })
  schedulePostDelete(p)
  if (!sale.buttons.length) return
  const buttons = sale.buttons.map((row) =>
    row.map((b) => ({ text: b.text, url: b.url }))
  )
  trySetButtons(mg, chatId, messageId, buttons)
}

export async function tryAddSale(mg: MsgManager) {
  const ctx = mg.ctx
  const channels = parseChannels(mg.msg)
  if (!channels.length) return
  const msg = await mg.reply(M.askDate, "sale:date", { channels })
  await ctx.deleteMessage()
  saveLastMsgId(mg, msg)
}
