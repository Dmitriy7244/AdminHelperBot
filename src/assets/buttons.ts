import { CHANNELS } from "config"
import { CallbackData, PrefixButton } from "loader"
import { CallbackButton } from "my_grammy_lib"

const ChannelCallbackData = (title: string) => CallbackData("channel", title)
const ChannelButton = (title: string) =>
  CallbackButton(ChannelCallbackData(title), title)

class Buttons {
  pickChannel = (title: string, selected: string[]) =>
    CallbackButton(
      ChannelCallbackData(title),
      (selected.includes(title) ? "🔸 " : "") + title,
    )
  pickAll = PrefixButton("➕ Выбрать все")
  ready = PrefixButton("✅ Готово")
  schedulePost = (saleId: string) =>
    CallbackButton(
      CallbackData("Запланировать пост", saleId),
      "Запланировать пост",
    )
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
}

const B = new Buttons()
export const channelButtons = CHANNELS.map((c) => B.channel(c.title))
export default B
