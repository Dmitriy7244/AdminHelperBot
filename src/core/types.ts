import * as grammy from "grammy"
import { SessionFlavor } from "grammy"

import { type ParseModeFlavor } from "grammy_parse_mode"

type Context =
  & ParseModeFlavor<grammy.Context>
  & SessionFlavor<Session>

type State = "sale:channels" | "sale:date" | "sale:time" | "sale:post"
type Command = "start" | "add_sale" | "channels" | "userbot" | "test"

type Session = {
  state?: State
  messageIds?: number[]
  channels?: string[]
  date?: Date
  asForward?: boolean
  noSound?: boolean
  lastMessageId?: number
}

type Composer<C extends Context = Context> = grammy.Composer<C>

export type { Command, Composer, Context, Session, State }
