import { MsgHandler, MsgManager } from "manager"
import {
  createComposer,
  onCommand,
  onMessage,
  onQueryWithState,
} from "new/lib.ts"
import methods2 from "../../bot/methods/content.ts"
import methods from "../../bot/methods/mod.ts"

export async function askPosts(mg: MsgManager) {
  const title = mg.parseQuery("channel")
  const channelId = await methods2.askPosts(mg.chatId, mg.messageId, title)
  mg.setState("content:posts")
  mg.save({ channelId, filedIds: [], messageIds: [] })
}

export function savePostMessage(mg: MsgManager) {
  mg.session.messageIds.push(mg.messageId)
}

export async function onReady(mg: MsgManager) {
  mg.resetState()
  await methods2.onReady(
    mg.chatId,
    mg.messageId,
    mg.session.channelId!,
    mg.session.messageIds,
  )
}

const cmp = createComposer()

async function handleContent(mg: MsgManager) {
  mg.setState("content:channel")
  await methods.sendContentMenu(mg.chatId)
}

onCommand(cmp, "content").use(MsgHandler(handleContent))

onQueryWithState(cmp, "channel", "content:channel")
  .use(MsgHandler(askPosts))

onMessage(cmp, "content:posts").use(MsgHandler(savePostMessage))

onQueryWithState(cmp, "✅ Готово", "content:posts")
  .use(MsgHandler(onReady))

export { cmp as contentComposer }
