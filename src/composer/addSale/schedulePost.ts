import * as handlers from "handlers/add_sale/schedule_post.ts"
import { observer as o } from "loader"
import { MsgHandler, QueryHandler } from "manager"

o.query("✅ Готово").state("sale:post").handler = QueryHandler(handlers.ready)
o.query("asForward").handler = MsgHandler(handlers.asForward)
o.query("noSound").handler = MsgHandler(handlers.noSound)
o.query("Таймер удаления").handler = MsgHandler(handlers.deleteTimer)
o.message().state("sale:post").handler = MsgHandler(handlers.postMessage)
