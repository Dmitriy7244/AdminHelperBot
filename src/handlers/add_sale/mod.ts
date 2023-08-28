import { REPORT_CHAT_ID, resolveDate, resolveDatetime } from "api"
import { AD_TOP_DURATION } from "config"
import * as db from "db"
import { log } from "deps"
import K from "kbs"
import {
  resetSalePost,
  saveLastMsgId,
  scheduleNewContentPost,
  tryDeleteLastMsg,
} from "lib"
import { MsgManager } from "manager"
import M from "messages"
import { Sale, saleModel, Seller } from "models"
import { deletePost } from "userbot"

export async function date(mg: MsgManager) {
  try {
    mg.saveData({ date: resolveDate(mg.text) })
  } catch {
    await mg.reply(M.dateError)
    return
  }
  await onSaleDate(mg)
}

export async function dateToday(mg: MsgManager) {
  mg.saveData({ date: new Date(), lastMessageId: undefined })
  await onSaleDate(mg)
}

export async function dateTomorrow(mg: MsgManager) {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  mg.saveData({ date, lastMessageId: undefined })
  await onSaleDate(mg)
}

export async function time(mg: MsgManager) {
  const date = mg.session.date!
  try {
    resolveDatetime(mg.text, date)
  } catch {
    await mg.reply(M.timeError)
    return
  }
  const channels = await db.findChannels(mg.session.channels)
  const seller = new Seller(mg.user.id, mg.user.first_name)
  const sale = new Sale(date, channels, seller)
  const saleDoc = await saleModel.create(sale)
  await mg.sendMessage(REPORT_CHAT_ID, M.sale(sale, saleDoc.id))
  mg.resetState()
  await mg.deleteMessage()
  await tryDeleteLastMsg(mg.ctx)
  channels.forEach((c) => {
    scheduleNewContentPost(c.id, date.getTime() / 1000 + AD_TOP_DURATION)
  })
}

export async function onDeletePost(mg: MsgManager) {
  const saleId = mg.parseQuery("Удалить пост")
  const sale = await db.getSale(saleId)
  for (const post of sale.scheduledPosts) {
    await deletePost(post.chatId, post.messageIds)
  }
  await db.deletePost(saleId)
  await mg.editKeyboard(K.schedulePost(saleId))
}

export async function addButtons(mg: MsgManager) {
  const saleId = mg.parseQuery("Добавить кнопки")
  const msg = await mg.reply(M.askButtons, "sale:buttons", { saleId })
  saveLastMsgId(mg, msg)
}

export async function schedulePost(mg: MsgManager) {
  const saleId = mg.parseQuery("Запланировать пост")
  log("Schedule post", { saleId })
  resetSalePost(mg)
  const m = M.postOptions(
    mg.session.deleteTimerHours,
    mg.session.asForward,
    mg.session.noSound,
  )
  await mg.hideKeyboard()
  await mg.reply(m, "sale:post", { saleMsgId: mg.messageId, saleId: saleId })
}

async function onSaleDate(mg: MsgManager) {
  const msg = await mg.reply(M.askTime, "sale:time")
  await mg.deleteMessage()
  await tryDeleteLastMsg(mg.ctx)
  saveLastMsgId(mg, msg)
}
