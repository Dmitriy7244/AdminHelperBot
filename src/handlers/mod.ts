import { saveLastMsgId } from "lib"
import { MsgManager } from "manager"
import M from "messages"
import methods from "../../bot/methods/mod.ts"

export async function start(mg: MsgManager) {
  mg.resetState()
  await methods.start(mg.chatId)
}

export async function test(mg: MsgManager) {
  await mg.finish(M.hello)
}

export async function content(mg: MsgManager) {
  mg.setState("content:channel")
  await methods.sendContentMenu(mg.chatId)
}

export async function addSale(mg: MsgManager) {
  mg.setState("sale:channels")
  mg.save({ channels: [] })
  await methods.sendSaleChannelsMenu(mg.chatId)
  await mg.deleteMessage()
}

export async function showChannels(mg: MsgManager) {
  await methods.sendChannelsMenu(mg.chatId)
}

import("./channels/mod.ts")

export async function checkRights(mg: MsgManager) {
  await methods.sendChannelsRights(mg.chatId)
}

import("./add_sale/mod.ts")
import("./content.ts")

export async function handleChannelPost(mg: MsgManager) {
  await methods.handleChannelPost(
    mg.chatId,
    mg.messageId,
    mg.text,
    mg.getMediaGroupId(),
  )
}

export async function tryAddSale(mg: MsgManager) {
  const result = await methods.tryAddSale(mg.chatId, mg.urls)
  if (!result) return
  const { channels, sentMsg } = result
  mg.save({ channels })
  mg.setState("sale:date")
  await mg.deleteMessage()
  saveLastMsgId(mg, sentMsg)
}
