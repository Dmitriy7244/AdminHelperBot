import { ButtonsPreview, parseButtons } from "api"
import { tryDeleteLastMsg } from "lib"
import { MsgManager } from "manager"
import M from "messages"
import { Button, saleModel } from "models"

export async function buttonsToAdd(mg: MsgManager) {
  const text = mg.text
  let buttons: Button[][]
  try {
    buttons = parseButtons(text)
  } catch {
    await mg.reply("Ошибка в формате кнопок, попробуй снова")
    return
  }
  const sale = await saleModel.findById(mg.session.saleId)
  if (!sale) {
    await mg.reply("Ошибка, зовите Дмитрия!")
    return
  }
  sale.buttons = buttons
  await sale.save()
  const preview = ButtonsPreview(buttons)
  await mg.finish(M.buttonsAdded(preview))
  await mg.deleteMessage()
  await tryDeleteLastMsg(mg.ctx)
}
