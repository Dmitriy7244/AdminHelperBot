import { MessageEntity, parseEntity } from "deps"

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

export { ButtonsPreview, parseButtons } from "./buttons.ts"
export { ADMIN_ID, REPORT_CHAT_ID } from "config"
export { nextYear, resolveDate, resolveDatetime } from "./dates.ts"
export { reprSale } from "./repr_sale.ts"
