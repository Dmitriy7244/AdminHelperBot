import * as handlers from "handlers/add_sale/mod.ts"
import { observer as o } from "loader"
import { MsgHandler } from "manager"

await import("./pickChannels.ts")
o.text().state("sale:date").handler = MsgHandler(handlers.date)
o.query("Сегодня").state("sale:date").handler = MsgHandler(handlers.dateToday)
o.query("Завтра").state("sale:date").handler = MsgHandler(handlers.dateTomorrow)
o.text().state("sale:time").handler = MsgHandler(handlers.time)
o.query("Удалить пост").handler = MsgHandler(handlers.onDeletePost)
o.query("Добавить кнопки").handler = MsgHandler(handlers.addButtons)
await import("./addButtons.ts")
o.query("Запланировать пост").handler = MsgHandler(handlers.schedulePost)
await import("./schedulePost.ts")
