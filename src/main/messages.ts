import { Msg } from "core"
import K from "./kbs.ts"
import { reprSale, Sale } from "./lib.ts"
import T from "./texts.ts"

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
  askChannels: new Msg(T.askChannels, K.channels([])), //TODO
  postOptions: (asForward = false, noSound = false) =>
    new Msg("Настройки публикации", K.postOptions(asForward, noSound)),
}

export default M
