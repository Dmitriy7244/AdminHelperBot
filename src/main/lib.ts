import { ADMIN_ID, CHANNELS, REPORT_CHAT_ID } from "config"
import K from "kbs"
import { bot } from "loader"
import {
  Channel,
  ContentPost,
  ContentPostDoc,
  Post,
  Sale,
  SaleDoc,
} from "models"
import { Document } from "mongoose"
import { bold, link } from "my_grammy"
import * as mgl from "my_grammy_lib"
import { editReplyMarkup, parseEntity, Time } from "my_grammy_lib"
import { sleep } from "sleep"
import { BotCommand, Message } from "tg"
import { Command, MyContext, QueryPrefix, State } from "types"

export const setState = mgl.setState<State>
export const parseQuery = mgl.parseQuery<QueryPrefix>

export async function findSale(text: string) {
  const sales = await SaleDoc.find({ text }).exec()
  if (!sales.length) return
  return sales[sales.length - 1]
}

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

function ChatScope(chat_id: number) {
  return { chat_id, type: "chat" } as const
}

export async function setCommands() {
  await bot.api.setMyCommands(COMMANDS)
  await bot.api.setMyCommands(COMMANDS, { scope: ChatScope(ADMIN_ID) })
  await bot.api.setMyCommands(COMMANDS, { scope: ChatScope(REPORT_CHAT_ID) })
}

export async function schedulePostDelete(post: Document & Post) {
  const dt = post.deleteTime - Time()
  await sleep(dt)
  post.messageIds.forEach((m) => {
    tryDeleteMsg(post.chatId, m)
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
  await bot.api.sendPhoto(post.chatId, post.photoId)
  await post.deleteOne()
}

// TODO: more log info
export async function tryDeleteMsg(chatId: number, msgId: number) {
  try {
    await bot.api.deleteMessage(chatId, msgId)
  } catch (e) {
    console.log(e)
  }
}

export function saveLastMsgId(ctx: MyContext, msg: Message) {
  ctx.session.lastMessageId = msg.message_id
}

export async function tryDeleteLastMsg(ctx: MyContext) {
  const msgId = ctx.session.lastMessageId
  if (!msgId) return
  await tryDeleteMsg(ctx.chat!.id, msgId)
}

function parseChannels(msg: Message): string[] {
  const channels: string[] = []
  let url: string
  for (const entity of msg.entities ?? []) {
    if (entity.type == "mention") {
      const mention = parseEntity(entity, msg.text!)
      url = mention.replace("@", "https://t.me/")
    } else if (entity.type == "url") {
      url = parseEntity(entity, msg.text!)
    } else if (entity.type == "text_link") {
      url = entity.url
    } else continue
    CHANNELS.forEach((c) => {
      if (c.url == url) channels.push(c.title)
    })
  }
  return channels
}

// TODO
function resolveDate(value: string): Date {
  const result = Number(value)
  if (!Number.isInteger(result)) throw new Error("Bad value") // TODO
  const baseDate = new Date()
  if (result < baseDate.getDate()) nextMonth(baseDate)
  return new Date(baseDate.getFullYear(), baseDate.getMonth(), result)
}

function nextMonth(date: Date) {
  date.setMonth(date.getMonth() + 1)
}

function resolveDatetime(time: string, base_date: Date) {
  let [hour, minute] = time.split(" ").map(Number)
  minute = minute || 0
  if (!Number.isInteger(hour) || !Number.isInteger(minute)) {
    throw new Error("Bad time") // TODO
  }
  base_date.setHours(hour, minute)
}

function reprTimeItem(value: number) {
  return value.toString().padStart(2, "0") // TODO
}

function reprTime(date_time: Date) {
  return [date_time.getHours(), date_time.getMinutes()]
    .map(reprTimeItem)
    .join(":")
}

function reprDate(date_time: Date) {
  const month = {
    1: "января",
    2: "февраля",
    3: "марта",
    4: "апреля",
    5: "мая",
    6: "июня",
    7: "июля",
    8: "августа",
    9: "сентября",
    10: "октября",
    11: "ноября",
    12: "декабря",
  }[date_time.getMonth() + 1]
  return `#${date_time.getDate()}_${month}`
}

function reprDateTime(date: Date) {
  return `📆 ${reprDate(date)}, ${reprTime(date)}`
}

function reprChannel(c: Channel) {
  return `🔸 ${link(c.url, c.title)}`
}

function reprSale(sale: Sale) {
  const header = `${bold("Продажа")} (👤 ${sale.seller.name})`
  const date_time = reprDateTime(sale.publishDate)
  const channels = sale.channels.map(reprChannel).join("\n")
  return [date_time, header, channels].join("\n\n")
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

export { parseChannels, reprSale, resolveDate, resolveDatetime }
