import { nextYear } from "api"
import dayjs from "dayjs"
import { findChannel } from "db"
import { Msg, PostScheduleData } from "deps"
import { poster } from "loader"
import { MsgManager } from "manager"
import M from "messages"
import { scheduledPostModel } from "models"
import { MyContext } from "types"

export async function askPosts(mg: MsgManager) {
  const title = mg.parseQuery("channel")
  const channel = await findChannel(title)
  await mg.edit(M.content.askPosts, "content:posts", {
    channelId: channel.id,
    filedIds: [],
    messageIds: [],
  })
}

export function savePostMessage(mg: MsgManager) {
  mg.session.messageIds.push(mg.messageId)
  console.log(mg.session)
}

export async function onReady(mg: MsgManager) {
  mg.resetState()
  const date = nextYear(new Date())
  const chatId = mg.session.channelId!
  const messageIds = mg.session.messageIds
  if (!messageIds.length) {
    await mg.edit(new Msg("Сообщений не найдено"))
    return
  }
  console.log(messageIds)
  const result = await tryCopyMessages(mg.ctx, chatId, messageIds, date)
  if (!result) return
  await mg.edit(new Msg("Контент добавлен"))
  await scheduledPostModel.create({ chatId, messageIds: result })
}

async function tryCopyMessages(
  ctx: MyContext,
  chatId: number,
  messageIds: number[],
  _date: Date,
) {
  try {
    const data = new PostScheduleData([chatId], messageIds[0], dayjs(_date))
    return await poster.schedulePost(data)
  } catch (e) {
    await ctx.reply(`<b>[Ошибка]</b> <code>${e}</code>`)
    return false
  }
}
