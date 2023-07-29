import { Channel, Sale } from "models"
import { bold, link } from "my_grammy"

const MONTH_NAMES: Record<number, string> = {
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
}

function reprTimeItem(value: number) {
  return value.toString().padStart(2, "0")
}

function reprTime(date_time: Date) {
  return [date_time.getHours(), date_time.getMinutes()]
    .map(reprTimeItem)
    .join(":")
}

function reprDate(date_time: Date) {
  const month = MONTH_NAMES[date_time.getMonth() + 1]
  return `#${date_time.getDate()}_${month}`
}

function reprDateTime(date: Date) {
  return `📆 ${reprDate(date)}, ${reprTime(date)}`
}

function reprChannel(c: Channel) {
  return `🔸 ${link(c.url, c.title)}`
}

export function reprSale(sale: Sale) {
  const header = `${bold("Продажа")} (👤 ${sale.seller.name})`
  const date_time = reprDateTime(sale.publishDate)
  const channels = sale.channels.map(reprChannel).join("\n")
  return [date_time, header, channels].join("\n\n")
}
