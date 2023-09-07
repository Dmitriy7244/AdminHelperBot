import { addChannel } from "db"
import M, { messages } from "messages"
import { cancelHandlers, sendMessage } from "new/lib.ts"

const m = messages.channels.addChannel

function sendChannelsMenu(chatId: number) {
  return sendMessage(chatId, M.channels())
}

function askChannelPost(chatId: number) {
  return sendMessage(chatId, m.askPost)
}

async function handleChannelPost(chatId: number, postChannelId?: number) {
  if (!postChannelId) {
    await sendMessage(chatId, "Не вижу источника поста")
    cancelHandlers()
  }
  await sendMessage(chatId, m.askLink)
}

async function handleChannelLink(chatId: number, textUrls: string[]) {
  if (!textUrls.length) {
    await sendMessage(chatId, "В сообщении не найдена ссылка")
    cancelHandlers()
  }
  await sendMessage(chatId, m.askTitle)
  return textUrls[0]
}

async function saveChannel(
  chatId: number,
  channelData: {
    id: number
    title: string
    link: string
  },
) {
  await addChannel(channelData.id!, channelData.title, channelData.link)
  await sendMessage(chatId, m.success)
}

async function askPickChannel(chatId: number) {
  await sendMessage(chatId, M.pickChannel())
}

export {
  askChannelPost,
  askPickChannel,
  handleChannelLink,
  handleChannelPost,
  saveChannel,
  sendChannelsMenu,
}
