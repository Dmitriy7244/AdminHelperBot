import { Context, SessionFlavor } from "grammy"
import { ParseModeFlavor } from "grammy_parse_mode"

export type Session = Record<string, any>

type BaseContext<S extends Session = Session> =
  & ParseModeFlavor<Context>
  & SessionFlavor<S>

export type { BaseContext }
