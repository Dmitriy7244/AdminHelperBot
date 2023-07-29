import K from "kbs"
import { reprSale } from "lib"
import { Sale } from "models"
import { Msg } from "my_grammy"
import T from "texts"

class Messages {
  hello = new Msg(T.start)
  askDate = new Msg(T.askDate)
  askTime = new Msg(T.askTime)
  userbot = new Msg(T.userbot)
  channels = new Msg(T.channels)
  dateError = new Msg(T.dateError)
  timeError = new Msg(T.timeError)
  askPost = new Msg(T.suggestPost, K.schedulePost)
  sale = (s: Sale) => new Msg(reprSale(s))
  askChannels = new Msg(T.askChannels, K.pickChannels())
  postOptions = (asForward = false, noSound = false) =>
    new Msg(T.askPost, K.postOptions(asForward, noSound))
  postScheduled = new Msg("Пост запланирован", K.addPostButtons)
  askButtons = new Msg(T.askButtons)
  buttonsAdded = (preview: string) => new Msg(`Добавлены кнопки:\n\n${preview}`)
  content = {
    askChannel: new Msg("Выбери канал", K.pickChannel),
    askPosts: new Msg(
      "Отправь все посты (только одиночные фото, можно с подписью), затем нажми кнопку",
      K.ready,
    ),
  }
}

const M = new Messages()
export default M
