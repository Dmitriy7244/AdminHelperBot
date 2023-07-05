import { link } from "core"
import * as config from "./config.ts"

function ChannelsText() {
  const links = config.channels.map((c) => link(c.url, c.title))
  const strings = links.map((link) => `🔸 ${link}`)
  return strings.join("\n\n")
}

const T = {
  start: `
👋 Привет. Здесь ты можешь добавлять записи о проданной в каналах рекламе, \
а также смотреть расписание. Все необходимые команды смотри в меню.

ℹ️ Если что-то пошло не так, ищи команду /start, чтобы перезапустить бота
`,
  askDate: `Отправь дату (только число)`,
  askTime: `Отправь время в формате: <b>19 05</b>`,
  sale: `Продажа:`,
  userbot: `Юзербот:`,
  channels: ChannelsText(),
  dateError: "Ошибка в дате, отправь верное число",
  timeError: "Ошибка, отправь время в верном формате",
  askPost: "Теперь ты можешь отправить пост для публикации",
}

export default T
