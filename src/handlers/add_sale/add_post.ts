import { mongoose } from "https://deno.land/x/my_mongo@v0.1.0/deps.ts"
import { _onSchedulePost, tryDeleteLastMsg } from "lib"
import { MsgManager } from "manager"

export async function onPostDelay(mg: MsgManager) {
  const delay = Number(mg.text)
  if (!Number.isInteger(delay)) await mg.replyError("Отправь только число")
  mg.save({ postIntervalMins: delay })
  await _onSchedulePost(mg, mg.session.saleId!)
  await tryDeleteLastMsg(mg.ctx)
  await mg.deleteMessage()
}

console.log(mongoose.modelNames())
