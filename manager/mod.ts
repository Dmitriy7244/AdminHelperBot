import {
  BaseContext,
  editText,
  error,
  filterFalsy,
  InlineKeyboard,
  MessageEntity,
  Msg,
  parseEntity,
  parseQuery,
  setState,
} from "deps"
import { askNext, finish, replyError } from "lib"
import { MySession, QueryPrefix, State } from "types"

export class Manager {
  constructor(public ctx: BaseContext) {}

  editKeyboard(kb: InlineKeyboard, msgId?: number) {
    msgId = msgId ?? this.messageId
    if (!msgId) error("No message_id")
    return this.ctx.api.editMessageReplyMarkup(
      this.ctx.chat!.id,
      msgId,
      { reply_markup: kb },
    )
  }

  hideKeyboard = () => this.ctx.editMessageReplyMarkup()

  reply = (msg: Msg, state?: State, data: Partial<MySession> = {}) =>
    askNext(this.ctx, msg, state, data)

  finish = (msg: Msg) => finish(this.ctx, msg)

  replyError = (text: string) => replyError(this.ctx, text)

  async edit(msg: Msg, state?: State) {
    if (state !== undefined) this.setState(state)
    return await editText(this.ctx, msg)
  }
  setState = (state: State) => setState(this.ctx, state)

  get messageId() {
    return this.ctx.msg?.message_id
  }

  get forwardFromChat() {
    return this.ctx.msg?.forward_from_chat
  }

  get forwardFromChatId() {
    return this.forwardFromChat?.id
  }

  get text() {
    const msg = this.ctx.msg
    const text = msg?.text ?? msg?.caption
    if (!text) error("No text or caption", { ctx: this.ctx })
    return text
  }

  get entities() {
    return this.ctx.msg?.entities ?? []
  }

  get urls() {
    return parseUrls(this.text, this.entities)
  }

  get session() {
    return this.ctx.session as MySession
  }

  parseQuery = (prefix: QueryPrefix) => parseQuery(this.ctx, prefix)
}

export function Handler(callback: (manager: Manager) => Promise<any>) {
  return async (ctx: BaseContext) => {
    const manager = new Manager(ctx)
    await callback(manager)
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
