import { MyBot } from "core/bot.ts"
import * as core from "core/mod.ts"
import { BaseContext, Observer } from "my_grammy"
import { Command, MySession, QueryPrefix, State } from "types"

const defaultSession: MySession = {
  asForward: false,
  noSound: false,
  channels: [],
  messageIds: [],
  state: undefined,
}

export type MyContext = BaseContext<MySession>
export const bot = new MyBot(null, defaultSession)
export const CallbackData = core.CallbackData<QueryPrefix>
export const PrefixButton = core.PrefixButton<QueryPrefix>

export const observer = new Observer<
  MyContext,
  Command,
  State,
  QueryPrefix
>(bot)
