import { CHANNELS } from "config"
import K from "kbs"
import { saveLastMsgId, setState } from "lib"
import M from "messages"
import { editReplyMarkup, exclude, parseQuery, reply } from "my_grammy_lib"
import O from "observers"

O.pickChannel.handler = async (ctx) => {
  const channel = parseQuery(ctx, "channel")
  let channels = ctx.session.channels
  if (channels.includes(channel)) channels = exclude(channels, channel)
  else channels.push(channel)
  ctx.session.channels = channels
  await editReplyMarkup(ctx, K.channels(channels))
}

O.pickAllChannels.handler = async (ctx) => {
  let channels = ctx.session.channels
  if (channels.length == CHANNELS.length) channels = []
  else channels = CHANNELS.map((c) => c.title)
  ctx.session.channels = channels
  await editReplyMarkup(ctx, K.channels(channels))
}

O.saleChannelsReady.handler = async (ctx) => {
  const channels = ctx.session.channels
  if (!channels.length) {
    await ctx.answerCallbackQuery("Выбери хотя бы один канал")
    return
  }
  setState(ctx, "sale:date")
  saveLastMsgId(ctx, await reply(ctx, M.askDate))
  await ctx.deleteMessage()
}
