import * as api from "api"
import { ADMIN_ID, CHANNELS, REPORT_CHAT_ID } from "api"
import K from "kbs"
import { bot } from "loader"
import { Channel, ContentPost, ContentPostDoc, Post } from "models"
import { Document } from "mongoose"
import * as mgl from "my_grammy_lib"
import { editReplyMarkup, sendPhoto, Time } from "my_grammy_lib"
import { sleep } from "sleep"
import { BotCommand, Message } from "tg"
import { Command, MyContext, QueryPrefix, State } from "types"

export const setState = mgl.setState<State>
export const parseQuery = mgl.parseQuery<QueryPrefix>

export function findChannel(title: string) {
  for (const c of CHANNELS) {
    if (c.title != title) continue
    return new Channel(c.id, title, c.url)
  }
  throw new Error("Unknown title")
}

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
  await bot.setChatCommands(COMMANDS, REPORT_CHAT_ID)
}

export async function schedulePostDelete(post: Document & Post) {
  const dt = post.deleteTime - Time()
  await sleep(dt)
  post.messageIds.forEach((m) => {
    bot.tryDeleteMsg(post.chatId, m)
  })
  await post.deleteOne()
}

export async function scheduleNewContentPost(chatId: number, delay: number) {
  const post = await ContentPostDoc.findOne({ chatId, date: undefined })
  if (!post) {
    console.log("No content post", { chatId })
    return
  }
  post.date = Time() + delay
  await post.save()
  await scheduleContentPost(post)
}

export async function scheduleContentPost(post: ContentPost & Document) {
  if (!post.date) return
  const delay = post.date - Time()
  await sleep(delay)
  await sendPhoto(bot, post.chatId, post.photoId, post.text, post.entities)
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
  ctx.session.asForward = asForward
  ctx.session.noSound = noSound
  await editReplyMarkup(ctx, K.postOptions(asForward, noSound))
}

export function resetSalePost(ctx: MyContext) {
  const s = ctx.session
  s.asForward = false
  s.noSound = false
  s.messageIds = []
  s.postText = undefined
}
