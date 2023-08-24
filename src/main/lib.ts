import * as api from "api"
import { ADMIN_ID } from "api"
import K from "kbs"
import { bot } from "loader"
import { Button, Post, ScheduledPost, scheduledPostModel } from "models"
import { Document } from "mongoose"
import { BaseContext } from "my_grammy"
import * as mgl from "my_grammy_lib"
import { editReplyMarkup, Msg, Time } from "my_grammy_lib"
import { sleep, sleepRandomAmountOfSeconds } from "sleep"
import { BotCommand, Message } from "tg"
import { Command, MyContext, MySession, QueryPrefix, State } from "types"
import { reschedulePost } from "userbot"

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
  ctx: BaseContext,
  chatId: number,
  messageId: number,
  buttons: Button[][],
) {
  console.log("Trying add button", { chatId, messageId })
  for (let attempts = 0; attempts < 3; attempts++) {
    await sleepRandomAmountOfSeconds(1, 5)
    try {
      await editReplyMarkup(ctx, { inline_keyboard: buttons })
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
  date: number,
) {
  await reschedulePost(post.chatId, post.messageIds, date)
  await post.deleteOne()
}

export function saveLastMsgId(ctx: MyContext, msg: Message) {
  ctx.session.lastMessageId = msg.message_id
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

export function resetSalePost(ctx: MyContext) {
  const s = ctx.session
  s.asForward = false
  s.noSound = false
  s.messageIds = []
  s.postText = undefined
}

export async function finish(ctx: BaseContext, msg: Msg) {
  setState(ctx)
  await mgl.reply(ctx, msg)
}

export async function askNext(
  ctx: BaseContext,
  msg: Msg,
  state: State,
  dataToSave: Partial<MySession> = {},
) {
  ctx.session = { ...ctx.session, ...dataToSave }
  setState(ctx, state)
  await mgl.reply(ctx, msg)
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
