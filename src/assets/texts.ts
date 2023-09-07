import { CHANNELS } from "db"
import { bold, link } from "deps"

function ChannelsText() {
  const links = CHANNELS.map((c) => link(c.url, c.title))
  const strings = links.map((link) => `🔸 ${link}`)
  return strings.join("\n")
}

class Texts {
  askDate = `Отправь дату (только число)`
  askTime = `Отправь время в формате: ${bold("19 05")}`
  sale = `Продажа:`
  userbot = `Юзербот:`
  channels = () => ChannelsText()
  dateError = "Ошибка в дате, отправь верное число"
  timeError = "Ошибка, отправь время в верном формате"
  suggestPost = "Теперь ты можешь отправить пост для публикации"
  askPost = `Отправь пост, затем нажми "Готово"`
  askChannels = "Отметь каналы:"
  askButtons = `
Отправьте боту название кнопки и адрес ссылки. Например, так: 

Telegram telegram.org

Чтобы отправить несколько кнопок за раз, используйте разделитель «|». Каждый новый ряд – с новой строки. Например, так: 

Telegram telegram.org | Новости telegram.org/blog
FAQ telegram.org/faq | Скачать telegram.org/apps`
  askContentPost =
    "Отправь любое количество сообщений, все они будут считаться за один пост, затем нажми кнопку"
}

const T = new Texts()
export default T
