import { CHANNELS } from "db"
import { cancelHandlers, exclude } from "deps"
import K from "kbs"
import { parseQuery, saveLastMsgId } from "lib"
import { bot } from "loader"
import { QueryHandler } from "manager"
import M from "messages"
import { createObserver } from "new/lib.ts"
import { editKeyboard } from "../../../bot/lib.ts"

const obs = createObserver()
const obsWithState = obs.state("sale:channels")

async function handleChannelPick(
  chatId: number,
  messageId: number,
  channel: string,
  pickedChannels: string[],
) {
  if (pickedChannels.includes(channel)) {
    pickedChannels = exclude(pickedChannels, [channel])
  } else pickedChannels.push(channel)
  await editKeyboard(chatId, messageId, K.pickChannels(pickedChannels))
  return pickedChannels
}

async function handleAllChannelsPick(
  chatId: number,
  messageId: number,
  pickedChannels: string[],
) {
  if (pickedChannels.length == CHANNELS.length) pickedChannels = []
  else pickedChannels = CHANNELS.map((c) => c.title)
  await editKeyboard(chatId, messageId, K.pickChannels(pickedChannels))
  return pickedChannels
}

async function handleChannelsPicked(
  chatId: number,
  queryId: string,
  channels: string[],
) {
  if (!channels.length) {
    await bot.answerQuery(queryId, "Выбери хотя бы один канал")
    cancelHandlers()
  }
  return await bot.sendMessage(chatId, M.askDate)
}

obsWithState.query("channel").handler = async (ctx) => {
  const channel = parseQuery(ctx, "channel")
  ctx.session.channels = await handleChannelPick(
    ctx.chat!.id,
    ctx.msg!.message_id,
    channel,
    ctx.session.channels,
  )
}
obsWithState.query("➕ Выбрать все").handler = async (ctx) => {
  ctx.session.channels = await handleAllChannelsPick(
    ctx.chat!.id,
    ctx.msg!.message_id,
    ctx.session.channels,
  )
}

obsWithState.query("✅ Готово").handler = QueryHandler(async (mg) => {
  const { channels } = mg.session
  const sentMsg = await handleChannelsPicked(
    mg.chatId,
    mg.query.id,
    channels,
  )
  saveLastMsgId(mg.ctx, sentMsg)
  mg.setState("sale:date")
  await mg.deleteMessage()
})

export { handleAllChannelsPick, handleChannelPick, obs as pickChannelsObserver }
