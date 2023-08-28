import { BaseContext, Bot, mgl, Observer } from "deps"
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
  postIntervalMins: 0,
}

export type MyContext = BaseContext<MySession>
export const bot = new Bot(null, defaultSession)
export const CallbackData = mgl.CallbackData<QueryPrefix>
export const PrefixButton = mgl.PrefixButton<QueryPrefix>

export const observer = new Observer<
  MyContext,
  Command,
  State,
  QueryPrefix
>(bot)
