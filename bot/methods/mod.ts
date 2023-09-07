import { findSale } from "db"
import { Time } from "deps"
import { poster } from "loader"
import M from "messages"
import { Post, postRepo } from "models"
import { parseChannels, sendMessage, trySetButtons } from "../lib.ts"

// function start(chatId: number) {
//   return sendMessage(chatId, M.hello)
// }

function sendContentMenu(chatId: number) {
  return sendMessage(chatId, M.content.askChannel())
}

async function handleChannelPost(
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
  const _p = await postRepo.save(post)
  // schedulePostDelete(p) TODO: !
  if (!sale.buttons.length) return
  const buttons = sale.buttons.map((row) =>
    row.map((b) => ({ text: b.text, url: b.url }))
  )
  trySetButtons(chatId, messageId, buttons)
}

async function tryAddSale(chatId: number, urls: string[]) {
  const channels = parseChannels(urls)
  if (!channels.length) return
  const sentMsg = await sendMessage(chatId, M.askDate)
  return { channels, sentMsg }
}

const methods = {
  // start,
  sendContentMenu,
  // sendChannelsMenu,
  // sendChannelsRights,
  handleChannelPost,
  tryAddSale,
}

export default methods

// const CHAT_ID = 724477101
// start(CHAT_ID)
// sendContentMenu(CHAT_ID)
// sendSaleChannelsMenu(CHAT_ID)
// sendChannelsMenu(CHAT_ID)
// await handleChannelPost(-1001984549268, 194, "1")
// console.log(sendChannelsRights(CHAT_ID))
// console.log(
//   await tryAddSale(CHAT_ID, [
//     "https://t.me/+mqn0keEXql40Mzc6",
//     "https://t.me/test7244c",
//   ]),
// )
