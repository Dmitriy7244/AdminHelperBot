import { MsgManager } from "manager"

export class QueryManager extends MsgManager {
  answerQuery(text: string, alert = true) {
    return this.ctx.answerCallbackQuery({ text, show_alert: alert })
  }
}
