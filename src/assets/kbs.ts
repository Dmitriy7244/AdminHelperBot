import B, { channelButtons } from "buttons"
import { CHANNELS } from "config"
import { InlineKeyboard } from "grammy"
import { addButtons } from "my_grammy_lib"

class Keyboards {
  schedulePost = new InlineKeyboard().add(B.schedulePost)
  pickChannels = (selected: string[] = []) => {
    const buttons = CHANNELS.map((c) => B.pickChannel(c.title, selected))
    return addButtons(new InlineKeyboard(), buttons, 2).add(B.pickAll, B.ready)
  }
  pickChannel = addButtons(new InlineKeyboard(), channelButtons, 2)
  postOptions = (asForward = false, noSound = false) => {
    return new InlineKeyboard()
      .add(B.asForward(asForward), B.noSound(noSound)).row()
      .add(B.ready)
  }
  ready = new InlineKeyboard().add(B.ready)
  addPostButtons = new InlineKeyboard().add(B.addButtons)
}

const K = new Keyboards()
export default K
