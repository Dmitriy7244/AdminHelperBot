import { Context } from "types"

export const sleep = (secs: number) =>
  new Promise((x) => setTimeout(x, secs * 1000))

class MessageCollector {
  private messages: Record<number, number[]> = {}

  constructor(private duration: number) {}

  async get(ctx: Context) {
    const chatId = ctx.chat!.id
    const messageId = ctx.message!.message_id
    const messages = this.messages
    if (!messages[chatId]) messages[chatId] = []
    let result = messages[chatId]
    result.push(messageId)
    await sleep(this.duration)
    if (messageId != result[0]) result = []
    messages[chatId] = []
    return result
  }
}

const messageCollector = new MessageCollector(1)

export default messageCollector