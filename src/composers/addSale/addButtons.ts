import { ButtonsPreview, parseButtons } from "api"
import { tryDeleteLastMsg } from "lib"
import { MsgManager } from "manager"
import M from "messages"
import { Button, saleRepo } from "models"

import { handleAddButtons } from "composers/addSale/lib.ts"
import { poster } from "loader"
import { MsgHandler } from "manager"
import { createComposer, onQuery, onText } from "new/lib.ts"

const cmp = createComposer()

export async function buttonsToAdd(mg: MsgManager) {
  const text = mg.text
  let buttons: Button[][]
  try {
    buttons = parseButtons(text)
  } catch {
    await mg.reply("Ошибка в формате кнопок, попробуй снова")
    return
  }
  const sale = await saleRepo.get(mg.session.saleId!)
  sale.buttons = buttons
  await saleRepo.save(sale)
  const preview = ButtonsPreview(buttons)
  await mg.finish(M.buttonsAdded(preview))
  await mg.deleteMessage()
  await tryDeleteLastMsg(mg.ctx)
  await poster.setPostButtons(sale.postGroupId!, buttons)
}

onText(cmp, "sale:buttons").use(MsgHandler(buttonsToAdd))
onQuery(cmp, "Добавить кнопки").use(handleAddButtons)

export { cmp as addButtonsComposer }
