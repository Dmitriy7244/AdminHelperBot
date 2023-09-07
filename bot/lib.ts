import { ADMIN_ID } from "config"
import dayjs from "dayjs"
import { CHANNELS } from "db"
import {
  InlineKeyboard,
  Message,
  Msg,
  PostScheduleData,
  sleepRandomAmountOfSeconds,
} from "deps"
import { bot, poster } from "loader"
import { messages as m } from "messages"
import { Button } from "models"

export async function getNoRightsChannels() {
  await bot.init()
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
  return noRightsChannels
}

export function editKeyboard(
  chatId: number,
  messageId: number,
  keyboard?: InlineKeyboard | Button[][],
) {
  let reply_markup: any = keyboard
  if (!keyboard) {
    reply_markup = undefined
  } else if (keyboard instanceof Array) {
    reply_markup = { inline_keyboard: keyboard }
  }
  return bot.api.editMessageReplyMarkup(chatId, messageId, { reply_markup })
}

export function editMessage(
  chatId: number,
  messageId: number,
  msg: Msg,
) {
  return bot.api.editMessageText(chatId, messageId, msg.text, {
    reply_markup: msg.keyboard,
  })
}

export function sendMessage(chatId: number, msg: Msg) {
  return bot.api.sendMessage(chatId, msg.text, {
    reply_markup: msg.keyboard,
    disable_web_page_preview: true,
  })
}

export function deleteMessage(msg: Message) {
  return bot.api.deleteMessage(msg.chat.id, msg.message_id)
}

export async function trySetButtons(
  chatId: number,
  messageId: number,
  buttons: Button[][],
) {
  console.log("Trying add button", { chatId, messageId })
  for (let attempts = 0; attempts < 3; attempts++) {
    await sleepRandomAmountOfSeconds(1, 5)
    try {
      await editKeyboard(chatId, messageId, buttons)
      console.log("Buttons set", { attempts, chatId, messageId })
      return
    } catch (e) {
      console.log("Failed to set buttons", { attempts, chatId, messageId }, e)
    }
  }
  await bot.api.sendMessage(ADMIN_ID, "Ошибка с кнопками")
}

export function parseChannels(urls: string[]) {
  const channels = CHANNELS.filter((c) => urls.includes(c.url))
  return channels.map((c) => c.title)
}

export async function tryCopyMessages(
  chatId: number,
  toChatId: number,
  messageIds: number[],
  date: Date,
) {
  try {
    const data = new PostScheduleData([toChatId], messageIds[0], dayjs(date))
    return await poster.schedulePost(data)
  } catch (e) {
    await sendMessage(chatId, m.error(e))
    return false
  }
}
