import { addButtons } from "core"
import { InlineKeyboard } from "grammy"
import B from "./buttons.ts"
import * as config from "./config.ts"

const K = {
  schedulePost: new InlineKeyboard().add(B.schedulePost),
  channels: (selected: string[]) => {
    const buttons = config.channels.map((c) => B.channel(c.title, selected))
    return addButtons(new InlineKeyboard(), buttons, 2).add(B.pickAll, B.ready)
  },
  postOptions: (asForward = false, noSound = false) => {
    return new InlineKeyboard()
      .add(B.asForward(asForward), B.noSound(noSound)).row()
      .add(B.ready)
  },
  ready: new InlineKeyboard().add(B.ready),
}

export default K
