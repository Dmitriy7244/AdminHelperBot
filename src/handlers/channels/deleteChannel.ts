import { deleteChannel } from "db"
import { MsgManager } from "manager"
import M from "messages"

export async function pickChannel(mg: MsgManager) {
  const title = mg.parseQuery("channel")
  await deleteChannel(title)
  await mg.edit(M.pickChannel())
}
