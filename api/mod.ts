import { CHANNELS } from "db"
import { saleModel } from "models"
import { parseEntity } from "my_grammy_lib"
import { MessageEntity } from "tg"

export function parseChannels(
  text: string,
  entities: MessageEntity[],
) {
  const channels: string[] = []
  let url: string
  for (const entity of entities) {
    if (entity.type == "mention") {
      const mention = parseEntity(entity, text)
      url = mention.replace("@", "https://t.me/")
    } else if (entity.type == "url") {
      url = parseEntity(entity, text)
    } else if (entity.type == "text_link") {
      url = entity.url
    } else continue
    CHANNELS.forEach((c) => {
      if (c.url == url) channels.push(c.title)
    })
  }
  return channels
}

export async function findSale(text: string) {
  const sales = await saleModel.find({ text }).exec()
  if (!sales.length) return
  return sales[sales.length - 1]
}

export { ADMIN_ID, REPORT_CHAT_ID } from "config"
export { ButtonsPreview, parseButtons } from "./buttons.ts"
export { nextYear, resolveDate, resolveDatetime } from "./dates.ts"
export { reprSale } from "./repr_sale.ts"
