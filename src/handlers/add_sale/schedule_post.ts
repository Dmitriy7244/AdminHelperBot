import { BaseContext, editText } from "deps"
import { parseQuery, resetSalePost, setState, updatePostOptions } from "lib"
import M from "messages"
import { Button, saleModel } from "models"
import observers from "observers"
import { copyMessages } from "userbot"

const o = observers.addSale.schedulePost

o._.handler = async (ctx) => {
  const saleId = parseQuery(ctx, "Запланировать пост")
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
  await editText(ctx, m)
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
  const messageIds = ctx.session.messageIds!

  if (!messageIds.length) {
    await answerQuery(ctx, "Сначала отправь пост, потом вернись к этой кнопке")
    return
  }

  const saleId = ctx.session.saleId!
  const sale = await saleModel.findById(saleId)
  if (!sale) {
    ctx.reply("Ошибка, зовите Дмитрия")
    return
  }
  sale.text = ctx.session.postText
  sale.buttons = ctx.session.saleButtons
  sale.deleteTimerHours = ctx.session.deleteTimerHours
  await sale.save()

  for (const c of sale.channels) {
    try {
      await copyMessages(
        c.id,
        ctx.chat!.id,
        messageIds,
        ctx.session.date!,
        ctx.session.asForward,
        ctx.session.noSound,
      )
    } catch (e) {
      ctx.reply(`<b>[Ошибка]</b> <code>${e}</code>`)
      return
    }
  }
  setState(ctx)
  await editText(ctx, M.postScheduled(saleId))
  for (const id of messageIds) {
    await ctx.api.deleteMessage(ctx.chat!.id, id)
  }
}
