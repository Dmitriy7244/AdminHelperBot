import { observer } from "observer"

const O = {
  start: observer.command("start"),
  channels: observer.command("channels"),
  addSale: observer.command("add_sale"),
  userbot: observer.command("userbot"),
  text: observer.text(),
  // get text() {
  //   return observer.text()
  // },
}

export default O
