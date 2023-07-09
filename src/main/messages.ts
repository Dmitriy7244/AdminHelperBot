import { Msg } from "core/mod.ts"
import K from "kbs"
import { reprSale, Sale } from "lib"
import T from "texts"

const M = {
  hello: new Msg(T.start),
  askDate: new Msg(T.askDate),
  askTime: new Msg(T.askTime),
  userbot: new Msg(T.userbot),
  channels: new Msg(T.channels),
  dateError: new Msg(T.dateError),
  timeError: new Msg(T.timeError),
  askPost: new Msg(T.askPost, K.schedulePost),
  sale: (s: Sale) => new Msg(reprSale(s)),
  askChannels: new Msg(T.askChannels, K.channels()), //TODO
  postOptions: (asForward = false, noSound = false) =>
    new Msg("Настройки публикации", K.postOptions(asForward, noSound)),
}

export default M
