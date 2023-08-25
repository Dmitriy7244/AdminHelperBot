import { reprSale } from "api"
import { Msg } from "deps"
import K from "kbs"
import { Sale } from "models"
import T from "texts"

class Messages {
  hello = new Msg(T.start)
  askDate = new Msg(T.askDate, K.dates)
  askTime = new Msg(T.askTime)
  userbot = new Msg(T.userbot)
  channels = () => new Msg(T.channels(), K.ChangeChannels)
  dateError = new Msg(T.dateError)
  timeError = new Msg(T.timeError)
  askPost = (saleId: string) => new Msg(T.suggestPost, K.schedulePost(saleId))
  sale = (s: Sale) => new Msg(reprSale(s))
  askChannels = new Msg(T.askChannels, K.pickChannels())
  postOptions = (
    deleteTimerHours: number,
    asForward = false,
    noSound = false,
  ) => new Msg(T.askPost, K.postOptions(deleteTimerHours, asForward, noSound))
  postScheduled = (saleId: string) =>
    new Msg("Пост запланирован", K.addPostButtons(saleId))
  askButtons = new Msg(T.askButtons)
  buttonsAdded = (preview: string) => new Msg(`Добавлены кнопки:\n\n${preview}`)
  pickChannel = () => new Msg("Выбери канал", K.pickChannel())
  content = {
    askChannel: this.pickChannel,
    askPosts: new Msg(T.askContentPost, K.ready),
  }
}

export const messages = {
  channels: {
    addChannel: {
      askPost: new Msg("Отправь любой пост из канала"),
      askLink: new Msg("Отправь главную ссылку на этот канал"),
      askTitle: new Msg("Выбери название для канала"),
      success: new Msg("Канал успешно добавлен!"),
    },
  },
}

const M = new Messages()
export default M
