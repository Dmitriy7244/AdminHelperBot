import { CHANNELS } from "config"
import { bold, link } from "my_grammy"

function ChannelsText() {
  const links = CHANNELS.map((c) => link(c.url, c.title))
  const strings = links.map((link) => `🔸 ${link}`)
  return strings.join("\n")
}

class Texts {
  start = `
👋 Привет. Здесь ты можешь добавлять записи о проданной в каналах рекламе, \
а также смотреть расписание. Все необходимые команды смотри в меню.

ℹ️ Если что-то пошло не так, ищи команду /start, чтобы перезапустить бота
`
  askDate = `Отправь дату (только число)`
  askTime = `Отправь время в формате: ${bold("19 05")}`
  sale = `Продажа:`
  userbot = `Юзербот:`
  channels = ChannelsText()
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
}

const T = new Texts()
export default T
