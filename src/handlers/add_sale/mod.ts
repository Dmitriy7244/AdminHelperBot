import { REPORT_CHAT_ID, resolveDate, resolveDatetime } from "api"
import { AD_TOP_DURATION } from "config"
import * as db from "db"
import { reply, sendMessage } from "deps"
import K from "kbs"
import {
  saveLastMsgId,
  scheduleNewContentPost,
  setState,
  tryDeleteLastMsg,
} from "lib"
import { Handler } from "manager"
import M from "messages"
import { Sale, saleModel, Seller } from "models"
import observers from "observers"
import { MyContext } from "types"
import { deletePost } from "userbot"

const o = observers.addSale

o._.handler = async (ctx) => {
  ctx.session.channels = []
  await reply(ctx, M.askChannels)
  setState(ctx, "sale:channels")
  await ctx.deleteMessage()
}

import("./pick_channels.ts")

o.date.handler = async (ctx) => {
  try {
    ctx.session.date = resolveDate(ctx.msg.text)
  } catch {
    await reply(ctx, M.dateError)
    return
  }
  await onSaleDate(ctx)
}

o.dateToday.handler = async (ctx) => {
  ctx.session.date = new Date()
  ctx.session.lastMessageId = undefined
  await onSaleDate(ctx)
}

o.dateTomorrow.handler = async (ctx) => {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  ctx.session.date = date
  ctx.session.lastMessageId = undefined
  await onSaleDate(ctx)
}

o.time.handler = async (ctx) => {
  const date = ctx.session.date!
  try {
    resolveDatetime(ctx.msg.text, date)
  } catch {
    await reply(ctx, M.timeError)
    return
  }
  const channels = await db.findChannels(ctx.session.channels)
  const seller = new Seller(ctx.from.id, ctx.from.first_name)
  const sale = new Sale(date, channels, seller)
  const saleDoc = await saleModel.create(sale)
  await sendMessage(ctx, REPORT_CHAT_ID, M.sale(sale, saleDoc.id))
  setState(ctx)
  await ctx.deleteMessage()
  await tryDeleteLastMsg(ctx)

  channels.forEach((c) => {
    scheduleNewContentPost(c.id, date.getTime() / 1000 + AD_TOP_DURATION)
  })
}

import("./schedule_post.ts")
import("./add_buttons.ts")

o.deletePost.handler = Handler(async (mg) => {
  const saleId = mg.parseQuery("Удалить пост")
  const sale = await db.getSale(saleId)
  for (const post of sale.scheduledPosts) {
    await deletePost(post.chatId, post.messageIds)
  }
  await db.deletePost(saleId)
  await mg.editKeyboard(K.schedulePost(saleId))
})

async function onSaleDate(ctx: MyContext) {
  const msg = await reply(ctx, M.askTime)
  setState(ctx, "sale:time")
  await ctx.deleteMessage()
  await tryDeleteLastMsg(ctx)
  saveLastMsgId(ctx, msg)
}
