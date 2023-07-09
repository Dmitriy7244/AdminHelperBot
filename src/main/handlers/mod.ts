import { reply, setState } from "core/mod.ts"
import M from "messages"
import O from "observers"
import("./add_sale/mod.ts")

O.start.handler = async (ctx) => {
  setState(ctx)
  await reply(ctx, M.hello)
}
O.channels.handler = (ctx) => reply(ctx, M.channels)
