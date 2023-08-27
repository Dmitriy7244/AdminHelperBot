import { observer as o } from "loader"
import { MsgHandler } from "manager"
import * as handlers from "handlers/content.ts"

o.query("channel").state("content:channel").handler = MsgHandler(
  handlers.askPosts,
)
o.message().state("content:posts").handler = MsgHandler(
  handlers.savePostMessage,
)
o.query("✅ Готово").state("content:posts").handler = MsgHandler(
  handlers.onReady,
)
