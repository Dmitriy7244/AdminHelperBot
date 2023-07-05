import { addButtons } from "core"
import { InlineKeyboard } from "grammy"
import B from "./buttons.ts"
import * as config from "./config.ts"

const K = {
  skip: new InlineKeyboard().text("Пропустить"),
  channels: (selected: string[]) => {
    const buttons = config.channels.map((c) => B.channel(c.title, selected))
    return addButtons(new InlineKeyboard(), buttons, 2).add(B.pickAll, B.ready)
  },
}

export default K
