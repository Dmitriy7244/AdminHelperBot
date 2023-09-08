import { bot } from "loader"
import { MsgHandler } from "manager"
import { createObserver } from "new/lib.ts"

const obs = createObserver()
const text = `
👋 Привет. Здесь ты можешь добавлять записи о проданной в каналах рекламе, \
а также смотреть расписание. Все необходимые команды смотри в меню.

ℹ️ Если что-то пошло не так, ищи команду /start, чтобы перезапустить бота
`

function sendStart(chatId: number) {
  return bot.sendMessage(chatId, text)
}

obs.command("start").handler = MsgHandler(async (mg) => {
  mg.resetState()
  await sendStart(mg.chatId)
})

export { obs as startObserver, sendStart }
