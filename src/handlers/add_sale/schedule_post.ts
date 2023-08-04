import { ButtonsPreview, parseButtons } from "api"
import {
  parseQuery,
  resetSalePost,
  saveLastMsgId,
  setState,
  tryDeleteLastMsg,
  updatePostOptions,
} from "lib"
import M from "messages"
import { Button, SaleDoc } from "models"
import { BaseContext } from "my_grammy"
import { editText, reply } from "my_grammy_lib"
import O from "observers"
import { copyMessages } from "userbot"

O.schedulePost.handler = async (ctx) => {
  const saleId = parseQuery(ctx, "Запланировать пост")
  ctx.session.saleId = saleId
  ctx.session.saleButtons = []
  setState(ctx, "sale:post")
  resetSalePost(ctx)
  const m = M.postOptions(ctx.session.asForward, ctx.session.noSound)
  await editText(ctx, m)
}

O.salePostMessage.handler = (ctx) => {
  ctx.session.messageIds.push(ctx.msg.message_id)
  const text = ctx.msg.text ?? ctx.msg.caption
  const buttons = (ctx.msg.reply_markup?.inline_keyboard ?? []) as Button[][]
  if (text) ctx.session.postText = text
  ctx.session.saleButtons.push(...buttons)
  console.log(ctx.session.saleButtons)
}

O.asForward.handler = async (ctx) => {
  await updatePostOptions(ctx, !ctx.session.asForward, ctx.session.noSound)
}

O.noSound.handler = async (ctx) => {
  await updatePostOptions(ctx, ctx.session.asForward, !ctx.session.noSound)
}

function answerQuery(ctx: BaseContext, text: string, alert = true) {
  return ctx.answerCallbackQuery({ text, show_alert: alert })
}

O.salePostReady.handler = async (ctx) => {
  const messageIds = ctx.session.messageIds!

  if (!messageIds.length) {
    await answerQuery(ctx, "Сначала отправь пост, потом вернись к этой кнопке")
    return
  }

  const saleId = ctx.session.saleId!
  const sale = await SaleDoc.findById(saleId)
  if (!sale) {
    ctx.reply("Ошибка, зовите Дмитрия")
    return
  }
  sale.text = ctx.session.postText
  sale.buttons = ctx.session.saleButtons
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

O.addButtons.handler = async (ctx) => {
  ctx.session.saleId = parseQuery(ctx, "Добавить кнопки")
  setState(ctx, "sale:buttons")
  saveLastMsgId(ctx, ctx.msg!)
  await editText(ctx, M.askButtons)
}

O.buttonsToAdd.handler = async (ctx) => {
  const text = ctx.msg.text
  let buttons: Button[][]
  try {
    buttons = parseButtons(text)
  } catch {
    await ctx.reply("Ошибка в формате кнопок, попробуй снова")
    return
  }
  const sale = await SaleDoc.findById(ctx.session.saleId)
  if (!sale) {
    await ctx.reply("Ошибка, зовите Дмитрия!")
    return
  }
  sale.buttons = buttons
  await sale.save()
  setState(ctx)
  const preview = ButtonsPreview(buttons)
  await reply(ctx, M.buttonsAdded(preview))
  await ctx.deleteMessage()
  await tryDeleteLastMsg(ctx)
}
