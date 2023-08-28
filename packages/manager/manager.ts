import { error, InlineKeyboard, Msg, parseQuery, setState } from "deps"
import { finish, replyError } from "lib"
import { MyContext, MySession, QueryPrefix, State } from "types"

export class Manager {
  constructor(public ctx: MyContext) {}

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

  deleteMessage = (msgId?: number) =>
    this.ctx.api.deleteMessage(this.chatId, msgId ?? this.messageId)

  finish = (msg: Msg) => finish(this.ctx, msg)

  replyError = (text: string) => replyError(this.ctx, text)

  setState = (state: State) => setState(this.ctx, state)
  resetState = () => setState(this.ctx)

  save = (data: Partial<MySession>) => {
    this.ctx.session = { ...this.ctx.session, ...data }
  }

  get chatId() {
    const id = this.ctx.chat?.id
    if (!id) error("No chat", { ctx: this.ctx })
    return id
  }

  getMediaGroupId() {
    return this.ctx.msg?.media_group_id
  }

  getMessageId() {
    return this.ctx.msg?.message_id
  }

  get messageId() {
    const id = this.getMessageId()
    if (!id) error("No any message", { ctx: this.ctx })
    return id
  }

  get forwardFromChat() {
    return this.ctx.msg?.forward_from_chat
  }

  get forwardFromChatId() {
    return this.forwardFromChat?.id
  }

  get entities() {
    return this.ctx.msg?.entities ?? []
  }

  get session() {
    return this.ctx.session as MySession
  }

  parseQuery = (prefix: QueryPrefix) => parseQuery(this.ctx, prefix)
}
