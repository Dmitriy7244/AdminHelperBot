import { observer } from "observer"
import { Prefix } from "./buttons.ts"

const button = (prefix: Prefix) => observer.button(prefix)

const O = {
  start: observer.command("start"),
  channels: observer.command("channels"),
  addSale: observer.command("add_sale"),
  userbot: observer.command("userbot"),
  text: observer.text(),
  pickChannel: button("channel"),
}

export default O
