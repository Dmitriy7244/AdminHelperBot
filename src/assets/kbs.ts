import B from "buttons"
import { CHANNELS } from "config"
import { InlineKeyboard } from "grammy"
import { addButtons } from "my_grammy_lib"

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
  addButtons = new InlineKeyboard().add(B.addButtons)
}

const K = new Keyboards()
export default K
