import { nextYear } from "api"
import { findChannel } from "db"
import M, { messages as m } from "messages"
import { scheduledPostModel } from "models"
import { editMessage, tryCopyMessages } from "../lib.ts"

async function askPosts(
  chatId: number,
  messageId: number,
  channelTitle: string,
) {
  const channel = await findChannel(channelTitle)
  await editMessage(chatId, messageId, M.content.askPosts)
  return channel.id
}

async function onReady(
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
  await scheduledPostModel.create({ postGroupId })
}

const methods = { askPosts, onReady }
export default methods

// console.log(await askPosts(-1001315549534, 7586, "Test1"))
// await onReady(-1001315549534, 7585, -1001585027208, [7589])
