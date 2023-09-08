import { findSale } from "db"
import { Time } from "deps"
import { poster } from "loader"
import { MsgHandler, MsgManager } from "manager"
import { Post, postRepo } from "models"
import { createComposer, onChannelPost } from "new/lib.ts"
import { trySetButtons } from "../../bot/lib.ts"
import { schedulePostDelete } from "lib"

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
  if (!sale.buttons.length) return
  const buttons = sale.buttons.map((row) =>
    row.map((b) => ({ text: b.text, url: b.url }))
  )
  trySetButtons(chatId, messageId, buttons)
}
