import Bot from "core/bot.ts"
import * as core from "core/mod.ts"
import { BaseContext } from "core/types.ts"
import Observer from "observer"
import { Command, MySession, QueryPrefix, State } from "types"

const defaultSession: MySession = {
  asForward: false,
  noSound: false,
  channels: [],
  messageIds: [],
}

export type MyContext = BaseContext<MySession>
export const bot = Bot.fromEnv(defaultSession)
export const CallbackData = core.CallbackData<QueryPrefix>
export const PrefixButton = core.PrefixButton<QueryPrefix>

export const observer = new Observer<
  MyContext,
  Command,
  State,
  QueryPrefix
>(bot)
