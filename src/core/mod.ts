import { InlineKeyboardButton } from "tg";
import { bot } from "loader";

export function setKeyboard(
  chatId: number | string,
  msgId: number,
  inline_keyboard: InlineKeyboardButton[][],
) {
  return bot.api.editMessageReplyMarkup(chatId, msgId, {
    reply_markup: { inline_keyboard },
  })
}
