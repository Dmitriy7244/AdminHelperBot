import B, { channelButtons } from "buttons"
import { CHANNELS } from "db"
import { InlineKeyboard } from "grammy"
import { addButtons } from "my_grammy_lib"

class Keyboards {
  schedulePost = (saleId: string) =>
    new InlineKeyboard().add(B.schedulePost(saleId))
  pickChannels = (selected: string[] = []) => {
    const buttons = CHANNELS.map((c) => B.pickChannel(c.title, selected))
    return addButtons(new InlineKeyboard(), buttons, 2).add(B.pickAll, B.ready)
  }
  pickChannel = addButtons(new InlineKeyboard(), channelButtons, 2)
  postOptions = (
    deleteTimerHours: number,
    asForward = false,
    noSound = false,
  ) => {
    return new InlineKeyboard()
      .add(B.asForward(asForward), B.noSound(noSound)).row()
      .add(B.deleteTimer(deleteTimerHours)).row()
      .add(B.ready)
  }
  ready = new InlineKeyboard().add(B.ready)
  addPostButtons = (saleId: string) =>
    new InlineKeyboard().add(B.addButtons(saleId))
  dates = addButtons(new InlineKeyboard(), [B.today, B.tomorrow])
}

const K = new Keyboards()
export default K
