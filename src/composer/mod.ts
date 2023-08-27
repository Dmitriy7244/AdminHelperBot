import * as handlers from "handlers/mod.ts"
import { observer as o } from "loader"
import { MsgHandler, MsgManager } from "manager"
import { Command } from "types"

function onCommand(cmd: Command, callback: (mg: MsgManager) => any) {
  o.command(cmd).handler = MsgHandler(callback)
}

function onChannelPost(callback: (mg: MsgManager) => any) {
  o.channelPost().handler = MsgHandler(callback)
}

function onText(callback: (mg: MsgManager) => any) {
  o.text().handler = MsgHandler(callback)
}


onCommand("start", handlers.start)
onCommand("test", handlers.test)
onCommand("content", handlers.content)
await import("./content.ts")
onCommand("add_sale", handlers.addSale)
await import("./addSale/mod.ts")
onCommand("check_rights", handlers.checkRights)
onCommand("channels", handlers.showChannels)
await import("./channels/mod.ts")
onChannelPost(handlers.handleChannelPost)
onText(handlers.tryAddSale)
