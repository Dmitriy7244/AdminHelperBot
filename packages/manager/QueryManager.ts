import { error } from "deps"
import { MsgManager } from "./MsgManager.ts"

export class QueryManager extends MsgManager {
  answerQuery(text: string, alert = true) {
    return this.ctx.answerCallbackQuery({ text, show_alert: alert })
  }

  get query() {
    const query = this.ctx.callbackQuery
    if (!query) error("No query", { ctx: this.ctx })
    return query
  }
}
