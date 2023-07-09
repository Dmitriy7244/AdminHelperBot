import { Msg } from "core/mod.ts"
import K from "kbs"
import { reprSale, Sale } from "lib"
import T from "texts"

class Messages {
  hello = new Msg(T.start)
  askDate = new Msg(T.askDate)
  askTime = new Msg(T.askTime)
  userbot = new Msg(T.userbot)
  channels = new Msg(T.channels)
  dateError = new Msg(T.dateError)
  timeError = new Msg(T.timeError)
  askPost = new Msg(T.askPost, K.schedulePost)
  sale = (s: Sale) => new Msg(reprSale(s))
  askChannels = new Msg(T.askChannels, K.channels())
  postOptions = (asForward = false, noSound = false) =>
    new Msg(
      `Отправь пост, затем нажми "Готово"`,
      K.postOptions(asForward, noSound),
    )
}

const M = new Messages()
export default M
