import { BaseContext, log } from "deps"
import K from "kbs"
import { parseQuery, resetSalePost, setState, updatePostOptions } from "lib"
import { Manager } from "manager"
import M from "messages"
import { Button, saleModel, ScheduledPost } from "models"
import observers from "observers"
import { copyMessages } from "userbot"

const o = observers.addSale.schedulePost

o._.handler = async (ctx) => {
  const mg = new Manager(ctx)
  const saleId = parseQuery(ctx, "Запланировать пост")
  log("Schedule post", {saleId})
  ctx.session.saleId = saleId
  ctx.session.saleButtons = []
  ctx.session.deleteTimerHours = 48
  setState(ctx, "sale:post")
  resetSalePost(ctx)
  const m = M.postOptions(
    ctx.session.deleteTimerHours,
    ctx.session.asForward,
    ctx.session.noSound,
  )
  await mg.hideKeyboard()
  await mg.reply(m, undefined, { saleMsgId: mg.messageId })
}

o.asForward.handler = async (ctx) => {
  await updatePostOptions(ctx, !ctx.session.asForward, ctx.session.noSound)
}

o.noSound.handler = async (ctx) => {
  await updatePostOptions(ctx, ctx.session.asForward, !ctx.session.noSound)
}

o.deleteTimer.handler = async (ctx) => {
  let hours = ctx.session.deleteTimerHours
  if (hours == 24) hours = 48
  else if (hours == 48) hours = 2
  else hours = 24
  ctx.session.deleteTimerHours = hours
  await updatePostOptions(ctx, ctx.session.asForward, ctx.session.noSound)
}

function answerQuery(ctx: BaseContext, text: string, alert = true) {
  return ctx.answerCallbackQuery({ text, show_alert: alert })
}

o.postMessage.handler = (ctx) => {
  ctx.session.messageIds.push(ctx.msg.message_id)
  const text = ctx.msg.text ?? ctx.msg.caption
  const buttons = (ctx.msg.reply_markup?.inline_keyboard ?? []) as Button[][]
  if (text) ctx.session.postText = text
  ctx.session.saleButtons.push(...buttons)
  console.log(ctx.session.saleButtons)
}

o.ready.handler = async (ctx) => {
  const mg = new Manager(ctx)
  const messageIds = ctx.session.messageIds!

  if (!messageIds.length) {
    await answerQuery(ctx, "Сначала отправь пост, потом вернись к этой кнопке")
    return
  }

  const saleId = ctx.session.saleId!
  const sale = await saleModel.findById(saleId)
  const chatId = ctx.chat!.id
  if (!sale) {
    ctx.reply("Ошибка, зовите Дмитрия")
    return
  }
  sale.text = ctx.session.postText
  sale.buttons = ctx.session.saleButtons
  sale.deleteTimerHours = ctx.session.deleteTimerHours

  console.log(sale.publishDate)

  for (const c of sale.channels) {
    try {
      const msgIds = await copyMessages(
        c.id,
        chatId,
        messageIds,
        sale.publishDate,
        ctx.session.asForward,
        ctx.session.noSound,
      )
      sale.scheduledPosts.push(new ScheduledPost(c.id, msgIds))
    } catch (e) {
      ctx.reply(`<b>[Ошибка]</b> <code>${e}</code>`)
      return
    }
  }
  await sale.save()
  setState(ctx)

  await mg.editKeyboard(K.addPostButtons(saleId), ctx.session.saleMsgId)
  await ctx.deleteMessage()
  for (const id of messageIds) {
    await ctx.api.deleteMessage(ctx.chat!.id, id)
  }
}
