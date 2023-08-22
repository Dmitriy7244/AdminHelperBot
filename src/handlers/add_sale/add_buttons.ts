import { ButtonsPreview, parseButtons } from "api"
import { parseQuery, saveLastMsgId, setState, tryDeleteLastMsg } from "lib"
import M from "messages"
import { Button, SaleDoc } from "models"
import { editText, reply } from "my_grammy_lib"
import observers from "observers"

const o = observers.addSale.addButtons

o._.handler = async (ctx) => {
  ctx.session.saleId = parseQuery(ctx, "Добавить кнопки")
  setState(ctx, "sale:buttons")
  saveLastMsgId(ctx, ctx.msg!)
  await editText(ctx, M.askButtons)
}

o.buttonsToAdd.handler = async (ctx) => {
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
