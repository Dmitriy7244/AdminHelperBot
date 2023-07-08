import { bold, link, parseEntity } from "core"
import { Message } from "tg"
import * as config from "./config.ts"
import { Channel, Post, Sale, Seller } from "./models.ts"

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
    config.channels.forEach((c) => {
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
