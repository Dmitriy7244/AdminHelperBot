import Bot from "core/bot.ts"
import { Context } from "core/types.ts"
import Observer from "observer"
import { Command, MySession, State } from "types"

const defaultSession: MySession = {
  asForward: false,
  noSound: false,
  channels: [],
  messageIds: [],
} // TODO: check in handlers
export type MyContext = Context<MySession>

export const bot = Bot.fromEnv(defaultSession)
export const observer = new Observer<MyContext, Command, State>(bot)
