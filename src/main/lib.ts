import * as config from "config"
import * as core from "core/mod.ts"
import { editReplyMarkup, parseEntity, Time } from "core/mod.ts"
import K from "kbs"
import { bot } from "loader"
import { Channel, Sale, Seller } from "models"
import { Document } from "mongoose"
import { bold, link } from "my_grammy"
import { sleep } from "sleep"
import { Message } from "tg"
import { MyContext, State } from "types"
import { Post } from "./models.ts"

export const setState = core.setState<State>

export async function schedulePostDelete(post: Document & Post) {
  const dt = post.deleteTime - Time()
  console.log("start schedule", dt)
  await sleep(dt)
  console.log("deleting")
  post.messageIds.forEach((m) => {
    bot.api.deleteMessage(post.chatId, m)
  })
  await post.deleteOne()
}

export function saveLastMsgId(ctx: MyContext, msg: Message) {
  ctx.session.lastMessageId = msg.message_id
}

export async function tryDeleteLastMsg(ctx: MyContext) {
  const msgId = ctx.session.lastMessageId
  if (!msgId) return
  try {
    await ctx.api.deleteMessage(ctx.chat!.id, msgId)
  } catch (e) {
    console.error(e)
  }
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
    config.CHANNELS.forEach((c) => {
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
  const date_time = reprDateTime(sale.posts[0].publish_date)
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

export {
  Channel,
  parseChannels,
  Post,
  reprSale,
  resolveDate,
  resolveDatetime,
  Sale,
  Seller,
}
