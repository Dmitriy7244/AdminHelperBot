import { removePrefix } from "core"
import { InlineKeyboardButton } from "tg"
import { Context } from "types"

function CallbackButton(text: string, data?: string): InlineKeyboardButton {
  return { text, callback_data: data ?? text }
}

type Prefix = "channel"
const SEP = ":"
const CallbackData = (prefix: Prefix, payload: string) =>
  `${prefix}${SEP}${payload}`

function parseQuery(ctx: Context, prefix: Prefix) {
  return removePrefix(ctx.callbackQuery!.data!, prefix + SEP)
}

const B = {
  channel: (title: string, selected: string[]) =>
    CallbackButton(
      (selected.includes(title) ? "🔸 " : "") + title,
      CallbackData("channel", title),
    ),
  pickAll: CallbackButton("➕ Выбрать все"),
  ready: CallbackButton("✅ Готово"),
}

export { CallbackData, parseQuery, type Prefix }
export default B
