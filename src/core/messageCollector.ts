import { Context } from "core/types.ts"
import { sleep } from "utils"

class MessageCollector {
  private messages: Record<number, number[]> = {}

  constructor(private duration: number) {}

  async get(ctx: Context) {
    const chatId = ctx.chat!.id
    const messageId = ctx.message!.message_id
    console.log("messageId", messageId)
    const messages = this.messages
    if (!messages[chatId]) messages[chatId] = []
    let result = messages[chatId]
    result.push(messageId)
    await sleep(this.duration)
    if (messageId != result[0]) result = []
    messages[chatId] = []
    console.log("result", result)
    return result
  }
}

export default MessageCollector
