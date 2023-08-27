import * as handlers from "handlers/channels/mod.ts"
import { observer as o } from "loader"
import { MsgHandler } from "manager"

o.query("Добавить канал").handler = MsgHandler(handlers.addChannel)
o.query("Удалить канал").handler = MsgHandler(handlers.deleteChannel)
await import("./addChannel.ts")
await import("./deleteChannel.ts")
