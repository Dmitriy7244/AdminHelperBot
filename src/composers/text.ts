import { saveLastMsgId } from "lib"
import { bot } from "loader"
import { MsgHandler, MsgManager } from "manager"
import M from "messages"
import { createComposer, onAnyText } from "new/lib.ts"
import { parseChannels } from "../../bot/lib.ts"

const cmp = createComposer()

async function tryAddSale(mg: MsgManager) {
  const result = await _tryAddSale(mg.chatId, mg.urls)
  if (!result) return
  const { channels, sentMsg } = result
  mg.save({ channels })
  mg.setState("sale:date")
  await mg.deleteMessage()
  saveLastMsgId(mg.ctx, sentMsg)
}

onAnyText(cmp).use(MsgHandler(tryAddSale))

export { cmp as textComposer }

async function _tryAddSale(chatId: number, urls: string[]) {
  const channels = parseChannels(urls)
  if (!channels.length) return
  const sentMsg = await bot.sendMessage(chatId, M.askDate)
  return { channels, sentMsg }
}
