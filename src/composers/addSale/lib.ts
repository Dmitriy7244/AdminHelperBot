import { REPORT_CHAT_ID, resolveDatetime } from "api"
import { AD_TOP_DURATION } from "config"
import * as db from "db"
import K from "kbs"
import {
  parseQuery,
  saveLastMsgId,
  scheduleNewContentPost,
  tryDeleteLastMsg,
} from "lib"
import { bot, poster } from "loader"
import { MsgManager } from "manager"
import M from "messages"
import { Sale, saleRepo, Seller } from "models"
import { MyContext } from "types"

function askPickChannels(chatId: number) {
  return bot.sendMessage(chatId, M.askChannels())
}

async function onSaleDate(ctx: MyContext) {
  const msg = await bot.sendMessage(ctx.chat!.id, M.askTime)
  ctx.session.state = "sale:time"
  await ctx.deleteMessage()
  await tryDeleteLastMsg(ctx)
  saveLastMsgId(ctx, msg)
}

async function handleTime(ctx: MyContext) {
  const mg = new MsgManager(ctx)
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
  const saleId = await saleRepo.save(sale)
  await mg.sendMessage(REPORT_CHAT_ID, M.sale(sale, saleId))
  mg.resetState()
  await mg.deleteMessage()
  await tryDeleteLastMsg(mg.ctx)
  channels.forEach((c) => {
    scheduleNewContentPost(c.id, date.getTime() / 1000 + AD_TOP_DURATION)
  })
}

async function handleDeletePost(ctx: MyContext) {
  const mg = new MsgManager(ctx)
  const saleId = mg.parseQuery("Удалить посты")
  const sale = await db.getSale(saleId)
  await poster.deletePostGroup(sale.postGroupId!)
  sale.postGroupId = undefined
  await db.deleteSalePost(saleId)
  await mg.editKeyboard(K.schedulePost(saleId))
  await saleRepo.save(sale)
}

async function handleAddButtons(ctx: MyContext) {
  const saleId = parseQuery(ctx, "Добавить кнопки")
  ctx.session.state = "sale:buttons"
  ctx.session.saleId = saleId
  const sentMsg = await bot.sendMessage(ctx.chat!.id, M.askButtons)
  saveLastMsgId(ctx, sentMsg)
}

export {
  askPickChannels,
  handleAddButtons,
  handleDeletePost,
  handleTime,
  onSaleDate,
}
