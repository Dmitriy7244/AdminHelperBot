import B from "buttons"
import { CHANNELS } from "config"
import { addButtons } from "core/mod.ts"
import { InlineKeyboard } from "grammy"

class Keyboards {
  schedulePost = new InlineKeyboard().add(B.schedulePost)
  channels = (selected: string[] = []) => {
    const buttons = CHANNELS.map((c) => B.channel(c.title, selected))
    return addButtons(new InlineKeyboard(), buttons, 2).add(B.pickAll, B.ready)
  }
  postOptions = (asForward = false, noSound = false) => {
    return new InlineKeyboard()
      .add(B.asForward(asForward), B.noSound(noSound)).row()
      .add(B.ready)
  }
  ready = new InlineKeyboard().add(B.ready)
}

const K = new Keyboards()
export default K
