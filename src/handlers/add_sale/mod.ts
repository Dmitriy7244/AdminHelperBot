import { REPORT_CHAT_ID, resolveDate, resolveDatetime } from "api"
import { AD_TOP_DURATION } from "config"
import {
  findChannel,
  parseChannels,
  saveLastMsgId,
  scheduleNewContentPost,
  setState,
  tryDeleteLastMsg,
} from "lib"
import M from "messages"
import { Sale, SaleDoc, Seller } from "models"
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
  const date = ctx.session.date!
  try {
    resolveDatetime(ctx.msg.text, date)
  } catch {
    await reply(ctx, M.timeError)
    return
  }
  const channels = ctx.session.channels!.map((c) => findChannel(c))
  const seller = new Seller(ctx.from.id, ctx.from.first_name)
  const sale = new Sale(date, channels, seller)
  const saleDoc = await SaleDoc.create(sale)
  await sendMessage(ctx, REPORT_CHAT_ID, M.sale(sale))
  const msg = await reply(ctx, M.askPost(saleDoc.id))
  setState(ctx)
  await ctx.deleteMessage()
  await tryDeleteLastMsg(ctx)
  saveLastMsgId(ctx, msg)

  channels.forEach((c) => {
    scheduleNewContentPost(c.id, date.getTime() / 1000 + AD_TOP_DURATION)
  })
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
