import { CHANNELS } from "db"
import { exclude } from "deps"
import K from "kbs"
import { saveLastMsgId } from "lib"
import { MsgManager } from "manager"
import M from "messages"

export async function pick(mg: MsgManager) {
  const channel = mg.parseQuery("channel")
  let channels = mg.session.channels
  if (channels.includes(channel)) channels = exclude(channels, channel)
  else channels.push(channel)
  mg.session.channels = channels
  await mg.editKeyboard(K.pickChannels(channels))
}

export async function pickAll(mg: MsgManager) {
  let channels = mg.session.channels
  if (channels.length == CHANNELS.length) channels = []
  else channels = CHANNELS.map((c) => c.title)
  mg.session.channels = channels
  await mg.editKeyboard(K.pickChannels(channels))
}

export async function ready(mg: MsgManager) {
  const channels = mg.session.channels
  if (!channels.length) {
    await mg.ctx.answerCallbackQuery("Выбери хотя бы один канал")
    return
  }
  const msg = await mg.reply(M.askDate, "sale:date")
  saveLastMsgId(mg, msg)
  await mg.deleteMessage()
}
