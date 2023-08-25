import { CHANNELS } from "db"
import { MessageEntity, parseEntity } from "deps"
import { saleModel } from "models"

function _parseLink(text: string, entity: MessageEntity) {
  if (entity.type == "mention") {
    const mention = parseEntity(entity, text)
    return mention.replace("@", "https://t.me/")
  } else if (entity.type == "url") {
    return parseEntity(entity, text)
  } else if (entity.type == "text_link") {
    return entity.url
  }
}

export function parseLink(text: string, entities: MessageEntity[]) {
  for (const entity of entities) {
    const link = _parseLink(text, entity)
    if (link) return link
  }
}

export function parseChannels(
  text: string,
  entities: MessageEntity[],
) {
  const channels: string[] = []
  let url: string | undefined
  for (const entity of entities) {
    url = parseLink(text, [entity])
    if (!url) continue
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
