import { addChannel } from "db"
import { bot } from "loader"
import M, { messages } from "messages"
import { cancelHandlers } from "deps"

const m = messages.channels.addChannel

function sendChannelsMenu(chatId: number) {
  return bot.sendMessage(chatId, M.channels())
}

function askChannelPost(chatId: number) {
  return bot.sendMessage(chatId, m.askPost)
}

async function handleChannelPost(chatId: number, postChannelId?: number) {
  if (!postChannelId) {
    await bot.sendMessage(chatId, "Не вижу источника поста")
    cancelHandlers()
  }
  await bot.sendMessage(chatId, m.askLink)
}

async function handleChannelLink(chatId: number, textUrls: string[]) {
  if (!textUrls.length) {
    await bot.sendMessage(chatId, "В сообщении не найдена ссылка")
    cancelHandlers()
  }
  await bot.sendMessage(chatId, m.askTitle)
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
  await bot.sendMessage(chatId, m.success)
}

async function askPickChannel(chatId: number) {
  await bot.sendMessage(chatId, M.pickChannel())
}

export {
  askChannelPost,
  askPickChannel,
  handleChannelLink,
  handleChannelPost,
  saveChannel,
  sendChannelsMenu,
}
