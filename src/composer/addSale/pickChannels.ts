import * as handlers from "handlers/add_sale/pick_channels.ts"
import { observer as o } from "loader"
import { MsgHandler } from "manager"

o.query("channel").state("sale:channels").handler = MsgHandler(handlers.pick)
o.query("➕ Выбрать все").state("sale:channels").handler = MsgHandler(
  handlers.pickAll,
)
o.query("✅ Готово").state("sale:channels").handler = MsgHandler(handlers.ready)
