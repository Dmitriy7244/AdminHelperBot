import { InlineKeyboard } from "grammy"
import { InlineKeyboardButton, MessageEntity } from "tg"
import { Context, State } from "types"
import { bot } from "./bot.ts"

class Msg {
  constructor(public text: string, public keyboard?: InlineKeyboard) {}
}

const sendOptions = { disable_web_page_preview: true }

const sendMessage = (chatId: number, msg: Msg) =>
  bot.api.sendMessage(
    chatId,
    msg.text,
    { ...sendOptions, reply_markup: msg.keyboard },
  )

const reply = (ctx: Context, msg: Msg) => sendMessage(ctx.chat!.id, msg)

const setState = (ctx: Context, state?: State) => ctx.session.state = state

function parseEntity(entity: MessageEntity, text: string) {
  return text.slice(entity.offset, entity.offset + entity.length)
}

const link = (url: string, text: string) => `<a href="${url}">${text}</a>`
const bold = (text: string) => `<b>${text}</b>`

function addButtons(
  kb: InlineKeyboard,
  buttons: InlineKeyboardButton[],
  rowWidth = 1,
) {
  let count = 0
  for (const button of buttons) {
    if (count == rowWidth) {
      kb.row()
      count = 0
    }
    kb.add(button)
    count += 1
  }
  return kb.row()
}

function removePrefix(s: string, prefix: string) {
  if (!s.startsWith(prefix)) return s
  return s.replace(prefix, "")
}

function exclude<T>(array: T[], value: T) {
  return array.filter((item) => item !== value)
}

export function editReplyMarkup(ctx: Context, keyboard: InlineKeyboard) {
  return ctx.editMessageReplyMarkup({ reply_markup: keyboard })
}

function Time(date?: Date) {
  if (!date) date = new Date()
  return date.getTime() / 1000
}

export {
  addButtons,
  bold,
  exclude,
  link,
  Msg,
  parseEntity,
  removePrefix,
  reply,
  sendMessage,
  setState,
  Time,
}
