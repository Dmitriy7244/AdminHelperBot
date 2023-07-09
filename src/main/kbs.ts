import B from "buttons"
import * as config from "config"
import { addButtons } from "core/mod.ts"
import { InlineKeyboard } from "grammy"

const K = {
  schedulePost: new InlineKeyboard().add(B.schedulePost),
  channels: (selected: string[] = []) => {
    const buttons = config.CHANNELS.map((c) => B.channel(c.title, selected))
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
