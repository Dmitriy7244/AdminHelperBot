import { reply, sendMessage, setState } from "core"
import { REPORT_GROUP_ID } from "./config.ts"
import {
  Channel,
  parseChannels,
  Post,
  resolveDate,
  resolveDatetime,
  Sale,
  Seller,
} from "./lib.ts"
import M from "./messages.ts"
import O from "./observers.ts"

O.start.handler = (ctx) => reply(ctx, M.hello)
O.channels.handler = (ctx) => reply(ctx, M.channels)
O.userbot.handler = (ctx) => reply(ctx, M.userbot)

O.addSale.handler = async (ctx) => {
  await reply(ctx, M.askDate)
  setState(ctx, "sale:date")
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
