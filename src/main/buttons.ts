import { removePrefix } from "core"
import { InlineKeyboardButton } from "tg"
import { Context } from "types"

type Prefix =
  | "channel"
  | "➕ Выбрать все"
  | "✅ Готово"
  | "Запланировать пост"
  | "asForward"
  | "noSound"
const SEP = ":"
const CallbackData = (prefix: Prefix, payload: string) =>
  `${prefix}${SEP}${payload}`
function CallbackButton(data: string, text?: string): InlineKeyboardButton {
  return { text: text ?? data, callback_data: data }
}

function PrefixButton(prefix: Prefix, text?: string) {
  return CallbackButton(prefix, text)
}

function parseQuery(ctx: Context, prefix: Prefix) {
  return removePrefix(ctx.callbackQuery!.data!, prefix + SEP)
}

const B = {
  channel: (title: string, selected: string[]) =>
    CallbackButton(
      CallbackData("channel", title),
      (selected.includes(title) ? "🔸 " : "") + title,
    ),
  pickAll: PrefixButton("➕ Выбрать все"),
  ready: PrefixButton("✅ Готово"),
  schedulePost: PrefixButton("Запланировать пост"),
  asForward: (value = false) =>
    PrefixButton(
      "asForward",
      "Репост: " + (value ? "да" : "нет"),
    ),
  noSound: (value = false) =>
    PrefixButton(
      "noSound",
      "Без звука: " + (value ? "да" : "нет"),
    ),
}

export { CallbackData, parseQuery, type Prefix }
export default B
