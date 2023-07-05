import { MessageEntity } from "tg"
import { bot } from "./bot.ts"
import { Context, State } from "./types.ts"

class Msg {
  constructor(public text: string) {}
}

const sendOptions = { disable_web_page_preview: true }

const sendMessage = (chatId: number, msg: Msg) =>
  bot.api.sendMessage(chatId, msg.text, sendOptions)

const reply = (ctx: Context, msg: Msg) => sendMessage(ctx.chat!.id, msg)

const setState = (ctx: Context, state?: State) => ctx.session.state = state

function parseEntity(entity: MessageEntity, text: string) {
  return text.slice(entity.offset, entity.offset + entity.length)
}

const link = (url: string, text: string) => `<a href="${url}">${text}</a>`
const bold = (text: string) => `<b>${text}</b>`

export { bold, link, Msg, parseEntity, reply, sendMessage, setState }
