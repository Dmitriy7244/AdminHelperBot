import { REPORT_CHAT_ID } from "config"
import { reply, sendMessage } from "core/mod.ts"
import {
  Channel,
  parseChannels,
  resolveDate,
  resolveDatetime,
  Sale,
  saveLastMsgId,
  Seller,
  setState,
  tryDeleteLastMsg,
} from "lib"
import M from "messages"
import { Post } from "models"
import O from "observers"

O.addSale.handler = async (ctx) => {
  ctx.session.channels = []
  await reply(ctx, M.askChannels)
  setState(ctx, "sale:channels")
  await ctx.deleteMessage()
}

import("./pick_channels.ts")

O.saleDate.handler = async (ctx) => {
  try {
    ctx.session.date = resolveDate(ctx.msg.text)
  } catch {
    await reply(ctx, M.dateError)
    return
  }
  const msg = await reply(ctx, M.askTime)
  setState(ctx, "sale:time")
  await ctx.deleteMessage()
  await tryDeleteLastMsg(ctx)
  saveLastMsgId(ctx, msg)
}

O.saleTime.handler = async (ctx) => {
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
  await sendMessage(ctx, REPORT_CHAT_ID, M.sale(sale))
  const msg = await reply(ctx, M.askPost)
  setState(ctx)
  await ctx.deleteMessage()
  await tryDeleteLastMsg(ctx)
  saveLastMsgId(ctx, msg)
}

import("./schedule_post.ts")

O.text.handler = async (ctx) => {
  const channels = parseChannels(ctx.msg)
  if (!channels.length) return
  ctx.session.channels = channels
  setState(ctx, "sale:date")
  const msg = await reply(ctx, M.askDate)
  await ctx.deleteMessage()
  saveLastMsgId(ctx, msg)
}
