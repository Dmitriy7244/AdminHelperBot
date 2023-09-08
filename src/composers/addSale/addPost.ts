import { saveLastMsgId } from "lib"
import { MsgHandler, MsgManager } from "manager"
import { createComposer, onQuery, onText } from "new/lib.ts"

const cmp = createComposer()

async function addPost(mg: MsgManager) {
  const saleId = mg.parseQuery("Добавить пост")
  await mg.hideKeyboard()
  const msg = await mg.reply(
    "Через сколько минут после основного поста опубликовать этот пост?",
    "post_interval",
    { saleId, saleMsgId: mg.messageId },
  )
  saveLastMsgId(mg.ctx, msg)
}

onQuery(cmp, "Добавить пост").use(MsgHandler(addPost))
onText(cmp, "post_interval").use(MsgHandler(onPostDelay))

export { cmp as addPostComposer }

import { _onSchedulePost, tryDeleteLastMsg } from "lib"
import { cancelHandlers } from "deps"

export async function onPostDelay(mg: MsgManager) {
  const delay = Number(mg.text)
  if (!Number.isInteger(delay)) {
    await mg.reply("Отправь только число")
    cancelHandlers()
  }
  mg.save({ postIntervalMins: delay })
  await _onSchedulePost(mg, mg.session.saleId!)
  await tryDeleteLastMsg(mg.ctx)
  await mg.deleteMessage()
}
