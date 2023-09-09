import { findSale } from "db"
import { Time } from "deps"
import { schedulePostDelete } from "lib"
import { poster } from "loader"
import { MsgHandler, MsgManager } from "manager"
import { Post, postRepo } from "models"
import { createComposer, onChannelPost } from "new/lib.ts"
import { trySetButtons } from "../../bot/lib.ts"

const cmp = createComposer()

async function handleChannelPost(mg: MsgManager) {
  await _handleChannelPost(
    mg.chatId,
    mg.messageId,
    mg.text,
    mg.getMediaGroupId(),
  )
}

onChannelPost(cmp).use(MsgHandler(handleChannelPost))

export { cmp as channelPostComposer }

async function _handleChannelPost(
  chatId: number,
  messageId: number,
  text?: string,
  mediaGroupId?: string,
) {
  if (!text) return
  console.log("New channel post", { chatId, messageId })

  const buttons = await poster.getPostButtons(text)
  if (buttons && buttons.length) trySetButtons(chatId, messageId, buttons)

  const sale = await findSale(text)
  if (!sale) return
  console.log("Sale post found", { chatId, messageId })
  let messageIds = [messageId]
  if (mediaGroupId) {
    messageIds = await poster.getPostMessageIds(chatId, messageId)
  }
  const deleteTime = Time() + (sale.deleteTimerHours ?? 48) * 60 * 60
  const post = new Post(chatId, messageIds, deleteTime)
  await postRepo.save(post)
  schedulePostDelete(post)
}
