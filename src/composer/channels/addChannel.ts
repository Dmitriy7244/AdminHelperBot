import * as handlers from "handlers/channels/addChannel.ts"
import { observer as o } from "loader"
import { MsgHandler } from "manager"

o.message().state("channels_post").handler = MsgHandler(handlers.channelPost)
o.text().state("channels_link").handler = MsgHandler(handlers.link)
o.text().state("channels_title").handler = MsgHandler(handlers.title)
