import { MyBot } from "core/bot.ts"
import { BaseContext, Observer } from "my_grammy"
import * as mgl from "my_grammy_lib"
import { Command, MySession, QueryPrefix, State } from "types"

const defaultSession: MySession = {
  asForward: false,
  noSound: false,
  channels: [],
  messageIds: [],
  filedIds: [],
  state: undefined,
  saleButtons: [],
  deleteTimerHours: 24,
}

export type MyContext = BaseContext<MySession>
export const bot = new MyBot(null, defaultSession)
export const CallbackData = mgl.CallbackData<QueryPrefix>
export const PrefixButton = mgl.PrefixButton<QueryPrefix>

export const observer = new Observer<
  MyContext,
  Command,
  State,
  QueryPrefix
>(bot)
