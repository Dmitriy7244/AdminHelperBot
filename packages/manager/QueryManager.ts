import { MsgManager } from "./MsgManager.ts"

export class QueryManager extends MsgManager {
  answerQuery(text: string, alert = true) {
    return this.ctx.answerCallbackQuery({ text, show_alert: alert })
  }
}
