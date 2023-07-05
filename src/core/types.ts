import * as grammy from "grammy"
import { SessionFlavor } from "grammy"

import { type ParseModeFlavor } from "grammy_parse_mode"

type Context =
  & ParseModeFlavor<grammy.Context>
  & SessionFlavor<Session>

type State = "sale:date" | "sale:time"
type Command = "start" | "add_sale" | "channels" | "userbot"

type Session = {
  state?: State
  channels?: string[]
  date?: Date
}

type Composer<C extends Context = Context> = grammy.Composer<C>

export type { Command, Composer, Context, Session, State }
