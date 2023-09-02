import { MsgManager } from "manager"
import M, { messages } from "messages"

const m = messages.channels.addChannel

export async function addChannel(mg: MsgManager) {
  await mg.edit(m.askPost, "channels_post")
}

export async function deleteChannel(mg: MsgManager) {
  await mg.reply(M.pickChannel(), "channels_delete")
}

import("./addChannel.ts")
import("./deleteChannel.ts")
