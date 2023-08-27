import { log } from "deps"
import K from "kbs"
import { updatePostOptions } from "lib"
import { MsgManager, QueryManager } from "manager"
import { Button, saleModel, ScheduledPost } from "models"
import { copyMessages } from "userbot"

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
  const text = mg.text
  const buttons = (mg.inlineKeyboard ?? []) as Button[][]
  if (text) mg.session.postText = text
  mg.session.saleButtons.push(...buttons)
  log("New post message", { text, buttons })
}

// TODO: to big
export async function ready(mg: QueryManager) {
  const messageIds = mg.session.messageIds!

  if (!messageIds.length) {
    await mg.answerQuery("Сначала отправь пост, потом вернись к этой кнопке")
    return
  }

  const saleId = mg.session.saleId!
  const sale = await saleModel.findById(saleId)
  const chatId = mg.chatId
  if (!sale) {
    await mg.reply("Ошибка, зовите Дмитрия")
    return
  }

  sale.text = mg.session.postText
  sale.buttons = mg.session.saleButtons
  sale.deleteTimerHours = mg.session.deleteTimerHours

  for (const c of sale.channels) {
    try {
      const msgIds = await copyMessages(
        c.id,
        chatId,
        messageIds,
        sale.publishDate,
        mg.session.asForward,
        mg.session.noSound,
      )
      sale.scheduledPosts.push(new ScheduledPost(c.id, msgIds))
    } catch (e) {
      mg.reply(`<b>[Ошибка]</b> <code>${e}</code>`)
      return
    }
  }
  await sale.save()
  mg.resetState()
  await mg.editKeyboard(K.addPostButtons(saleId), mg.session.saleMsgId)
  await mg.deleteMessage()
  for (const id of messageIds) {
    await mg.deleteMessage(id)
  }
}
