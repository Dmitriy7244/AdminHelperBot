import * as handlers from "handlers/channels/deleteChannel.ts"
import { observer as o } from "loader"
import { MsgHandler } from "manager"

o.query("channel").state("channels_delete").handler = MsgHandler(
  handlers.pickChannel,
)
