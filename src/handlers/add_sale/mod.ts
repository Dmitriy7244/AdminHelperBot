import { REPORT_CHAT_ID } from "config"
import {
  findChannel,
  parseChannels,
  resolveDate,
  resolveDatetime,
  saveLastMsgId,
  setState,
  tryDeleteLastMsg,
} from "lib"
import M from "messages"
import { Sale, Seller } from "models"
import { reply, sendMessage } from "my_grammy_lib"
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
  const channels = ctx.session.channels!.map((c) => findChannel(c))
  const seller = new Seller(ctx.from.id, ctx.from.first_name)
  const sale = new Sale(ctx.session.date!, channels, seller)
  ctx.session.sale = sale
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
