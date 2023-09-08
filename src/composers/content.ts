import { nextYear } from "api"
import { findChannel } from "db"
import { bot } from "loader"
import { MsgHandler, MsgManager } from "manager"
import M, { messages } from "messages"
import { ScheduledPost, scheduledPostRepo } from "models"
import {
  createComposer,
  onCommand,
  onMessage,
  onQueryWithState,
} from "new/lib.ts"
import { editMessage, tryCopyMessages } from "../../bot/lib.ts"

export async function askPosts(mg: MsgManager) {
  const title = mg.parseQuery("channel")
  const channelId = await _askPosts(mg.chatId, mg.messageId, title)
  mg.setState("content:posts")
  mg.save({ channelId, filedIds: [], messageIds: [] })
}

export function savePostMessage(mg: MsgManager) {
  mg.session.messageIds.push(mg.messageId)
}

export async function onReady(mg: MsgManager) {
  mg.resetState()
  await _onReady(
    mg.chatId,
    mg.messageId,
    mg.session.channelId!,
    mg.session.messageIds,
  )
}

const cmp = createComposer()

async function handleContent(mg: MsgManager) {
  mg.setState("content:channel")
  await sendContentMenu(mg.chatId)
}

function sendContentMenu(chatId: number) {
  return bot.sendMessage(chatId, M.content.askChannel())
}

onCommand(cmp, "content").use(MsgHandler(handleContent))

onQueryWithState(cmp, "channel", "content:channel")
  .use(MsgHandler(askPosts))

onMessage(cmp, "content:posts").use(MsgHandler(savePostMessage))

onQueryWithState(cmp, "✅ Готово", "content:posts")
  .use(MsgHandler(onReady))

export { cmp as contentComposer }

async function _askPosts(
  chatId: number,
  messageId: number,
  channelTitle: string,
) {
  const channel = await findChannel(channelTitle)
  await editMessage(chatId, messageId, M.content.askPosts)
  return channel.id
}

const m = messages

async function _onReady(
  chatId: number,
  messageId: number,
  channelId: number,
  postMessageIds: number[],
) {
  // mg.resetState()
  const date = nextYear(new Date())
  if (!postMessageIds.length) {
    await editMessage(chatId, messageId, m.messagesNotFound)
    return
  }
  const postGroupId = await tryCopyMessages(
    chatId,
    channelId,
    postMessageIds,
    date,
  )
  if (!postGroupId) return
  await editMessage(chatId, messageId, m.contentAdded)
  const post = new ScheduledPost(postGroupId)
  await scheduledPostRepo.save(post)
}
