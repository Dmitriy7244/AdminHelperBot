import { Message } from "deps"
import { BaseContext, Bot, Composer, Msg } from "new/deps.ts"
import { Command, MySession, QueryPrefix, State } from "types"
import { parseUrls as _parseUrls } from "../packages/manager/MsgManager.ts"

const defaultSession: MySession = {
  asForward: false,
  noSound: false,
  channels: [],
  messageIds: [],
  filedIds: [],
  state: undefined,
  saleButtons: [],
  deleteTimerHours: 24,
  postIntervalMins: 0,
}

export type MyContext = BaseContext<MySession>

class CancelError extends Error {}

export const bot = new Bot(null, defaultSession)
bot.catch((err) => {
  if (err.error instanceof CancelError) return
  console.error(err)
})

export function cancelHandlers(): never {
  throw new CancelError()
}

export function sendMessage(chatId: number, msg: string | Msg) {
  if (typeof msg == "string") msg = new Msg(msg)
  return bot.api.sendMessage(chatId, msg.text, {
    reply_markup: msg.keyboard,
    disable_web_page_preview: true,
  })
}

export const createComposer = () => new Composer<MyContext>()

export function onQuery<C extends MyContext>(
  composer: Composer<C>,
  prefix: QueryPrefix,
) {
  return composer.on("callback_query:data").filter((ctx) => {
    const data = ctx.callbackQuery?.data
    return data ? data.startsWith(prefix) : false
  })
}

export function onCommand<C extends MyContext>(
  composer: Composer<C>,
  command: Command,
) {
  return composer.command(command)
}

export function onQueryWithState<C extends MyContext>(
  composer: Composer<C>,
  prefix: QueryPrefix,
  state: State,
) {
  return withState(onQuery(composer, prefix), state)
}

export function onMessage<C extends MyContext>(
  composer: Composer<C>,
  state: State,
) {
  return withState(composer.on("message"), state)
}

export function withState<C extends MyContext>(
  composer: Composer<C>,
  state: State,
) {
  return composer.filter((c) => c.session.state == state)
}

export function onText<C extends MyContext>(
  composer: Composer<C>,
  state: State,
) {
  return withState(composer.on("message:text"), state)
}

export function onAnyText<C extends MyContext>(
  composer: Composer<C>,
) {
  return composer.on("message:text")
}

export function onChannelPost<C extends MyContext>(
  composer: Composer<C>,
) {
  return composer.on("channel_post")
}

export function parseUrls(message: Message) {
  return _parseUrls(message.text ?? "", message.entities ?? [])
}
