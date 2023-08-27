import { CHANNELS } from "db"
import { CallbackButton } from "deps"
import { CallbackData, PrefixButton } from "loader"
import { QueryPrefix } from "types"

const ChannelCallbackData = (title: string) => CallbackData("channel", title)
const ChannelButton = (title: string) =>
  CallbackButton(ChannelCallbackData(title), title)

function DataButton(prefix: QueryPrefix, data: string) {
  const d = CallbackData(prefix, data)
  return CallbackButton(d, prefix)
}

class Buttons {
  deletePost = (saleId: string) => DataButton("Удалить пост", saleId)
  pickChannel = (title: string, selected: string[]) =>
    CallbackButton(
      ChannelCallbackData(title),
      (selected.includes(title) ? "🔸 " : "") + title,
    )
  pickAll = PrefixButton("➕ Выбрать все")
  ready = PrefixButton("✅ Готово")
  schedulePost = (saleId: string) => DataButton("Запланировать пост", saleId)
  asForward = (value = false) =>
    PrefixButton(
      "asForward",
      "Репост: " + (value ? "да" : "нет"),
    )
  noSound = (value = false) =>
    PrefixButton(
      "noSound",
      "Без звука: " + (value ? "да" : "нет"),
    )
  addButtons = (saleId: string) =>
    CallbackButton(
      CallbackData("Добавить кнопки", saleId),
      "Добавить кнопки",
    )
  channel = (title: string) => ChannelButton(title)
  today = PrefixButton("Сегодня")
  tomorrow = PrefixButton("Завтра")
  deleteTimer = (hours: number) =>
    PrefixButton("Таймер удаления", `Таймер удаления: ${hours}ч`)
  addChannel = PrefixButton("Добавить канал")
  deleteChannel = PrefixButton("Удалить канал")
}

const B = new Buttons()
export const channelButtons = () => CHANNELS.map((c) => B.channel(c.title))
export default B
