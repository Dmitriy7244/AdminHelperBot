import { editReplyMarkup, exclude, reply, sendMessage, setState } from "core"
import { parseQuery } from "./buttons.ts"
import { REPORT_GROUP_ID } from "./config.ts"
import K from "./kbs.ts"
import { parseChannels, resolveDate, resolveDatetime } from "./lib.ts"
import M from "./messages.ts"
import { Channel, Post, Sale, Seller } from "./models.ts"
import O from "./observers.ts"

O.start.handler = (ctx) => reply(ctx, M.hello)
O.channels.handler = (ctx) => reply(ctx, M.channels)
O.userbot.handler = (ctx) => reply(ctx, M.userbot)

O.addSale.handler = async (ctx) => {
  ctx.session.channels = []
  await reply(ctx, M.askChannels)
}

O.text.state("sale:date").handler = async (ctx) => {
  try {
    ctx.session.date = resolveDate(ctx.msg.text)
  } catch {
    await reply(ctx, M.dateError)
    return
  }
  setState(ctx, "sale:time")
  await reply(ctx, M.askTime)
}

O.text.state("sale:time").handler = async (ctx) => {
  try {
    resolveDatetime(ctx.msg.text, ctx.session.date!)
  } catch {
    await reply(ctx, M.timeError)
    return
  }
  const channels = ctx.session.channels!.map((c) => Channel.fromTitle(c))
  const post = new Post(ctx.session.date!)
  const seller = new Seller(ctx.from.id, ctx.from.first_name)
  const sale = new Sale(seller, channels, [post])
  await sendMessage(REPORT_GROUP_ID, M.sale(sale))
  await reply(ctx, M.askPost)
  setState(ctx) // TODO: post state
}

O.text.handler = async (ctx) => {
  const channels = parseChannels(ctx.msg)
  console.log(channels)
  if (!channels.length) return
  ctx.session.channels = channels
  setState(ctx, "sale:date")
  await reply(ctx, M.askDate)
}

O.pickChannel.handler = async (ctx) => {
  const channel = parseQuery(ctx, "channel")
  let channels = ctx.session.channels ?? []
  if (channels.includes(channel)) channels = exclude(channels, channel)
  else channels.push(channel)
  ctx.session.channels = channels
  await editReplyMarkup(ctx, K.channels(channels))
}
