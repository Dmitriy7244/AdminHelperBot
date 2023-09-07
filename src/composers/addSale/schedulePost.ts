import { _onSchedulePost } from "lib"
import { MsgHandler, MsgManager, QueryHandler } from "manager"
import { createComposer, onQuery, withState } from "new/lib.ts"

const cmp = createComposer()

async function schedulePost(mg: MsgManager) {
  const saleId = mg.parseQuery("Запланировать пост")
  mg.save({ postIntervalMins: 0, saleMsgId: mg.messageId })
  await mg.hideKeyboard()
  await _onSchedulePost(mg, saleId)
}

onQuery(cmp, "Запланировать пост").use(MsgHandler(schedulePost))

const cmpWithState = withState(cmp, "sale:post")

onQuery(cmpWithState, "✅ Готово").use(QueryHandler(onPostReady))
onQuery(cmpWithState, "asForward").use(MsgHandler(asForward))
onQuery(cmpWithState, "noSound").use(MsgHandler(noSound))
onQuery(cmpWithState, "Таймер удаления").use(MsgHandler(deleteTimer))
cmpWithState.on("message", MsgHandler(postMessage))

export { cmp as schedulePostComposer }

import { log } from "deps"
import { _onPostReady, updatePostOptions } from "lib"
import { QueryManager } from "manager"
import { Button } from "models"

export async function asForward(mg: MsgManager) {
  await updatePostOptions(mg.ctx, !mg.session.asForward, mg.session.noSound)
}

export async function noSound(mg: MsgManager) {
  await updatePostOptions(mg.ctx, mg.session.asForward, !mg.session.noSound)
}

export async function deleteTimer(mg: MsgManager) {
  let hours = mg.session.deleteTimerHours
  if (hours == 24) hours = 48
  else if (hours == 48) hours = 2
  else hours = 24
  mg.session.deleteTimerHours = hours
  await updatePostOptions(mg.ctx, mg.session.asForward, mg.session.noSound)
}

export function postMessage(mg: MsgManager) {
  mg.session.messageIds.push(mg.messageId)
  const text = mg.getText()
  const buttons = (mg.inlineKeyboard ?? []) as Button[][]
  if (text) mg.session.postText = text
  mg.session.saleButtons.push(...buttons)
  log("New post message", { text, buttons })
}

export async function onPostReady(mg: QueryManager) {
  await _onPostReady(mg, mg.session.postIntervalMins)
}
