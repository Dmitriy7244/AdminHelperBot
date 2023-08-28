import { log } from "deps"
import { _onPostReady, updatePostOptions } from "lib"
import { MsgManager, QueryManager } from "manager"
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
