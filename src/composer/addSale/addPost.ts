import * as handlers from "handlers/add_sale/add_post.ts"
import { observer as o } from "loader"
import { MsgHandler } from "manager"

o.text().state("post_interval").handler = MsgHandler(handlers.onPostDelay)
