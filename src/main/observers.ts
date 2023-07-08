import { observer } from "observer"
import { Prefix } from "./buttons.ts"

const button = (prefix: Prefix) => observer.button(prefix)

const O = {
  start: observer.command("start"),
  channels: observer.command("channels"),
  addSale: observer.command("add_sale"),
  userbot: observer.command("userbot"),
  pickChannel: button("channel"),
  pickAllChannels: button("➕ Выбрать все"),
  ready: button("✅ Готово"),
  asForward: button("asForward"),
  noSound: button("noSound"),
  get text() {
    return observer.text()
  },
  get message() {
    return observer.message()
  },
  schedulePost: button("Запланировать пост"),
}

export default O
