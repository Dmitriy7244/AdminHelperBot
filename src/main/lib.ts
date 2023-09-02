import * as api from "api"
import { ADMIN_ID } from "api"
import dayjs from "dayjs"
import {
  BaseContext,
  BotCommand,
  Document,
  editReplyMarkup,
  log,
  Message,
  mgl,
  Msg,
  PostScheduleData,
  sleep,
  sleepRandomAmountOfSeconds,
  Time,
} from "deps"
import K from "kbs"
import { bot, poster } from "loader"
import { Manager, MsgManager, QueryManager } from "manager"
import M from "messages"
import {
  Button,
  Post,
  saleModel,
  ScheduledPost,
  scheduledPostModel,
} from "models"
import { Command, MyContext, MySession, QueryPrefix, State } from "types"

export const setState = mgl.setState<State>
export const parseQuery = mgl.parseQuery<QueryPrefix>

function Command(command: Command, description: string): BotCommand {
  return { command, description }
}

const COMMANDS = [
  Command("start", "Перезапустить бота"),
  Command("add_sale", "Добавить продажу"),
  Command("channels", "Список каналов"),
  Command("check_rights", "Проверить права"),
  Command("content", "Запланировать контент"),
]

export async function setCommands() {
  await bot.api.setMyCommands(COMMANDS)
  await bot.setChatCommands(COMMANDS, ADMIN_ID)
  // await bot.setChatCommands(COMMANDS, REPORT_CHAT_ID)
}

export function reformatTime(time: string) {
  const re = /(\w{2})(\w{2})/
  return time.replace(re, "$1 $2")
}

export async function trySetButtons(
  mg: Manager,
  chatId: number,
  messageId: number,
  buttons: Button[][],
) {
  console.log("Trying add button", { chatId, messageId })
  for (let attempts = 0; attempts < 3; attempts++) {
    await sleepRandomAmountOfSeconds(1, 5)
    try {
      await editReplyMarkup(mg.ctx, { inline_keyboard: buttons })
      console.log("Buttons set", { attempts, chatId, messageId })
      return
    } catch (e) {
      console.log("Failed to set buttons", { attempts, chatId, messageId }, e)
    }
  }
  await bot.api.sendMessage(ADMIN_ID, "Ошибка с кнопками")
}

export async function schedulePostDelete(post: Document & Post) {
  const dt = post.deleteTime - Time()
  await sleep(dt)
  post.messageIds.forEach((m) => {
    bot.tryDeleteMsg(post.chatId, m)
  })
  await post.deleteOne()
}

export async function scheduleNewContentPost(chatId: number, date: number) {
  const post = await scheduledPostModel.findOne({ chatId })
  if (!post) {
    console.log("No content post", { chatId })
    return
  }
  await scheduleContentPost(post, date)
}

export async function scheduleContentPost(
  post: ScheduledPost & Document,
  _date: number,
) {
  console.log("Scheduling content post not implemented")
  // await poster.reschedulePost(post.chatId, post.messageIds, date)
  await post.deleteOne()
}

export function saveLastMsgId(mg: Manager, msg: Message) {
  mg.save({ lastMessageId: msg.message_id })
}

export async function tryDeleteLastMsg(ctx: MyContext) {
  const msgId = ctx.session.lastMessageId
  if (!msgId) return
  await bot.tryDeleteMsg(ctx.chat!.id, msgId)
}

export function parseChannels(msg: Message): string[] {
  return api.parseChannels(msg.text!, msg.entities ?? [])
}

export async function updatePostOptions(
  ctx: MyContext,
  asForward = false,
  noSound = false,
) {
  const deleteTimerHours = ctx.session.deleteTimerHours
  ctx.session.asForward = asForward
  ctx.session.noSound = noSound
  await editReplyMarkup(
    ctx,
    K.postOptions(deleteTimerHours, asForward, noSound),
  )
}

export function resetSalePost(mg: Manager) {
  const s = mg.session
  s.asForward = false
  s.noSound = false
  s.messageIds = []
  s.postText = undefined
  s.deleteTimerHours = 48
  s.saleButtons = []
}

export async function finish(ctx: BaseContext, msg: Msg) {
  setState(ctx)
  await mgl.reply(ctx, msg)
}

export async function askNext(
  ctx: BaseContext,
  msg: Msg,
  state?: State,
  dataToSave: Partial<MySession> = {},
) {
  ctx.session = { ...ctx.session, ...dataToSave }
  if (state !== undefined) setState(ctx, state)
  return await mgl.reply(ctx, msg)
}

export async function replyError(
  ctx: BaseContext,
  text: string,
): Promise<never> {
  await ctx.reply(text)
  cancelHandlers()
}

export function cancelHandlers(): never {
  throw new CancelException()
}

export class CancelException extends Error {}

export async function _onSchedulePost(mg: MsgManager, saleId: string) {
  log("Schedule post", { saleId })
  resetSalePost(mg)
  const m = M.postOptions(
    mg.session.deleteTimerHours,
    mg.session.asForward,
    mg.session.noSound,
  )
  await mg.reply(m, "sale:post", { saleId })
}

export async function _onPostReady(mg: QueryManager, delayMins = 0) {
  const messageIds = mg.session.messageIds!

  if (!messageIds.length) {
    await mg.answerQuery("Сначала отправь пост, потом вернись к этой кнопке")
    return
  }

  const saleId = mg.session.saleId!
  const sale = await saleModel.findById(saleId)
  if (!sale) {
    await mg.reply("Ошибка, зовите Дмитрия")
    return
  }

  sale.text = mg.session.postText
  sale.buttons = mg.session.saleButtons
  sale.deleteTimerHours = mg.session.deleteTimerHours

  const date = dayjs(sale.publishDate).add(delayMins, "minute")
  const chatIds = sale.channels.map((c) => c.id)
  const dto = new PostScheduleData(
    chatIds,
    messageIds[0],
    date,
    mg.session.noSound,
    mg.session.asForward,
  )

  try {
    sale.postGroupId = await poster.schedulePost(dto, sale.postGroupId)
  } catch (e) {
    await mg.replyError(`<b>[Ошибка]</b> <code>${e}</code>`)
  }
  await sale.save()
  mg.resetState()
  await mg.editKeyboard(K.managePosts(saleId), mg.session.saleMsgId)
  await mg.deleteMessage()
  for (const id of messageIds) {
    await mg.deleteMessage(id)
  }
}
