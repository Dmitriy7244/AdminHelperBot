import {
  editText,
  error,
  filterFalsy,
  MessageEntity,
  Msg,
  parseEntity,
  sendMessage,
} from "deps"
import { askNext } from "lib"
import { MySession, State } from "types"
import { Manager } from "./manager.ts"

// TODO: check context type
export class MsgManager extends Manager {
  get msg() {
    return this.ctx.msg!
  }

  sendMessage(chatId: number, msg: Msg) {
    return sendMessage(this.ctx, chatId, msg)
  }

  async edit(msg: Msg, state?: State, data: Partial<MySession> = {}) {
    if (state !== undefined) this.setState(state)
    this.save(data)
    return await editText(this.ctx, msg)
  }

  get user() {
    return this.ctx.from!
  }

  getText() {
    return this.msg.text ?? this.msg.caption
  }

  get text() {
    const text = this.getText()
    if (!text) error("No text or caption", { ctx: this.ctx })
    return text
  }

  get inlineKeyboard() {
    return this.msg.reply_markup?.inline_keyboard
  }

  get urls() {
    return parseUrls(this.text, this.entities)
  }

  reply(msg: Msg | string, state?: State, data: Partial<MySession> = {}) {
    if (typeof msg == "string") msg = new Msg(msg)
    return askNext(this.ctx, msg, state, data)
  }
}

function parseUrl(text: string, entity: MessageEntity) {
  if (entity.type == "mention") {
    const mention = parseEntity(entity, text)
    return mention.replace("@", "https://t.me/")
  } else if (entity.type == "url") {
    return parseEntity(entity, text)
  } else if (entity.type == "text_link") {
    return entity.url
  }
}

function parseUrls(text: string, entities: MessageEntity[]) {
  const urls = entities.map((e) => parseUrl(text, e))
  return filterFalsy(urls)
}
