import { CHANNELS } from "db"
import { exclude } from "deps"
import K from "kbs"
import { cancelHandlers, parseQuery, saveLastMsgId } from "lib"
import M from "messages"
import { createComposer, onQuery, sendMessage, withState } from "new/lib.ts"
import { editKeyboard } from "../../../bot/lib.ts"

const cmp = createComposer()
const cmpWithState = withState(cmp, "sale:channels")

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

function handleChannelsPicked(chatId: number, channels: string[]) {
  if (!channels.length) cancelHandlers()
  return sendMessage(chatId, M.askDate)
}

onQuery(cmpWithState, "channel").use(async (ctx) => {
  const channel = parseQuery(ctx, "channel")
  ctx.session.channels = await handleChannelPick(
    ctx.chat!.id,
    ctx.msg!.message_id,
    channel,
    ctx.session.channels,
  )
})

onQuery(cmpWithState, "➕ Выбрать все").use(async (ctx) => {
  ctx.session.channels = await handleAllChannelsPick(
    ctx.chat!.id,
    ctx.msg!.message_id,
    ctx.session.channels,
  )
})

// TODO: message on 0 channels picked
onQuery(cmpWithState, "✅ Готово").use(async (ctx) => {
  console.log(ctx.session.state)
  const channels = ctx.session.channels
  const sentMsg = await handleChannelsPicked(ctx.chat!.id, channels)
  saveLastMsgId(ctx, sentMsg)
  ctx.session.state = "sale:date"
  await ctx.deleteMessage()
})

export { cmp as pickChannelsComposer, handleAllChannelsPick, handleChannelPick }
