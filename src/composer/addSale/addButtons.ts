import * as handlers from "handlers/add_sale/add_buttons.ts"
import { observer as o } from "loader"
import { MsgHandler } from "manager"

o.text().state("sale:buttons").handler = MsgHandler(handlers.buttonsToAdd)
