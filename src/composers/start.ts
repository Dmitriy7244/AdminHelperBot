import { createComposer, onCommand, sendMessage } from "new/lib.ts"

const cmp = createComposer()
const text = `
👋 Привет. Здесь ты можешь добавлять записи о проданной в каналах рекламе, \
а также смотреть расписание. Все необходимые команды смотри в меню.

ℹ️ Если что-то пошло не так, ищи команду /start, чтобы перезапустить бота
`

function sendStart(chatId: number) {
  return sendMessage(chatId, text)
}

onCommand(cmp, "start").use((ctx) => sendStart(ctx.chat.id))

export { cmp as startComposer, sendStart }
