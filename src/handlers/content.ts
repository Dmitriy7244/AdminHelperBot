import { MsgManager } from "manager"
import methods from "../../bot/methods/content.ts"

export async function askPosts(mg: MsgManager) {
  const title = mg.parseQuery("channel")
  const channelId = await methods.askPosts(mg.chatId, mg.messageId, title)
  mg.setState("content:posts")
  mg.save({ channelId, filedIds: [], messageIds: [] })
}

export function savePostMessage(mg: MsgManager) {
  mg.session.messageIds.push(mg.messageId)
}

export async function onReady(mg: MsgManager) {
  mg.resetState()
  await methods.onReady(
    mg.chatId,
    mg.messageId,
    mg.session.channelId!,
    mg.session.messageIds,
  )
}
