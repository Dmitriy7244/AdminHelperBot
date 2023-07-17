import { CallbackButton } from "core/mod.ts"
import { CallbackData, PrefixButton } from "loader"

class Buttons {
  channel = (title: string, selected: string[]) =>
    CallbackButton(
      CallbackData("channel", title),
      (selected.includes(title) ? "🔸 " : "") + title,
    )
  pickAll = PrefixButton("➕ Выбрать все")
  ready = PrefixButton("✅ Готово")
  schedulePost = PrefixButton("Запланировать пост")
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
  addButtons = PrefixButton("Добавить кнопки")
}

const B = new Buttons()
export default B
