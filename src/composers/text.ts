import { saveLastMsgId } from "lib"
import { MsgHandler, MsgManager } from "manager"
import { createComposer, onAnyText } from "new/lib.ts"
import methods from "../../bot/methods/mod.ts"

const cmp = createComposer()

async function tryAddSale(mg: MsgManager) {
  const result = await methods.tryAddSale(mg.chatId, mg.urls)
  if (!result) return
  const { channels, sentMsg } = result
  mg.save({ channels })
  mg.setState("sale:date")
  await mg.deleteMessage()
  saveLastMsgId(mg.ctx, sentMsg)
}

onAnyText(cmp).use(MsgHandler(tryAddSale))

export { cmp as textComposer }
