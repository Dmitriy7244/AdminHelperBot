import * as grammy from "grammy"
import { SessionFlavor } from "grammy"
import { ParseModeFlavor } from "grammy_parse_mode"

export type Session = Record<string, any>

type Context<S extends Session = Session> =
  & ParseModeFlavor<grammy.Context>
  & SessionFlavor<S>

export type { Context }
