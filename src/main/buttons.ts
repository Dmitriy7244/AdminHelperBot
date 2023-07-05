import { removePrefix } from "core"
import { InlineKeyboardButton } from "tg"
import { Context } from "types"

type Prefix = "channel" | "➕ Выбрать все" | "✅ Готово"
const SEP = ":"
const CallbackData = (prefix: Prefix, payload: string) =>
  `${prefix}${SEP}${payload}`
function CallbackButton(data: string, text?: string): InlineKeyboardButton {
  return { text: text ?? data, callback_data: data }
}

function PrefixButton(prefix: Prefix) {
  return CallbackButton(prefix)
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
}

export { CallbackData, parseQuery, type Prefix }
export default B
